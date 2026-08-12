import { expect, test } from "@playwright/test";

const settle = (page) => page.waitForTimeout(180);

async function goTo(page, slideId) {
  await page.selectOption("#jump", slideId);
  await settle(page);
}

async function maxStep(page, slideId) {
  return page.locator(`#${slideId}`).getAttribute("data-max-step");
}

async function canvasFrame(page, selector) {
  return page.locator(selector).evaluate((canvas) => {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    if (!ctx || width < 8 || height < 8) return { width, height, samples: [] };

    const samples = [];
    for (let gy = 1; gy <= 7; gy++) {
      for (let gx = 1; gx <= 7; gx++) {
        const pixel = ctx.getImageData(Math.floor(width * gx / 8), Math.floor(height * gy / 8), 1, 1).data;
        samples.push(pixel[0], pixel[1], pixel[2], pixel[3]);
      }
    }
    return { width, height, samples };
  });
}

function meanFrameDelta(before, after) {
  const length = Math.min(before.samples.length, after.samples.length);
  if (!length) return 0;
  let total = 0;
  for (let i = 0; i < length; i++) total += Math.abs(before.samples[i] - after.samples[i]);
  return total / length;
}

test.beforeEach(async ({ page }) => {
  await page.goto("./", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".slide").first()).toBeVisible();
});

test("first slide clears fixed chrome", async ({ page }) => {
  const boxes = await page.evaluate(() => {
    const topbar = document.querySelector(".topbar").getBoundingClientRect();
    const frame = document.querySelector("#slide-01 .cover-frame").getBoundingClientRect();
    return {
      topbarBottom: topbar.bottom,
      frameTop: frame.top,
      frameBottom: frame.bottom,
      viewportHeight: window.innerHeight,
    };
  });

  expect(boxes.frameTop).toBeGreaterThan(boxes.topbarBottom + 8);
  expect(boxes.frameBottom).toBeLessThan(boxes.viewportHeight - 8);
});

test("keyboard navigation advances slide state before changing slides", async ({ page }) => {
  const firstMaxStep = await maxStep(page, "slide-01");

  await page.keyboard.press("ArrowRight");
  await settle(page);
  await expect(page.locator("#slide-01")).toHaveAttribute("data-step", firstMaxStep);
  await expect(page).not.toHaveURL(/#slide-02$/);

  await page.keyboard.press("Space");
  await settle(page);
  await expect(page).toHaveURL(/#slide-02$/);

  const current = await page.evaluate(() => {
    const target = document.querySelector("#slide-02");
    return {
      scrollY: window.scrollY,
      targetTop: target.offsetTop,
      activeDot: [...document.querySelectorAll("#rail a")].findIndex((dot) => dot.classList.contains("active")),
      jumpValue: document.querySelector("#jump").value,
    };
  });

  expect(Math.abs(current.scrollY - current.targetTop)).toBeLessThanOrEqual(2);
  expect(current.activeDot).toBe(1);
  expect(current.jumpValue).toBe("slide-02");

  await page.keyboard.press("ArrowLeft");
  await settle(page);
  await expect(page).toHaveURL(/#slide-01$/);
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#slide-01")).toHaveAttribute("data-step", "0");
});

test("deck hotkeys do not steal Space from focused controls", async ({ page }) => {
  await page.locator("#rabbitToggle").focus();
  await page.keyboard.press("Space");
  await settle(page);
  await expect(page.locator("#rabbitToggle")).toHaveAttribute("aria-pressed", "true");
  await expect(page).not.toHaveURL(/#slide-02$/);

  await goTo(page, "slide-19");
  const firstCheck = page.locator("#slide-19 .check").first();
  await firstCheck.focus();
  await page.keyboard.press("Space");
  await settle(page);
  await expect(firstCheck).toHaveClass(/done/);
  await expect(page).toHaveURL(/#slide-19$/);
});

test("touch swipe prevents native scroll and advances exactly one state", async ({ page }) => {
  const result = await page.evaluate(() => {
    const target = document.querySelector("#deck");
    const touch = (y) => {
      const init = {
        identifier: 1,
        target,
        clientX: 120,
        clientY: y,
        screenX: 120,
        screenY: y,
        pageX: 120,
        pageY: y,
        radiusX: 2,
        radiusY: 2,
        rotationAngle: 0,
        force: 1,
      };
      try {
        return new Touch(init);
      } catch {
        return init;
      }
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
      startPrevented: fire("touchstart", 650, "start"),
      movePrevented: fire("touchmove", 520, "move"),
      endPrevented: fire("touchend", 440, "end"),
    };
  });

  await settle(page);
  const current = await page.evaluate(() => ({
    hash: location.hash,
    step: document.querySelector("#slide-01").dataset.step,
    activeDot: [...document.querySelectorAll("#rail a")].findIndex((dot) => dot.classList.contains("active")),
  }));

  expect(result.startPrevented).toBe(true);
  expect(result.movePrevented).toBe(true);
  expect(result.endPrevented).toBe(true);
  expect(current.hash).toBe("");
  expect(current.step).toBe("1");
  expect(current.activeDot).toBe(0);
});

test("clicking the active instrument advances one argument", async ({ page }) => {
  const firstMaxStep = await maxStep(page, "slide-01");

  await page.locator("#slide-01 .scene-canvas").click({ position: { x: 420, y: 420 } });
  await settle(page);
  await expect(page.locator("#slide-01")).toHaveAttribute("data-step", firstMaxStep);
  await page.locator("#slide-01 .scene-canvas").click({ position: { x: 420, y: 420 } });
  await settle(page);
  await expect(page).toHaveURL(/#slide-02$/);
});

test("title portal and rabbit spin at idle", async ({ page }) => {
  const canvas = page.locator("#slide-01 .scene-canvas");
  await expect(canvas).toBeVisible();

  const before = await canvasFrame(page, "#slide-01 .scene-canvas");
  await page.waitForTimeout(620);
  const after = await canvasFrame(page, "#slide-01 .scene-canvas");

  expect(before.width).toBeGreaterThan(500);
  expect(before.height).toBeGreaterThan(400);
  expect(meanFrameDelta(before, after)).toBeGreaterThan(1.2);
});

test("bio photo is a prominent full-slide design element", async ({ page }) => {
  await goTo(page, "slide-02");

  const layout = await page.evaluate(() => {
    const frame = document.querySelector("#slide-02 .bio-layout").getBoundingClientRect();
    const photo = document.querySelector("#slide-02 .bio-photo").getBoundingClientRect();
    const text = document.querySelector("#slide-02 .bio-text").getBoundingClientRect();
    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      frameTop: frame.top,
      frameBottom: frame.bottom,
      photoWidth: photo.width,
      photoHeight: photo.height,
      textWidth: text.width,
    };
  });

  expect(layout.frameTop).toBeGreaterThanOrEqual(0);
  expect(layout.frameBottom).toBeLessThanOrEqual(layout.viewportHeight);
  expect(layout.photoWidth).toBeGreaterThan(layout.viewportWidth * 0.25);
  expect(layout.photoHeight).toBeGreaterThan(layout.viewportHeight * 0.44);
  expect(layout.textWidth).toBeGreaterThan(300);
});

test("poster slides use large unframed generated art", async ({ page }) => {
  for (const slideId of ["slide-08", "slide-10", "slide-16"]) {
    await goTo(page, slideId);
    const result = await page.evaluate((id) => {
      const img = document.querySelector(`#${id} .poster-img`).getBoundingClientRect();
      const frame = document.querySelector(`#${id} .poster-frame`).getBoundingClientRect();
      return {
        imageHeight: img.height,
        frameHeight: frame.height,
        viewportHeight: window.innerHeight,
      };
    }, slideId);

    expect(result.imageHeight).toBeGreaterThan(result.viewportHeight * 0.68);
    expect(result.frameHeight).toBeLessThanOrEqual(result.viewportHeight);
  }
});

test("rabbit depth marker is visible and unclipped", async ({ page }) => {
  const marker = await page.evaluate(() => {
    const node = document.querySelector("#progressMarker");
    const rect = node.getBoundingClientRect();
    const track = getComputedStyle(document.querySelector(".progress-track"));
    return { width: rect.width, height: rect.height, overflow: track.overflow };
  });

  expect(marker.width).toBeGreaterThanOrEqual(18);
  expect(marker.height).toBeGreaterThanOrEqual(14);
  expect(marker.overflow).toBe("visible");
});

test("rabbit follows the left-to-right maze path", async ({ page }) => {
  const start = await page.locator("#progressMarker").boundingBox();
  await goTo(page, "slide-06");
  const middle = await page.locator("#progressMarker").boundingBox();
  await goTo(page, "slide-16");
  const deep = await page.locator("#progressMarker").boundingBox();

  expect(middle.x).toBeGreaterThan(start.x + 100);
  expect(deep.x).toBeGreaterThan(middle.x + 100);
  expect(Math.abs(middle.y - start.y) + Math.abs(deep.y - middle.y)).toBeGreaterThan(2);
});

test("former static slides expose live research instruments", async ({ page }) => {
  test.setTimeout(45000);
  const targets = ["slide-02", "slide-04", "slide-06", "slide-08", "slide-10", "slide-14", "slide-16", "slide-18"];
  for (const id of targets) {
    await goTo(page, id);
    await expect(page.locator(`#${id} .scene-canvas`)).toBeVisible({ timeout: 5000 });
    await expect(page.locator(`#${id} .scene-controls button`).first()).toBeVisible({ timeout: 5000 });
  }
});

test("research instruments update readouts", async ({ page }) => {
  await goTo(page, "slide-04");
  await page.locator("#slide-04 [data-action='scan']").click();
  await expect(page.locator("#slide-04 [data-readout]")).toContainText("SCANNING");
  await page.locator("#slide-04 [data-action='ground']").click();
  await expect(page.locator("#slide-04 [data-readout]")).toContainText("RECEIPT CHAIN // LOCKED");

  await goTo(page, "slide-06");
  await page.locator("#slide-06 [data-action='rank']").click();
  await expect(page.locator("#slide-06 [data-readout]")).toContainText("WEIGHTED");

  await goTo(page, "slide-18");
  await page.locator("#slide-18 [data-action='issue']").click();
  await expect(page.locator("#slide-18 [data-readout]")).toContainText("ISSUE CONTEXT OPEN");
});

test("model dissolve is a live presenter-controlled transformation", async ({ page }) => {
  await goTo(page, "slide-12");
  await page.locator("#slide-12 [data-action='dissolve']").click();
  await page.waitForTimeout(900);

  await expect(page.locator("#slide-12 [data-state]")).toContainText(/DRIFTING|DISSOLVED/);
  const drift = await page.locator("#slide-12 [data-drift]").textContent();
  expect(Number(drift)).toBeGreaterThan(0.1);
});

test("OAuth fossil takeaway remains fully visible", async ({ page }) => {
  await goTo(page, "slide-11");
  const result = await page.evaluate(() => {
    const node = document.querySelector("#slide-11 .takeaway");
    const rect = node.getBoundingClientRect();
    return { text: node.textContent.trim(), top: rect.top, bottom: rect.bottom, height: innerHeight };
  });

  expect(result.text).toBe("Documentation can preserve fossils. The hierarchy catches what the diagram cannot show.");
  expect(result.top).toBeGreaterThan(0);
  expect(result.bottom).toBeLessThanOrEqual(result.height);
});

test("wheel gesture advances one state and respects the input lock", async ({ page }) => {
  const firstMaxStep = await maxStep(page, "slide-01");

  await page.mouse.wheel(0, 700);
  await settle(page);
  await expect(page.locator("#slide-01")).toHaveAttribute("data-step", firstMaxStep);

  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(80);
  await expect(page.locator("#slide-01")).toHaveAttribute("data-step", firstMaxStep);

  await page.waitForTimeout(920);
  await page.mouse.wheel(0, 700);
  await settle(page);
  await expect(page).toHaveURL(/#slide-02$/);
});

test("reset and number navigation are deterministic", async ({ page }) => {
  const firstMaxStep = await maxStep(page, "slide-01");

  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#slide-01")).toHaveAttribute("data-step", firstMaxStep);
  await page.keyboard.press("R");
  await expect(page.locator("#slide-01")).toHaveAttribute("data-step", "0");

  await page.keyboard.press("6");
  await settle(page);
  await expect(page).toHaveURL(/#slide-06$/);
  await expect(page.locator("#slide-06")).toHaveAttribute("data-step", "0");
});

test("export mode applies every final meaningful state", async ({ page }) => {
  await page.goto("./?export=1", { waitUntil: "load" });
  const unresolved = await page.locator(".slide").evaluateAll((slides) => slides.filter((slide) => (
    slide.dataset.step !== slide.dataset.maxStep || !slide.classList.contains("is-resolved")
  )).map((slide) => slide.id));
  expect(unresolved).toEqual([]);
  await expect(page.locator("body")).toHaveClass(/export-mode/);
});
