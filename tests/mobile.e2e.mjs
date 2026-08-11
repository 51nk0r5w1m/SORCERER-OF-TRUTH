import { expect, test } from "@playwright/test";

const settle = (page) => page.waitForTimeout(180);

async function goTo(page, slideId) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView();
    window.location.hash = id;
  }, slideId);
  await settle(page);
}

async function canvasSignature(page, selector) {
  return page.locator(selector).evaluate((canvas) => {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    if (!ctx || width < 8 || height < 8) return { width, height, signature: "empty" };

    const points = [
      [0.18, 0.22], [0.33, 0.39], [0.51, 0.51], [0.69, 0.64], [0.82, 0.31],
      [0.24, 0.78], [0.45, 0.17], [0.73, 0.84], [0.91, 0.49],
    ];
    const signature = points.map(([x, y]) => {
      const pixel = ctx.getImageData(Math.floor(width * x), Math.floor(height * y), 1, 1).data;
      return `${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3]}`;
    }).join("|");

    return { width, height, signature };
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".slide").first()).toBeVisible();
});

test("no slide has horizontal overflow", async ({ page }) => {
  const overflowing = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    return [...document.querySelectorAll(".slide")].filter((slide) => {
      const rect = slide.getBoundingClientRect();
      return rect.width > viewportWidth + 2;
    }).map((s) => s.id);
  });
  expect(overflowing).toEqual([]);
});

test("text does not leave viewport on any slide", async ({ page }) => {
  const slideIds = await page.locator(".slide").evaluateAll((slides) => slides.map((s) => s.id));

  for (const id of slideIds) {
    await goTo(page, id);
    const overflow = await page.evaluate((slideId) => {
      const slide = document.getElementById(slideId);
      if (!slide) return null;
      const vw = window.innerWidth;
      const texts = slide.querySelectorAll("h1, h2, h3, p, blockquote, li, span");
      for (const t of texts) {
        const rect = t.getBoundingClientRect();
        if (rect.width > 0 && (rect.left < -4 || rect.right > vw + 4)) {
          return { element: t.tagName, left: rect.left, right: rect.right, vw };
        }
      }
      return null;
    }, id);
    expect(overflow, `text overflow on ${id}`).toBeNull();
  }
});

test("scene control buttons meet 44px minimum tap target in mobile slide view", async ({ page }) => {
  await page.locator("#mobileViewToggle").click();
  await expect(page.locator("body")).not.toHaveClass(/mobile-reader/);

  const slidesWithControls = await page.locator(".scene-controls").evaluateAll((controls) =>
    controls.map((c) => c.closest(".slide")?.id).filter(Boolean)
  );

  for (const id of slidesWithControls) {
    await goTo(page, id);
    const buttons = await page.locator(`#${id} .scene-controls button`).all();
    for (const btn of buttons) {
      const box = await btn.boundingBox();
      if (box) {
        expect(box.height, `button height on ${id}`).toBeGreaterThanOrEqual(44);
        expect(box.width, `button width on ${id}`).toBeGreaterThanOrEqual(44);
      }
    }
  }
});

test("memorial slide sign-off is fully visible", async ({ page }) => {
  await goTo(page, "slide-21");

  // Reveal all steps
  const maxStep = await page.locator("#slide-21").getAttribute("data-max-step");
  if (maxStep) {
    await page.evaluate((ms) => {
      const slide = document.getElementById("slide-21");
      slide.dataset.step = ms;
      slide.querySelectorAll("[data-reveal]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }, maxStep);
  }

  const result = await page.evaluate(() => {
    const slide = document.getElementById("slide-21");
    if (!slide) return { visible: false };

    // Check for ticket-stub or last visible text block
    const stub = slide.querySelector(".ticket-stub");
    const quote = slide.querySelector("blockquote");
    const target = stub || quote;
    if (!target) return { visible: false };

    const rect = target.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    return {
      visible: true,
      top: rect.top,
      bottom: rect.bottom,
      slideBottom: slideRect.bottom,
      viewportHeight: window.innerHeight,
      isFullyVisible: rect.top >= -2 && rect.bottom <= window.innerHeight + 2,
      isNotClippedBySlide: rect.bottom <= slideRect.bottom + 2,
    };
  });

  expect(result.visible).toBe(true);
  expect(result.isNotClippedBySlide, `sign-off clipped by slide: bottom=${result.bottom} slideBottom=${result.slideBottom}`).toBe(true);
  await page.evaluate(() => document.querySelector("#slide-21 .ticket-stub")?.scrollIntoView({ block: "center" }));
  const centered = await page.locator("#slide-21 .ticket-stub").boundingBox();
  expect(centered.y, `sign-off not reachable in viewport: ${JSON.stringify(centered)}`).toBeGreaterThanOrEqual(0);
  expect(centered.y + centered.height).toBeLessThanOrEqual(result.viewportHeight + 2);
});

test("bio photo is visible and not horizontally clipped on mobile", async ({ page }) => {
  await goTo(page, "slide-02");
  await page.locator("#slide-02 .bio-photo").scrollIntoViewIfNeeded();
  await settle(page);

  const result = await page.evaluate(() => {
    const photo = document.querySelector("#slide-02 .bio-photo");
    const image = document.querySelector("#slide-02 .bio-photo img");
    if (!photo || !image) return { found: false };

    const rect = photo.getBoundingClientRect();
    return {
      found: true,
      loaded: image.complete && image.naturalWidth > 0 && image.naturalHeight > 0,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  });

  expect(result.found).toBe(true);
  expect(result.loaded).toBe(true);
  expect(result.width).toBeGreaterThan(120);
  expect(result.height).toBeGreaterThan(120);
  expect(result.left, `photo clipped left: ${JSON.stringify(result)}`).toBeGreaterThanOrEqual(-2);
  expect(result.right, `photo clipped right: ${JSON.stringify(result)}`).toBeLessThanOrEqual(result.viewportWidth + 2);
  expect(result.top, `photo not reachable in viewport: ${JSON.stringify(result)}`).toBeLessThan(result.viewportHeight);
  expect(result.bottom, `photo not reachable in viewport: ${JSON.stringify(result)}`).toBeGreaterThan(0);
});

test("speaker notes UI is suppressed on mobile", async ({ page }) => {
  await expect(page.locator(".notes-hint")).toBeHidden();

  await page.keyboard.press("N");
  await settle(page);
  await expect(page.locator(".speaker-notes-panel")).toBeHidden();

  await page.locator("#mobileViewToggle").click();
  await settle(page);
  await page.keyboard.press("N");
  await settle(page);
  await expect(page.locator(".notes-hint")).toBeHidden();
  await expect(page.locator(".speaker-notes-panel")).toBeHidden();
});

test("mobile reader keeps animated scene physics alive during thumb scroll", async ({ page }) => {
  await expect(page.locator("body")).toHaveClass(/mobile-reader/);

  const canvas = page.locator("#slide-01 .scene-canvas");
  await expect(canvas).toBeVisible();

  const before = await canvasSignature(page, "#slide-01 .scene-canvas");
  await page.waitForTimeout(420);
  const after = await canvasSignature(page, "#slide-01 .scene-canvas");

  expect(before.width).toBeGreaterThan(100);
  expect(before.height).toBeGreaterThan(180);
  expect(after.signature).not.toBe(before.signature);

  await goTo(page, "slide-08");
  const posterCanvas = await canvasSignature(page, "#slide-08 .scene-canvas");
  await page.waitForTimeout(420);
  const posterCanvasAfter = await canvasSignature(page, "#slide-08 .scene-canvas");
  expect(posterCanvasAfter.signature).not.toBe(posterCanvas.signature);
});

test("mobile reader mode preserves native touch scrolling", async ({ page }) => {
  await expect(page.locator("body")).toHaveClass(/mobile-reader/);

  const result = await page.evaluate(() => {
    const target = document.querySelector("#deck");
    const touch = (y) => {
      const init = {
        identifier: 1,
        target,
        clientX: 195,
        clientY: y,
        screenX: 195,
        screenY: y,
        pageX: 195,
        pageY: y,
        radiusX: 5,
        radiusY: 5,
        rotationAngle: 0,
        force: 1,
      };
      try { return new Touch(init); } catch { return init; }
    };
    const fire = (type, y, key) => {
      const point = touch(y);
      const event = new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches: key === "end" ? [] : [point],
        targetTouches: key === "end" ? [] : [point],
        changedTouches: [point],
      });
      target.dispatchEvent(event);
      return event.defaultPrevented;
    };

    return {
      startPrevented: fire("touchstart", 600, "start"),
      movePrevented: fire("touchmove", 420, "move"),
      endPrevented: fire("touchend", 350, "end"),
    };
  });

  await settle(page);

  expect(result.startPrevented).toBe(false);
  expect(result.movePrevented).toBe(false);
  expect(result.endPrevented).toBe(false);

  const step = await page.locator("#slide-01").getAttribute("data-step");
  expect(step).toBe("0");

  await page.evaluate(() => window.scrollTo(0, document.querySelector("#slide-03").offsetTop));
  await settle(page);
  await expect(page).toHaveURL(/#slide-03$/);
});

test("mobile users can opt into slide view", async ({ page }) => {
  await page.locator("#mobileViewToggle").click();
  await expect(page.locator("body")).not.toHaveClass(/mobile-reader/);

  const box = await page.locator("#slide-01 .scene-controls button").first().boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
  expect(box.width).toBeGreaterThanOrEqual(44);

  const before = await canvasSignature(page, "#slide-01 .scene-canvas");
  await page.locator("#slide-01 .scene-controls button").first().click();
  await settle(page);
  const after = await canvasSignature(page, "#slide-01 .scene-canvas");
  await expect(page.locator("#slide-01")).toHaveAttribute("data-step", "1");
  expect(after.signature).not.toBe(before.signature);
});
