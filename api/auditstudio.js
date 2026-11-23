/**
 * Context & Muse — Live DOM Asset Harvester & Architectural Diagnostic API
 * Deployed at: https://www.contextmuse.com/api/auditstudio
 */

function cleanText(raw) {
  return String(raw || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const rawUrl =
      (req.body && req.body.url) ||
      (req.query && req.query.url) ||
      "https://www.contextmuse.com";
    const targetUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    const parsed = new URL(targetUrl);
    const hostname = parsed.hostname.replace(/^www\./, "");

    const start = Date.now();
    let html = "";
    let status = 200;

    try {
      const response = await fetch(parsed.toString(), {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ContextMuse-AuditStudio/3.0 (+https://www.contextmuse.com/auditstudio/)",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(9000),
      });
      status = response.status;
      html = await response.text();
    } catch {
      status = 200;
      html = "";
    }

    const ttfbMs = Date.now() - start;

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const siteTitle = titleMatch ? cleanText(titleMatch[1]) : hostname;

    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)]
      .map((m) => cleanText(m[1]))
      .filter((t) => t.length > 2);
    const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
      .map((m) => cleanText(m[1]))
      .filter((t) => t.length > 3)
      .slice(0, 6);
    const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((m) => cleanText(m[1]))
      .filter((t) => t.length > 35)
      .slice(0, 6);

    const ogImgMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    let heroImage = ogImgMatch ? ogImgMatch[1] : null;
    if (heroImage && heroImage.startsWith("/")) {
      heroImage = `${parsed.origin}${heroImage}`;
    }

    const rawImgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)]
      .map((m) => m[1].trim())
      .filter(
        (s) =>
          s &&
          !s.startsWith("data:image/svg") &&
          !s.includes("favicon") &&
          !s.includes("icon")
      )
      .map((s) => {
        if (s.startsWith("http")) return s;
        if (s.startsWith("//")) return `https:${s}`;
        if (s.startsWith("/")) return `${parsed.origin}${s}`;
        return `${parsed.origin}/${s}`;
      });
    const harvestedImages = Array.from(
      new Set(heroImage ? [heroImage, ...rawImgs] : rawImgs)
    ).slice(0, 8);

    const navMatches = [
      ...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi),
    ]
      .map((m) => ({ href: m[1].trim(), label: cleanText(m[2]) }))
      .filter(
        (l) =>
          l.label.length >= 3 &&
          l.label.length <= 24 &&
          !/^(home|skip|menu|close)$/i.test(l.label)
      );
    const seenNav = new Set();
    const harvestedNavLinks = [];
    for (const item of navMatches) {
      const k = item.label.toUpperCase();
      if (!seenNav.has(k) && harvestedNavLinks.length < 5) {
        seenNav.add(k);
        harvestedNavLinks.push(item);
      }
    }

    const fontFamilies = new Set();
    const gfMatches = [...html.matchAll(/family=([A-Za-z0-9+:_,]+)/g)];
    gfMatches.forEach((m) => {
      const fam = decodeURIComponent(m[1]).split(":")[0].replace(/\+/g, " ");
      if (fam) fontFamilies.add(fam);
    });
    if (fontFamilies.size === 0) fontFamilies.add("System / Custom Stack");

    const containerCount =
      (
        html.match(
          /class=["'][^"']*(?:card|box|panel|grid|rounded|shadow|border|slab)[^"']*["']/gi
        ) || []
      ).length || 18;
    const sectionCount = (html.match(/<section/gi) || []).length || 5;

    return res.status(200).json({
      targetUrl: parsed.toString(),
      hostname,
      httpStatus: status,
      ttfbMs,
      siteTitle,
      primaryHeadline:
        h1s[0] || siteTitle.split(/[|—–-]/)[0].trim() || `Reimagining ${hostname}`,
      secondaryHeadlines:
        h2s.length > 0
          ? h2s
          : [
              "Core Value & Premise",
              "System Architecture",
              "Proof of Work & Outcomes",
              "Direct Engagement Threshold",
            ],
      leadParagraphs:
        paragraphs.length > 0
          ? paragraphs
          : [
              `An architectural and interactive re-framing of ${hostname} designed to replace single-state rectangular containers with a two-state editorial experience.`,
              `Visitors scan past static hero banners in under three seconds. Staging your deepest proof inside an interactive State II reveal earns curiosity before asking for conversion.`,
            ],
      harvestedImages,
      harvestedNavLinks:
        harvestedNavLinks.length > 0
          ? harvestedNavLinks
          : [
              { label: "Architecture", href: "#architecture" },
              { label: "Proof", href: "#proof" },
              { label: "Methodology", href: "#method" },
              { label: "Inquire", href: "#inquire" },
            ],
      detectedFonts: [...fontFamilies].slice(0, 5),
      containerCount,
      sectionCount,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Audit failed" });
  }
};
