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

test("scene control buttons meet 44px minimum tap target", async ({ page }) => {
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
    return {
      visible: true,
      bottom: rect.bottom,
      viewportHeight: window.innerHeight,
      isFullyVisible: rect.bottom <= window.innerHeight + 2,
    };
  });

  expect(result.visible).toBe(true);
  expect(result.isFullyVisible, `sign-off cut off: bottom=${result.bottom} viewport=${result.viewportHeight}`).toBe(true);
});

test("touch swipe navigates slides on mobile", async ({ page }) => {
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

  expect(result.startPrevented).toBe(true);
  expect(result.movePrevented).toBe(true);
  expect(result.endPrevented).toBe(true);

  const step = await page.locator("#slide-01").getAttribute("data-step");
  expect(Number(step)).toBeGreaterThanOrEqual(1);
});
