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
  test.setTimeout(60000);
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
  test.setTimeout(60000);
  await page.locator("#mobileViewToggle").click();
  await expect(page.locator("body")).not.toHaveClass(/mobile-reader/);

  const slidesWithControls = await page.locator(".scene-controls").evaluateAll((controls) =>
    controls.map((c) => c.closest(".slide")?.id).filter(Boolean)
  );

  for (const id of slidesWithControls) {
    await page.evaluate((slideId) => {
      const jump = document.querySelector("#jump");
      jump.value = slideId;
      jump.dispatchEvent(new Event("change", { bubbles: true }));
    }, id);
    await page.waitForTimeout(60);
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
    const canvas = document.querySelector("#slide-02 .scene-canvas");
    const frame = document.querySelector("#slide-02 .frame");
    if (!photo || !image) return { found: false };

    const rect = photo.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const imageStyle = getComputedStyle(image);
    const canvasStyle = canvas ? getComputedStyle(canvas) : null;
    const frameStyle = frame ? getComputedStyle(frame) : null;
    const naturalRatio = image.naturalWidth / image.naturalHeight;
    const renderedRatio = imageRect.width / imageRect.height;
    return {
      found: true,
      loaded: image.complete && image.naturalWidth > 0 && image.naturalHeight > 0,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      imageTop: imageRect.top,
      imageBottom: imageRect.bottom,
      imageWidth: imageRect.width,
      imageHeight: imageRect.height,
      objectFit: imageStyle.objectFit,
      objectPosition: imageStyle.objectPosition,
      naturalRatio,
      renderedRatio,
      canvasOpacity: canvasStyle ? Number(canvasStyle.opacity) : null,
      canvasZIndex: canvasStyle?.zIndex,
      frameZIndex: frameStyle?.zIndex,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  });

  expect(result.found).toBe(true);
  expect(result.loaded).toBe(true);
  expect(result.width).toBeGreaterThan(120);
  expect(result.height).toBeGreaterThan(120);
  expect(result.imageWidth).toBeGreaterThan(220);
  expect(result.imageHeight).toBeGreaterThan(120);
  expect(result.imageHeight, `bio photo dominates the phone viewport: ${JSON.stringify(result)}`).toBeLessThan(result.viewportHeight * .36);
  expect(result.objectFit).toBe("cover");
  expect(result.objectPosition).toBe("50% 100%");
  expect(result.renderedRatio, `bio photo must stay a child-focal phone banner crop: ${JSON.stringify(result)}`).toBeGreaterThan(1.65);
  expect(result.canvasOpacity, `bio scene overlay is too strong: ${JSON.stringify(result)}`).toBeLessThanOrEqual(.1);
  expect(Number(result.frameZIndex), `bio content must layer above scene canvas: ${JSON.stringify(result)}`).toBeGreaterThan(Number(result.canvasZIndex));
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

test("mobile reader removes dead progress and slide scrollboxes", async ({ page }) => {
  await expect(page.locator("body")).toHaveClass(/mobile-reader/);
  await expect(page.locator(".progress")).toBeHidden();

  await goTo(page, "slide-09");
  const result = await page.evaluate(() => {
    const topbar = getComputedStyle(document.querySelector(".topbar"));
    const progress = getComputedStyle(document.querySelector(".progress"));
    const scrollboxes = [...document.querySelectorAll("#slide-09 *")].filter((node) => {
      const style = getComputedStyle(node);
      return /(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1;
    }).map((node) => ({
      tag: node.tagName,
      className: node.className,
      overflowY: getComputedStyle(node).overflowY,
      scrollHeight: node.scrollHeight,
      clientHeight: node.clientHeight,
    }));

    return {
      progressDisplay: progress.display,
      topbarTop: topbar.top,
      bodyScrollbarWidth: topbar.getPropertyValue("scrollbar-width"),
      scrollboxes,
    };
  });

  expect(result.progressDisplay).toBe("none");
  expect(result.topbarTop).toBe("0px");
  expect(result.scrollboxes).toEqual([]);
});

test("mobile reader keeps animated scene physics alive during thumb scroll", async ({ page }) => {
  await expect(page.locator("body")).toHaveClass(/mobile-reader/);

  const canvas = page.locator("#slide-01 .scene-canvas");
  await expect(canvas).toBeVisible();

  const titleFrameBefore = await canvasFrame(page, "#slide-01 .scene-canvas");
  const before = await canvasSignature(page, "#slide-01 .scene-canvas");
  await page.waitForTimeout(620);
  const after = await canvasSignature(page, "#slide-01 .scene-canvas");
  const titleFrameAfter = await canvasFrame(page, "#slide-01 .scene-canvas");

  expect(before.width).toBeGreaterThan(100);
  expect(before.height).toBeGreaterThan(180);
  expect(after.signature).not.toBe(before.signature);
  expect(meanFrameDelta(titleFrameBefore, titleFrameAfter)).toBeGreaterThan(1.4);

  await goTo(page, "slide-08");
  const posterCanvas = await canvasFrame(page, "#slide-08 .scene-canvas");
  await page.waitForTimeout(420);
  const posterCanvasAfter = await canvasFrame(page, "#slide-08 .scene-canvas");
  expect(meanFrameDelta(posterCanvas, posterCanvasAfter)).toBeGreaterThan(.2);
});

test("mobile title portal reacts to touch movement", async ({ page }) => {
  await expect(page.locator("body")).toHaveClass(/mobile-reader/);
  const canvas = page.locator("#slide-01 .scene-canvas");
  await expect(canvas).toBeVisible();

  const style = await canvas.evaluate((node) => {
    const css = getComputedStyle(node);
    return { pointerEvents: css.pointerEvents, touchAction: css.touchAction };
  });
  expect(style.pointerEvents).toBe("auto");
  expect(style.touchAction).toContain("pan-y");

  const box = await canvas.boundingBox();
  const before = await canvasFrame(page, "#slide-01 .scene-canvas");
  await page.mouse.move(box.x + box.width * .22, box.y + box.height * .34);
  await page.mouse.move(box.x + box.width * .78, box.y + box.height * .62, { steps: 8 });
  await page.waitForTimeout(220);
  const after = await canvasFrame(page, "#slide-01 .scene-canvas");

  expect(meanFrameDelta(before, after)).toBeGreaterThan(2.2);
});

test("mobile slide view title portal reacts to touch movement", async ({ page }) => {
  await page.locator("#mobileViewToggle").click();
  await expect(page.locator("body")).not.toHaveClass(/mobile-reader/);

  const canvas = page.locator("#slide-01 .scene-canvas");
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();
  const before = await canvasFrame(page, "#slide-01 .scene-canvas");
  await page.mouse.move(box.x + box.width * .22, box.y + box.height * .34);
  await page.mouse.move(box.x + box.width * .78, box.y + box.height * .62, { steps: 8 });
  await page.waitForTimeout(220);
  const after = await canvasFrame(page, "#slide-01 .scene-canvas");

  expect(meanFrameDelta(before, after)).toBeGreaterThan(2.2);
});

test("mobile title portal intensifies with scroll suction", async ({ page }) => {
  await expect(page.locator("body")).toHaveClass(/mobile-reader/);
  const canvas = page.locator("#slide-01 .scene-canvas");
  await expect(canvas).toBeVisible();

  const before = await canvasFrame(page, "#slide-01 .scene-canvas");
  await page.evaluate(() => {
    const title = document.querySelector("#slide-01");
    window.scrollTo(0, Math.floor(title.offsetHeight * .34));
  });
  await page.waitForTimeout(320);
  const after = await canvasFrame(page, "#slide-01 .scene-canvas");
  const state = await canvas.evaluate((node) => {
    const scene = window.__sceneState.get(node);
    return {
      scrollPull: scene.scrollPull || 0,
      scrollImpulse: scene.scrollImpulse || 0,
    };
  });

  expect(state.scrollPull).toBeGreaterThan(.18);
  expect(meanFrameDelta(before, after)).toBeGreaterThan(3);
});

test("mobile reader keeps title and default poster tactile", async ({ page }) => {
  await expect(page.locator("body")).toHaveClass(/mobile-reader/);

  const result = await page.evaluate(() => {
    const topbar = document.querySelector(".topbar");
    const rabbit = document.querySelector("#slide-01 .cover-art img");
    const defaultCanvas = document.querySelector("#slide-10 .scene-canvas");
    const defaultPoster = document.querySelector("#slide-10 .poster-img");
    const topbarBox = topbar.getBoundingClientRect();
    const rabbitStyle = getComputedStyle(rabbit);
    const defaultCanvasStyle = getComputedStyle(defaultCanvas);
    const defaultPosterStyle = getComputedStyle(defaultPoster);

    return {
      topbarHeight: topbarBox.height,
      rabbitAnimationName: rabbitStyle.animationName,
      rabbitBlendMode: rabbitStyle.mixBlendMode,
      rabbitOpacity: Number(rabbitStyle.opacity),
      defaultCanvasOpacity: Number(defaultCanvasStyle.opacity),
      defaultPosterOpacity: Number(defaultPosterStyle.opacity),
      defaultPosterBlendMode: defaultPosterStyle.mixBlendMode,
    };
  });

  expect(result.topbarHeight, `mobile chrome crowds the title slide: ${JSON.stringify(result)}`).toBeLessThan(92);
  expect(result.rabbitAnimationName).toContain("title-rabbit-idle-spin");
  expect(result.rabbitBlendMode).toBe("screen");
  expect(result.rabbitOpacity).toBeLessThan(.92);
  expect(result.defaultCanvasOpacity).toBeGreaterThanOrEqual(.5);
  expect(result.defaultPosterOpacity).toBeLessThanOrEqual(.72);
  expect(result.defaultPosterBlendMode).toBe("screen");
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

test("mobile slide view keeps every live scene kinetic at idle", async ({ page }) => {
  test.setTimeout(90000);
  await page.locator("#mobileViewToggle").click();
  await expect(page.locator("body")).not.toHaveClass(/mobile-reader/);

  const sceneSlides = await page.locator(".slide:has(.scene-canvas)").evaluateAll((slides) =>
    slides.map((slide) => slide.id).filter(Boolean)
  );

  for (const id of sceneSlides) {
    await page.evaluate((slideId) => {
      const jump = document.querySelector("#jump");
      jump.value = slideId;
      jump.dispatchEvent(new Event("change", { bubbles: true }));
    }, id);
    await page.waitForTimeout(120);

    const before = await canvasFrame(page, `#${id} .scene-canvas`);
    await page.waitForTimeout(420);
    const after = await canvasFrame(page, `#${id} .scene-canvas`);

    expect(meanFrameDelta(before, after), `${id} mobile slide-view scene is static`).toBeGreaterThan(3);
  }
});
