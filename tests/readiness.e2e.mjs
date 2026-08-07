import { expect, test } from "@playwright/test";

const settle = (page) => page.waitForTimeout(180);

async function goTo(page, slideId) {
  await page.selectOption("#jump", slideId);
  await settle(page);
}

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.errors = errors;
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".slide").first()).toBeVisible();
});

test.afterEach(async ({ page }) => {
  expect(page.errors).toEqual([]);
});

test("all slides fit the presentation viewport without horizontal scroll", async ({ page }) => {
  const results = await page.evaluate(async () => {
    const slides = [...document.querySelectorAll(".slide")];
    const topbarBottom = document.querySelector(".topbar").getBoundingClientRect().bottom;
    const problems = [];

    for (const slide of slides) {
      window.scrollTo({ top: slide.offsetTop, behavior: "auto" });
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const frame = slide.querySelector(".frame");
      const frameRect = frame?.getBoundingClientRect();
      const slideNumber = slide.querySelector(".slide-no")?.textContent.trim() || slide.id;
      const visibleText = [...slide.querySelectorAll("h1, h2, h3, p, li, .quote-box, .lede, .subtitle")]
        .filter((node) => {
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
        })
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return {
            text: node.textContent.trim().slice(0, 80),
            top: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
          };
        });

      if (document.documentElement.scrollWidth > window.innerWidth + 2) {
        problems.push(`${slide.id}: horizontal overflow ${document.documentElement.scrollWidth}px > ${window.innerWidth}px`);
      }

      if (frameRect) {
        if (frameRect.top < topbarBottom - 2) {
          problems.push(`${slide.id} (${slideNumber}): frame starts under chrome at ${frameRect.top}px`);
        }
        if (frameRect.bottom > window.innerHeight + 2) {
          problems.push(`${slide.id} (${slideNumber}): frame bottom ${frameRect.bottom}px exceeds viewport ${window.innerHeight}px`);
        }
      }

      for (const item of visibleText) {
        if (item.left < -2 || item.right > window.innerWidth + 2 || item.top < -2 || item.bottom > window.innerHeight + 2) {
          problems.push(`${slide.id}: text out of viewport: ${item.text}`);
        }
      }
    }

    return problems;
  });

  expect(results).toEqual([]);
});

test("active slide text stays readable without DOM overflow or collisions", async ({ page }) => {
  const problems = await page.evaluate(async () => {
    const slideIds = [...document.querySelectorAll(".slide")].map((slide) => slide.id);
    const allIssues = [];
    const settleFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    for (const slideId of slideIds) {
      const slide = document.getElementById(slideId);
      window.scrollTo({ top: slide.offsetTop, behavior: "auto" });
      await settleFrame();

      const maxStep = Number(slide.dataset.maxStep || 0);
      for (const step of [maxStep]) {
        if (typeof window.setSlideStep === "function") {
          window.setSlideStep(slide, step, true);
        } else {
          slide.dataset.step = String(step);
        }
        await settleFrame();

        const selectors = [
          "h1", "h2", "h3", "p", "li", "blockquote", "button", "label",
          ".quote-box", ".lede", ".subtitle", ".meta", ".kicker", ".slide-no",
          ".memorial-count", ".memorial-dates", ".memorial-label", ".memorial-source",
          "[data-readout]",
        ].join(",");
        const inset = 2;
        const overlapTolerance = 9;
        const textNodes = [...slide.querySelectorAll(selectors)]
          .filter((node) => !node.closest(".speaker-notes"))
          .filter((node) => {
            const style = getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            return style.display !== "none" &&
              style.visibility !== "hidden" &&
              Number(style.opacity) > 0.03 &&
              rect.width > 2 &&
              rect.height > 2 &&
              rect.bottom > 0 &&
              rect.top < innerHeight;
          })
          .map((node) => {
            const rect = node.getBoundingClientRect();
            const style = getComputedStyle(node);
            return {
              node,
              tag: node.tagName.toLowerCase(),
              text: node.textContent.trim().replace(/\s+/g, " ").slice(0, 72),
              rect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height },
              overflowX: node.scrollWidth > Math.ceil(node.clientWidth) + 2 && !["visible", "clip"].includes(style.overflowX),
              overflowY: node.scrollHeight > Math.ceil(node.clientHeight) + 2 && !["visible", "clip"].includes(style.overflowY),
            };
          });

        const issues = [];
        for (const item of textNodes) {
          if (item.rect.left < -inset || item.rect.right > innerWidth + inset || item.rect.top < -inset || item.rect.bottom > innerHeight + inset) {
            issues.push(`${slideId} step ${step}: text leaves viewport: ${item.text}`);
          }
          if (item.overflowX || item.overflowY) {
            issues.push(`${slideId} step ${step}: text overflows its DOM box: ${item.text}`);
          }
        }

        for (let i = 0; i < textNodes.length; i += 1) {
          for (let j = i + 1; j < textNodes.length; j += 1) {
            const a = textNodes[i];
            const b = textNodes[j];
            if (a.node.contains(b.node) || b.node.contains(a.node)) continue;
            if (a.node.closest(".slide-head") && b.node.closest(".slide-head")) continue;
            const xOverlap = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left);
            const yOverlap = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top);
            if (xOverlap > overlapTolerance && yOverlap > overlapTolerance) {
              issues.push(`${slideId} step ${step}: text collision between "${a.text}" and "${b.text}"`);
            }
          }
        }

        allIssues.push(...issues);
      }
    }

    return allIssues;
  });

  expect(problems).toEqual([]);
});

test("critical slides keep controls and text boxes clear of primary content", async ({ page }) => {
  const problems = [];

  for (const slideId of ["slide-04", "slide-14", "slide-21"]) {
    await goTo(page, slideId);
    problems.push(...await page.evaluate((slideId) => {
      const slide = document.getElementById(slideId);
      const pad = 12;
      const label = (node) => node.textContent.trim().replace(/\s+/g, " ").slice(0, 64) || node.className || node.tagName.toLowerCase();
      const rectFor = (node) => {
        const rect = node.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
      };
      const intersects = (a, b, buffer = 0) => (
        Math.min(a.right, b.right) - Math.max(a.left, b.left) > buffer &&
        Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > buffer
      );
      const visible = (node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.03 && rect.width > 2 && rect.height > 2;
      };
      const insetRect = (rect, xRatio, yRatio) => ({
        left: rect.left + rect.width * xRatio,
        right: rect.right - rect.width * xRatio,
        top: rect.top + rect.height * yRatio,
        bottom: rect.bottom - rect.height * yRatio,
        width: rect.width * (1 - xRatio * 2),
        height: rect.height * (1 - yRatio * 2),
      });

      const primarySelectors = {
        "slide-04": [".poster-frame"],
        "slide-14": [".reference-layout h2", ".reference-layout p"],
        "slide-21": [".memorial-copy .memorial-count", ".memorial-label", "blockquote", ".memorial-source"],
      };
      const floatingSelectors = [
        ".topbar",
        "#rail",
        ".rabbit-status",
        `#${slideId} .scene-controls`,
        `#${slideId} .scene-hud`,
      ].join(",");

      const floaters = [...document.querySelectorAll(floatingSelectors)].filter(visible).map((node) => ({ node, rect: rectFor(node) }));
      const primary = primarySelectors[slideId]
        .flatMap((selector) => [...slide.querySelectorAll(selector)])
        .filter(visible)
        .map((node) => {
          const rect = rectFor(node);
          return {
            node,
            rect: slideId === "slide-04" ? insetRect(rect, 0.18, 0.16) : {
              left: rect.left - pad,
              right: rect.right + pad,
              top: rect.top - pad,
              bottom: rect.bottom + pad,
            },
          };
        });

      const issues = [];
      for (const floater of floaters) {
        for (const target of primary) {
          if (intersects(floater.rect, target.rect, slideId === "slide-04" ? 24 : 4)) {
            issues.push(`${slideId}: "${label(floater.node)}" overlaps primary content "${label(target.node)}"`);
          }
        }
      }

      return issues;
    }, slideId));
  }

  expect(problems).toEqual([]);
});

test("all local images load and render with real dimensions", async ({ page }) => {
  const failures = await page.evaluate(async () => {
    const images = [...document.images];
    await Promise.all(images.map((img) => img.complete ? undefined : new Promise((resolve) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    })));

    return images
      .filter((img) => !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0)
      .map((img) => img.getAttribute("src"));
  });

  expect(failures).toEqual([]);
});

test("every slide has speaker notes and notes overlay tracks current slide", async ({ page }) => {
  const coverage = await page.evaluate(() => {
    return [...document.querySelectorAll(".slide")].map((slide) => {
      const noteItems = [...slide.querySelectorAll(".speaker-notes li")].map((li) => li.textContent.trim());
      return {
        id: slide.id,
        notes: noteItems.length,
        empty: noteItems.some((note) => note.length < 12),
      };
    });
  });

  expect(coverage.filter((item) => item.notes < 1 || item.empty)).toEqual([]);

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(180);
  await page.keyboard.press("N");
  await expect(page.locator(".speaker-notes-panel")).toBeVisible();
  await expect(page.locator(".speaker-notes-panel")).toContainText("Who Is Carley");
});

test("local load performance stays inside presentation budget", async ({ page }) => {
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const resources = performance.getEntriesByType("resource");
    const slowResources = resources
      .filter((entry) => entry.duration > 1200)
      .map((entry) => ({ name: entry.name, duration: entry.duration }));

    return {
      domContentLoaded: nav.domContentLoadedEventEnd,
      loadEventEnd: nav.loadEventEnd,
      resourceCount: resources.length,
      slowResources,
    };
  });

  expect(metrics.domContentLoaded).toBeLessThan(1500);
  expect(metrics.loadEventEnd).toBeLessThan(5000);
  expect(metrics.slowResources).toEqual([]);
});
