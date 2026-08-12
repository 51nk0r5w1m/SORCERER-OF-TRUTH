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

async function bioPhotoMetrics(page) {
  await page.locator("#slide-02 .bio-photo").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const image = document.querySelector("#slide-02 .bio-photo img");
    return image?.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
  });

  return page.evaluate(() => {
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
      visibleImageLeft: Math.max(rect.left, imageRect.left),
      visibleImageRight: Math.min(rect.right, imageRect.right),
      visibleImageTop: Math.max(rect.top, imageRect.top),
      visibleImageBottom: Math.min(rect.bottom, imageRect.bottom),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  });
}

function expectChildFocalBioPhoto(result) {
  expect(result.found).toBe(true);
  expect(result.loaded).toBe(true);
  expect(result.width).toBeGreaterThan(120);
  expect(result.height).toBeGreaterThan(120);
  expect(result.imageWidth).toBeGreaterThan(220);
  expect(result.height, `bio photo should not dominate the phone viewport: ${JSON.stringify(result)}`).toBeLessThanOrEqual(result.viewportHeight * .42);
  expect(result.objectFit).toBe("cover");
  expect(result.objectPosition).toBe("50% 82%");
  expect(result.renderedRatio, `bio photo should use a wide mobile crop: ${JSON.stringify(result)}`).toBeGreaterThan(1.45);
  expect(result.renderedRatio, `bio photo crop should stay near 16:10: ${JSON.stringify(result)}`).toBeLessThan(1.75);
  expect(result.naturalRatio, `bio source should remain portrait-ish: ${JSON.stringify(result)}`).toBeLessThan(1.1);
  expect(result.imageHeight, `cover image must fill crop container: ${JSON.stringify(result)}`).toBeGreaterThanOrEqual(result.height - 2);
  expect(result.visibleImageBottom - result.visibleImageTop, `visible crop collapsed: ${JSON.stringify(result)}`).toBeGreaterThan(result.height - 3);
  expect(Number(result.frameZIndex), `bio content must layer above scene canvas: ${JSON.stringify(result)}`).toBeGreaterThan(Number(result.canvasZIndex));
  expect(result.left, `photo clipped left: ${JSON.stringify(result)}`).toBeGreaterThanOrEqual(-2);
  expect(result.right, `photo clipped right: ${JSON.stringify(result)}`).toBeLessThanOrEqual(result.viewportWidth + 2);
  expect(result.top, `photo not reachable in viewport: ${JSON.stringify(result)}`).toBeLessThan(result.viewportHeight);
  expect(result.bottom, `photo not reachable in viewport: ${JSON.stringify(result)}`).toBeGreaterThan(0);
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
  const result = await bioPhotoMetrics(page);
  expectChildFocalBioPhoto(result);
  expect(result.canvasOpacity, `bio scene overlay is too strong: ${JSON.stringify(result)}`).toBeLessThanOrEqual(.12);
});

test("bio photo keeps the child focal crop in mobile slide view", async ({ page }) => {
  await page.locator("#mobileViewToggle").click();
  await expect(page.locator("body")).not.toHaveClass(/mobile-reader/);
  await page.evaluate(() => {
    const jump = document.querySelector("#jump");
    jump.value = "slide-02";
    jump.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await settle(page);

  const result = await bioPhotoMetrics(page);
  expectChildFocalBioPhoto(result);
  expect(result.canvasOpacity, `bio scene overlay is too strong: ${JSON.stringify(result)}`).toBeLessThanOrEqual(.12);
});

test("mobile reader title can open Truth-Tellers field notes", async ({ page }) => {
  await expect(page.locator("body")).toHaveClass(/mobile-reader/);

  const control = page.locator("#slide-01 .scene-controls button").first();
  await expect(control).toBeVisible();
  const box = await control.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
  expect(box.width).toBeGreaterThanOrEqual(44);

  await control.click();
  await settle(page);
  await expect(page.locator("#slide-01")).toHaveClass(/is-diving/);
  const overlay = await page.locator("#slide-01 .cover-copy").evaluate((node) =>
    getComputedStyle(node, "::after").content
  );
  expect(overlay).toContain("TRUTH-TELLERS FIELD NOTES");
});

test("mobile slide 03 title is readable and contained", async ({ page }) => {
  await goTo(page, "slide-03");
  const result = await page.locator("#slide-03 .copy h2").evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return {
      left: rect.left,
      right: rect.right,
      width: rect.width,
      viewportWidth: window.innerWidth,
      fontSize: parseFloat(style.fontSize),
      scrollWidth: node.scrollWidth,
      clientWidth: node.clientWidth,
    };
  });

  expect(result.left, `slide 03 title clipped left: ${JSON.stringify(result)}`).toBeGreaterThanOrEqual(-2);
  expect(result.right, `slide 03 title clipped right: ${JSON.stringify(result)}`).toBeLessThanOrEqual(result.viewportWidth + 2);
  expect(result.scrollWidth, `slide 03 title overflows its box: ${JSON.stringify(result)}`).toBeLessThanOrEqual(result.clientWidth + 2);
  expect(result.fontSize, `slide 03 title too large on mobile: ${JSON.stringify(result)}`).toBeLessThanOrEqual(52);
});

test("sky scan slide uses mobile viewport without dead poster space", async ({ page }) => {
  await goTo(page, "slide-04");
  const result = await page.evaluate(() => {
    const slide = document.querySelector("#slide-04");
    const frame = slide?.querySelector(".poster-frame");
    const poster = slide?.querySelector(".poster-img");
    const canvas = slide?.querySelector(".scene-canvas");
    const heading = slide?.querySelector("h2");
    const frameRect = frame?.getBoundingClientRect();
    const posterRect = poster?.getBoundingClientRect();
    const canvasRect = canvas?.getBoundingClientRect();
    const headingRect = heading?.getBoundingClientRect();
    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      frameHeight: frameRect?.height || 0,
      posterHeight: posterRect?.height || 0,
      posterWidth: posterRect?.width || 0,
      canvasHeight: canvasRect?.height || 0,
      headingBottom: headingRect?.bottom || 0,
      slideHeight: slide?.getBoundingClientRect().height || 0,
    };
  });

  expect(result.posterWidth, `sky poster is too small to inspect: ${JSON.stringify(result)}`).toBeGreaterThan(180);
  expect(result.posterHeight, `sky poster wastes too much vertical space: ${JSON.stringify(result)}`).toBeLessThanOrEqual(result.viewportHeight * .36);
  expect(result.canvasHeight, `sky physics canvas collapsed: ${JSON.stringify(result)}`).toBeGreaterThanOrEqual(260);
  expect(result.headingBottom, `sky heading is not reachable in first mobile pass: ${JSON.stringify(result)}`).toBeLessThan(result.viewportHeight);
  expect(result.slideHeight, `sky slide is too sparse on mobile: ${JSON.stringify(result)}`).toBeLessThanOrEqual(result.viewportHeight * 1.35);
});

test("mobile reader does not expose internal scrollbars", async ({ page }) => {
  await expect(page.locator("body")).toHaveClass(/mobile-reader/);
  const result = await page.evaluate(() => {
    const nodes = [document.documentElement, document.body, ...document.querySelectorAll(".split-layout .copy, .ai-layout .copy, .reference-layout .copy, .case-copy, .closing-copy")];
    const scrollingElement = document.scrollingElement;
    const scrollContainers = [...document.querySelectorAll("body *")].filter((node) => {
      const style = getComputedStyle(node);
      return /(auto|scroll)/.test(`${style.overflow}${style.overflowX}${style.overflowY}`) &&
        (node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1);
    }).map((node) => ({
      tag: node.tagName,
      id: node.id,
      className: node.className,
      overflow: getComputedStyle(node).overflow,
      overflowY: getComputedStyle(node).overflowY,
      overflowX: getComputedStyle(node).overflowX,
      scrollHeight: node.scrollHeight,
      clientHeight: node.clientHeight,
      scrollWidth: node.scrollWidth,
      clientWidth: node.clientWidth,
    }));
    return nodes.map((node) => {
      const style = getComputedStyle(node);
      return {
        tag: node.tagName,
        className: node.className,
        scrollbarWidth: style.scrollbarWidth,
        msOverflowStyle: style.msOverflowStyle,
      };
    }).concat({
      tag: "SCROLLING_ELEMENT",
      className: scrollingElement?.className || "",
      scrollbarWidth: getComputedStyle(scrollingElement).scrollbarWidth,
      msOverflowStyle: getComputedStyle(scrollingElement).msOverflowStyle,
      scrollWidth: scrollingElement.scrollWidth,
      clientWidth: scrollingElement.clientWidth,
      scrollContainers,
    });
  });

  for (const item of result) {
    expect(item.scrollbarWidth, `visible scrollbar policy on ${JSON.stringify(item)}`).toBe("none");
  }
  const scrollingElement = result.find((item) => item.tag === "SCROLLING_ELEMENT");
  expect(scrollingElement.scrollWidth, `reader mode has horizontal document overflow: ${JSON.stringify(scrollingElement)}`).toBeLessThanOrEqual(scrollingElement.clientWidth + 1);
  expect(scrollingElement.scrollContainers, `reader mode exposes internal scrollboxes: ${JSON.stringify(scrollingElement.scrollContainers)}`).toEqual([]);
});

test("mobile slide view hides viewport scrollbar chrome", async ({ page }) => {
  await page.locator("#mobileViewToggle").click();
  await expect(page.locator("body")).not.toHaveClass(/mobile-reader/);

  const result = await page.evaluate(() => {
    const html = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    return {
      htmlScrollbarWidth: html.scrollbarWidth,
      bodyScrollbarWidth: body.scrollbarWidth,
      bodyOverflowY: body.overflowY,
      canProgrammaticallyScroll: document.scrollingElement.scrollHeight > window.innerHeight,
    };
  });

  expect(result.htmlScrollbarWidth, `html scrollbar visible in slide view: ${JSON.stringify(result)}`).toBe("none");
  expect(result.bodyScrollbarWidth, `body scrollbar visible in slide view: ${JSON.stringify(result)}`).toBe("none");
  expect(result.canProgrammaticallyScroll, `slide navigation still needs document scroll: ${JSON.stringify(result)}`).toBe(true);
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

  const results = [];
  for (const slideId of ["slide-09", "slide-13", "slide-15"]) {
    await goTo(page, slideId);
    results.push(await page.evaluate((slideId) => {
      const topbar = getComputedStyle(document.querySelector(".topbar"));
      const progress = getComputedStyle(document.querySelector(".progress"));
      const scrollboxes = [...document.querySelectorAll(`#${slideId} *`)].filter((node) => {
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
        slideId,
        progressDisplay: progress.display,
        topbarTop: topbar.top,
        bodyScrollbarWidth: topbar.getPropertyValue("scrollbar-width"),
        scrollboxes,
      };
    }, slideId));
  }

  for (const result of results) {
    expect(result.progressDisplay).toBe("none");
    expect(result.topbarTop).toBe("0px");
    expect(result.scrollboxes, `${result.slideId} exposes mobile scrollboxes`).toEqual([]);
  }
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
    const titleCanvas = document.querySelector("#slide-01 .scene-canvas");
    const titleState = window.__sceneState.get(titleCanvas);
    const beforePulse = titleState.touchPulse || 0;
    const beforePointer = { ...titleState.pointer };
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

    const startPrevented = fire("touchstart", 600, "start");
    const movePrevented = fire("touchmove", 420, "move");
    const endPrevented = fire("touchend", 350, "end");

    return {
      startPrevented,
      movePrevented,
      endPrevented,
      beforePulse,
      afterPulse: titleState.touchPulse || 0,
      beforePointer,
      afterPointer: { ...titleState.pointer },
    };
  });

  await settle(page);

  expect(result.startPrevented).toBe(false);
  expect(result.movePrevented).toBe(false);
  expect(result.endPrevented).toBe(false);
  expect(result.afterPulse, `mobile touchmove did not wake title physics: ${JSON.stringify(result)}`).toBeGreaterThan(result.beforePulse);
  expect(result.afterPointer.y, `mobile touchmove did not update scene pointer: ${JSON.stringify(result)}`).not.toBe(result.beforePointer.y);

  const step = await page.locator("#slide-01").getAttribute("data-step");
  expect(step).toBe("0");

  await page.evaluate(() => window.scrollTo(0, document.querySelector("#slide-03").offsetTop));
  await settle(page);
  await expect(page).toHaveURL(/#slide-03$/);
});

test("mobile users can opt into slide view", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".slide").first()).toBeVisible();

  await page.locator("#mobileViewToggle").click();
  await expect(page.locator("body")).not.toHaveClass(/mobile-reader/);

  const box = await page.locator("#slide-01 .scene-controls button").first().boundingBox();
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  expect(box.height).toBeGreaterThanOrEqual(44);
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.y, `slide-view title control clipped at top: ${JSON.stringify(box)}`).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height, `slide-view title control clipped at bottom: ${JSON.stringify(box)}`).toBeLessThanOrEqual(viewportHeight);

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
