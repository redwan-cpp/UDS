/**
 * In-page accessibility and layout audit.
 *
 * Pasted into the browser during QA. Checks the things that are easy to get
 * wrong and hard to see: contrast of real rendered pairs, heading order,
 * accessible names, target sizes, alt text, horizontal overflow.
 *
 * This is a review tool. It is never bundled into the site.
 *
 * Usage: copy the body of `audit()` into the console, or run it through the
 * browser tooling with `JSON.stringify(audit(), null, 2)`.
 */
function audit() {
  const de = document.documentElement;
  const issues = [];
  const add = (level, rule, detail) => issues.push({ level, rule, detail });

  const parseRgb = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
  };
  const lin = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const ratio = (a, b) => {
    const l1 = lum(a);
    const l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  /** Walk up for the first non-transparent background. */
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = parseRgb(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0.9) return c;
      n = n.parentElement;
    }
    return { r: 10, g: 10, b: 10, a: 1 };
  };

  /* --- horizontal overflow ------------------------------------------------ */
  if (de.scrollWidth > de.clientWidth + 1) {
    const wide = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > de.clientWidth + 2;
      })
      .slice(0, 5)
      .map((el) => el.tagName + "." + (el.className || "").toString().slice(0, 60));
    add("HIGH", "horizontal-overflow", { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, wide });
  }

  /* --- headings ----------------------------------------------------------- */
  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(
    (h) => h.offsetParent !== null || h.classList.contains("sr-only"),
  );
  const h1s = headings.filter((h) => h.tagName === "H1");
  if (h1s.length !== 1) add("HIGH", "h1-count", { count: h1s.length, texts: h1s.map((h) => h.innerText.trim().slice(0, 40)) });
  let prev = 0;
  for (const h of headings) {
    const level = Number(h.tagName[1]);
    if (prev && level > prev + 1) {
      add("MEDIUM", "heading-skip", { from: "h" + prev, to: "h" + level, text: h.innerText.trim().slice(0, 50) });
    }
    prev = level;
  }

  /* --- images ------------------------------------------------------------- */
  for (const img of document.querySelectorAll("img")) {
    if (!img.hasAttribute("alt")) {
      add("HIGH", "img-missing-alt", { src: (img.currentSrc || img.src).slice(-70) });
    }
    if (!img.getAttribute("width") && !img.style.width && img.offsetParent !== null) {
      const s = getComputedStyle(img);
      if (s.position !== "absolute") {
        add("MEDIUM", "img-no-dimensions", { src: (img.currentSrc || img.src).slice(-70) });
      }
    }
  }

  /* --- interactive elements ----------------------------------------------- */
  for (const el of document.querySelectorAll("a,button,input,select,textarea")) {
    if (el.offsetParent === null) continue;
    const name = (
      el.getAttribute("aria-label") ||
      el.innerText ||
      el.getAttribute("title") ||
      (el.labels && el.labels.length ? el.labels[0].innerText : "") ||
      el.getAttribute("placeholder") ||
      ""
    ).trim();
    if (!name) {
      add("HIGH", "no-accessible-name", { tag: el.tagName, cls: (el.className || "").toString().slice(0, 50) });
    }
    if (el.tagName === "A" && !el.getAttribute("href")) {
      add("HIGH", "link-without-href", { text: name.slice(0, 40) });
    }
    // WCAG 2.2 AA (2.5.8) sets a 24x24 CSS px floor. Inline links inside a
    // sentence are exempt, and so is a visually-hidden control whose label is
    // itself the target — the sr-only radio inputs in the contact flow are
    // 1x1 by design and their full-width label is what gets clicked.
    const r = el.getBoundingClientRect();
    const inline = el.tagName === "A" && getComputedStyle(el).display.includes("inline");
    const labelIsTarget =
      el.labels &&
      el.labels.length > 0 &&
      el.labels[0].getBoundingClientRect().height >= 24;
    if (!inline && !labelIsTarget && r.height > 0 && (r.height < 24 || r.width < 24)) {
      add("MEDIUM", "small-target", {
        tag: el.tagName,
        text: name.slice(0, 30),
        size: Math.round(r.width) + "x" + Math.round(r.height),
      });
    }
  }

  /* --- contrast of real rendered pairs ------------------------------------ */
  const seen = new Set();
  for (const el of document.querySelectorAll("p,span,a,li,h1,h2,h3,h4,dt,dd,button,label,time,figcaption,address,code")) {
    if (el.offsetParent === null) continue;
    if (el.classList.contains("sr-only")) continue;
    const text = (el.textContent || "").trim();
    if (!text || el.children.length > 0) continue;
    const cs = getComputedStyle(el);
    const fg = parseRgb(cs.color);
    if (!fg || fg.a < 0.99) continue;
    const bg = bgOf(el);
    const key = cs.color + "|" + [bg.r, bg.g, bg.b].join(",") + "|" + cs.fontSize;
    if (seen.has(key)) continue;
    seen.add(key);

    const px = parseFloat(cs.fontSize);
    const bold = Number(cs.fontWeight) >= 700;
    const large = px >= 24 || (px >= 18.66 && bold);
    const floor = large ? 3 : 4.5;
    const r = ratio(fg, bg);
    if (r < floor) {
      add("HIGH", "contrast", {
        text: text.slice(0, 40),
        ratio: Math.round(r * 100) / 100,
        floor,
        color: cs.color,
        bg: `rgb(${bg.r}, ${bg.g}, ${bg.b})`,
        fontSize: cs.fontSize,
      });
    }
  }

  /* --- landmarks ---------------------------------------------------------- */
  if (!document.querySelector("main")) add("HIGH", "no-main-landmark", {});
  if (!document.querySelector("footer")) add("MEDIUM", "no-footer-landmark", {});

  /* --- reveal state ------------------------------------------------------- */
  const stuck = [...document.querySelectorAll("[data-reveal],[data-reveal-curtain],[data-reveal-words],[data-reveal-children]")]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight || r.bottom < 0) return false;
      return getComputedStyle(el).opacity === "0" && !el.hasAttribute("data-revealed");
    });
  if (stuck.length) {
    add("MEDIUM", "reveal-stuck-in-viewport", { count: stuck.length });
  }

  return {
    url: location.pathname,
    viewport: `${innerWidth}x${innerHeight}`,
    counts: {
      HIGH: issues.filter((i) => i.level === "HIGH").length,
      MEDIUM: issues.filter((i) => i.level === "MEDIUM").length,
    },
    issues,
  };
}
