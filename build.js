#!/usr/bin/env node
/*
 * build.js — Generateur statique multilingue de Business Move.
 *
 * Principe : la RACINE ne contient que la SOURCE ; tout le genere va dans dist/.
 *   Source : src/i18n.json + src/pages.json + src/templates/ + content/*.md
 *            + assets/ (site.css, site.js) + identity/ + data/
 *   Sortie unique : dist/  (a deposer par FTP a la racine web de behostings)
 *
 * Usage : node build.js  (ou npm run build)  — aucune dependance externe.
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const TEMPLATES = path.join(SRC, "templates");
const CONTENT = path.join(ROOT, "content");
const DIST = path.join(ROOT, "dist");
const BASE_URL = "https://businessmove.eu";
const LANGS = ["fr", "nl", "en"];

const GUIDE_SEG = { fr: "guide", nl: "gids", en: "guide" };
const GUIDE_LABEL = { fr: "Guide", nl: "Gids", en: "Guide" };
const GUIDE_TEXT = {
  fr: {
    metaTitle: "Guide du déménagement d'entreprise | Business Move",
    metaDescription: "Guides pratiques pour préparer, chiffrer et organiser le déménagement de vos bureaux en Belgique.",
    title: "Guide du déménagement d'entreprise",
    intro: "Des repères concrets pour préparer, chiffrer et organiser votre déménagement de bureaux.",
    readMore: "Lire l'article",
    empty: "Les premiers guides arrivent bientôt."
  },
  nl: {
    metaTitle: "Gids bedrijfsverhuizing | Business Move",
    metaDescription: "Praktische gidsen om uw kantoorverhuizing in België voor te bereiden, te ramen en te organiseren.",
    title: "Gids bedrijfsverhuizing",
    intro: "Concrete houvast om uw kantoorverhuizing voor te bereiden, te ramen en te organiseren.",
    readMore: "Lees het artikel",
    empty: "De eerste gidsen komen binnenkort."
  },
  en: {
    metaTitle: "Office move guide | Business Move",
    metaDescription: "Practical guides to prepare, budget and organise your office move in Belgium.",
    title: "Office move guide",
    intro: "Concrete guidance to prepare, budget and organise your office move.",
    readMore: "Read the article",
    empty: "The first guides are coming soon."
  }
};

const i18n = JSON.parse(fs.readFileSync(path.join(SRC, "i18n.json"), "utf8"));
const pages = JSON.parse(fs.readFileSync(path.join(SRC, "pages.json"), "utf8"));

const HREF_TO_PAGE = { "index.html": "home", "organiser.html": "organize", "devis.html": "quote" };
// Anciennes URL -> nouvelles pages FR (l'ancien site servait le francais). 301 via .htaccess.
const REDIRECTS = {
  "organiser.html": { toPage: "organize", lang: "fr" },
  "devis.html": { toPage: "quote", lang: "fr" }
};

function pageById(id) {
  return pages.find((p) => p.id === id);
}
function pageUrl(id, lang) {
  const slug = pageById(id).slug[lang];
  return slug ? `/${lang}/${slug}` : `/${lang}/`;
}
function outputPath(id, lang) {
  const slug = pageById(id).slug[lang];
  return slug ? path.join(DIST, lang, slug) : path.join(DIST, lang, "index.html");
}
function guideIndexUrl(lang) {
  return `/${lang}/${GUIDE_SEG[lang]}/`;
}
function guideIndexOutput(lang) {
  return path.join(DIST, lang, GUIDE_SEG[lang], "index.html");
}
function articleUrl(article, lang) {
  return `/${lang}/${GUIDE_SEG[lang]}/${article.langs[lang].slug}.html`;
}
function articleOutput(article, lang) {
  return path.join(DIST, lang, GUIDE_SEG[lang], article.langs[lang].slug + ".html");
}

function escapeText(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(value) {
  return escapeText(value).replace(/"/g, "&quot;");
}
function tr(lang, key, fallback) {
  const dict = i18n[lang] || {};
  if (Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
  if (i18n.fr && Object.prototype.hasOwnProperty.call(i18n.fr, key)) return i18n.fr[key];
  return fallback;
}

// ---------- Markdown -> HTML (sous-ensemble maitrise, sans dependance) ----------

function mdInline(text) {
  let t = escapeText(text);
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, url) => `<a href="${url}">${label}</a>`);
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return t;
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let para = [];
  const flush = () => {
    if (para.length) {
      out.push("<p>" + mdInline(para.join(" ")) + "</p>");
      para = [];
    }
  };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) { flush(); i++; continue; }
    if (/^---+\s*$/.test(line)) { flush(); out.push("<hr>"); i++; continue; }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { flush(); const lvl = h[1].length; out.push(`<h${lvl}>` + mdInline(h[2].trim()) + `</h${lvl}>`); i++; continue; }
    if (/^>\s?/.test(line)) {
      flush();
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
      out.push("<blockquote><p>" + mdInline(buf.join(" ")) + "</p></blockquote>");
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flush();
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) { items.push("<li>" + mdInline(lines[i].replace(/^[-*]\s+/, "")) + "</li>"); i++; }
      out.push("<ul>" + items.join("") + "</ul>");
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      flush();
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) { items.push("<li>" + mdInline(lines[i].replace(/^\d+\.\s+/, "")) + "</li>"); i++; }
      out.push("<ol>" + items.join("") + "</ol>");
      continue;
    }
    para.push(line.trim());
    i++;
  }
  flush();
  return out.join("\n");
}

function stripQuotes(s) {
  if (s == null) return "";
  return s.replace(/^"(.*)"$/, "$1");
}

function parseArticleFile(raw) {
  raw = raw.replace(/\r\n/g, "\n");
  const fm = {};
  let body = raw;
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (m) {
    body = m[2];
    m[1].split("\n").forEach((line) => {
      const mm = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
      if (mm) fm[mm[1]] = mm[2];
    });
  }
  const h1 = body.match(/^#\s+(.+)$/m);
  return {
    id: fm.id,
    lang: fm.lang,
    slug: fm.slug,
    seoTitle: stripQuotes(fm.seo_title),
    seoDesc: stripQuotes(fm.seo_meta_description),
    h1: h1 ? h1[1].trim() : fm.slug || "",
    bodyHtml: mdToHtml(body)
  };
}

function loadArticles() {
  if (!fs.existsSync(CONTENT)) return [];
  const map = {};
  fs.readdirSync(CONTENT).filter((f) => f.endsWith(".md")).forEach((f) => {
    const p = parseArticleFile(fs.readFileSync(path.join(CONTENT, f), "utf8"));
    if (!p.id || !p.lang) return;
    if (!map[p.id]) map[p.id] = { id: p.id, langs: {} };
    map[p.id].langs[p.lang] = p;
  });
  return Object.values(map);
}

// ---------- Habillage commun (header/menu/footer/i18n/scripts) ----------

function applyChrome(html, lang, pageUrls) {
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);

  html = html.replace(
    /(<a href="devis\.html"(?:[^>]*?)data-i18n="nav\.quoteContact"[^>]*>)/,
    `<a href="guide.html">${GUIDE_LABEL[lang]}</a>\n          $1`
  );
  html = html.replace(
    '<a href="organiser.html" data-i18n="footer.guide">',
    '<a href="guide.html" data-i18n="footer.guide">'
  );

  html = html.replace(
    /(<([a-zA-Z0-9]+)([^>]*?)\sdata-i18n="([^"]+)"([^>]*)>)([\s\S]*?)(<\/\2>)/g,
    (m, open, tag, pre, key, post, inner, close) => open + escapeText(tr(lang, key, inner)) + close
  );
  html = html.replace(
    /placeholder="[^"]*"(\s[^>]*?data-i18n-placeholder="([^"]+)")/g,
    (m, tail, key) => `placeholder="${escapeAttr(tr(lang, key, ""))}"${tail}`
  );
  html = html.replace(
    /aria-label="[^"]*"(\s[^>]*?data-i18n-aria-label="([^"]+)")/g,
    (m, tail, key) => `aria-label="${escapeAttr(tr(lang, key, ""))}"${tail}`
  );

  html = html.replace(/(src|href)="(assets|identity|data)\//g, '$1="/$2/');

  Object.keys(HREF_TO_PAGE).forEach((href) => {
    html = html.split(`href="${href}"`).join(`href="${pageUrl(HREF_TO_PAGE[href], lang)}"`);
  });
  html = html.split('href="guide.html"').join(`href="${guideIndexUrl(lang)}"`);

  html = html.replace(
    /data-lang="([a-z]{2})" aria-pressed="[^"]*"/g,
    (m, code) => `data-lang="${code}" aria-pressed="${code === lang}"`
  );

  const bootstrap =
    `    <script src="/assets/i18n.js"></script>\n` +
    `    <script>window.BM_LANG="${lang}";window.BM_PAGE_URLS=${JSON.stringify(pageUrls)};</script>\n` +
    `    <script src="/assets/site.js"></script>`;
  html = html.replace('<script src="/assets/site.js"></script>', bootstrap);

  return html;
}

function headLinks(canonicalUrl, alts) {
  let s = `    <link rel="canonical" href="${BASE_URL}${canonicalUrl}">\n`;
  alts.forEach((a) => {
    s += `    <link rel="alternate" hreflang="${a.lang}" href="${BASE_URL}${a.url}">\n`;
  });
  s += `    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/">\n`;
  return s;
}
function injectHead(html, linksStr) {
  return html.replace("</head>", `${linksStr}  </head>`);
}

// ---------- Rendus ----------

function renderPage(page, lang) {
  let html = fs.readFileSync(path.join(TEMPLATES, page.template), "utf8");
  const pageUrls = LANGS.reduce((a, l) => ((a[l] = pageUrl(page.id, l)), a), {});
  html = applyChrome(html, lang, pageUrls);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(page.title[lang])}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(">)/, `$1${escapeAttr(page.description[lang])}$2`);
  const alts = LANGS.map((l) => ({ lang: l, url: pageUrl(page.id, l) }));
  return injectHead(html, headLinks(pageUrl(page.id, lang), alts));
}

function renderArticle(article, lang) {
  const al = article.langs[lang];
  let html = fs.readFileSync(path.join(TEMPLATES, "guide-article.html"), "utf8");
  const pageUrls = LANGS.reduce(
    (a, l) => ((a[l] = article.langs[l] ? articleUrl(article, l) : guideIndexUrl(l)), a),
    {}
  );
  html = applyChrome(html, lang, pageUrls);
  html = html.replace("__TITLE__", () => escapeText(al.seoTitle || al.h1));
  html = html.replace('content="__DESC__"', () => `content="${escapeAttr(al.seoDesc || "")}"`);
  const alts = LANGS.filter((l) => article.langs[l]).map((l) => ({ lang: l, url: articleUrl(article, l) }));
  html = injectHead(html, headLinks(articleUrl(article, lang), alts));
  return html.replace("<!--ARTICLE-->", () => al.bodyHtml);
}

function renderGuideIndex(lang, articles) {
  let html = fs.readFileSync(path.join(TEMPLATES, "guide-index.html"), "utf8");
  const pageUrls = LANGS.reduce((a, l) => ((a[l] = guideIndexUrl(l)), a), {});
  html = applyChrome(html, lang, pageUrls);
  const gt = GUIDE_TEXT[lang];
  html = html.replace("__TITLE__", () => escapeText(gt.metaTitle));
  html = html.replace('content="__DESC__"', () => `content="${escapeAttr(gt.metaDescription)}"`);
  html = html.replace("__GUIDE_TITLE__", () => escapeText(gt.title));
  html = html.replace("__GUIDE_INTRO__", () => escapeText(gt.intro));
  const items = articles
    .filter((a) => a.langs[lang])
    .map((a) => {
      const al = a.langs[lang];
      const url = articleUrl(a, lang);
      return (
        `<article class="result-card"><div><h3><a href="${url}">${escapeText(al.h1)}</a></h3>` +
        `<p class="muted">${escapeText(al.seoDesc || "")}</p></div>` +
        `<div><a class="btn secondary" href="${url}">${escapeText(gt.readMore)}</a></div></article>`
      );
    });
  const listHtml = items.length ? items.join("\n") : `<p class="muted">${escapeText(gt.empty)}</p>`;
  html = html.replace("<!--ARTICLE-LIST-->", () => listHtml);
  const alts = LANGS.map((l) => ({ lang: l, url: guideIndexUrl(l) }));
  return injectHead(html, headLinks(guideIndexUrl(lang), alts));
}

function writeFileSafe(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function copyRecursive(src, dest) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((name) => {
      if (name === ".DS_Store" || name.endsWith(".csv")) return; // pas de fichiers systeme ni de leads
      copyRecursive(path.join(src, name), path.join(dest, name));
    });
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function buildRoot() {
  const alternates = LANGS.map((l) => `    <link rel="alternate" hreflang="${l}" href="${BASE_URL}/${l}/">`).join("\n");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Business Move</title>
    <meta name="robots" content="noindex">
    <link rel="icon" href="/identity/logo_bm_transparent_white_512.png">
${alternates}
    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/">
    <script>
      (function () {
        var supported = ${JSON.stringify(LANGS)};
        var stored = null;
        try { stored = localStorage.getItem("bm.lang"); } catch (e) {}
        var nav = (navigator.language || navigator.userLanguage || "fr").slice(0, 2).toLowerCase();
        var lang = supported.indexOf(stored) >= 0 ? stored : (supported.indexOf(nav) >= 0 ? nav : "fr");
        window.location.replace("/" + lang + "/");
      })();
    </script>
  </head>
  <body>
    <p>Business Move — <a href="/fr/">Français</a> · <a href="/nl/">Nederlands</a> · <a href="/en/">English</a></p>
  </body>
</html>
`;
}

function sitemapEntry(loc, altPairs) {
  const alternates = altPairs
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${BASE_URL}${a.url}"/>`)
    .join("\n");
  return (
    `  <url>\n    <loc>${loc}</loc>\n${alternates}\n` +
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/"/>\n  </url>`
  );
}

function buildSitemap(articles) {
  const urls = [];
  pages.forEach((page) => {
    LANGS.forEach((lang) => {
      urls.push(sitemapEntry(`${BASE_URL}${pageUrl(page.id, lang)}`, LANGS.map((l) => ({ lang: l, url: pageUrl(page.id, l) }))));
    });
  });
  LANGS.forEach((lang) => {
    urls.push(sitemapEntry(`${BASE_URL}${guideIndexUrl(lang)}`, LANGS.map((l) => ({ lang: l, url: guideIndexUrl(l) }))));
  });
  articles.forEach((a) => {
    const existing = LANGS.filter((l) => a.langs[l]);
    existing.forEach((lang) => {
      urls.push(sitemapEntry(`${BASE_URL}${articleUrl(a, lang)}`, existing.map((l) => ({ lang: l, url: articleUrl(a, l) }))));
    });
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
}

// Configuration Apache : domaine canonique + vrais 301. (HTTPS optionnel, voir note.)
function buildHtaccess() {
  const redirects = Object.keys(REDIRECTS)
    .map((oldPath) => `Redirect 301 /${oldPath} ${pageUrl(REDIRECTS[oldPath].toPage, REDIRECTS[oldPath].lang)}`)
    .join("\n");
  return `# Business Move — configuration Apache (genere par build.js, ne pas editer a la main)

# Pas de listing des dossiers
Options -Indexes

<IfModule mod_rewrite.c>
  RewriteEngine On

  # Domaine canonique : sans www
  RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
  RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]

  # Forcer HTTPS — a activer seulement si behostings ne le fait pas deja
  # (risque de boucle derriere un proxy SSL ; decommenter en connaissance de cause) :
  # RewriteCond %{HTTPS} off
  # RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Redirections 301 des anciennes URL vers les nouvelles pages FR
${redirects}
`;
}

function main() {
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // Copie des assets sources dans dist/ (site.css, site.js, images, movers.js ; .csv exclus).
  ["assets", "identity", "data"].forEach((d) => {
    const s = path.join(ROOT, d);
    if (fs.existsSync(s)) copyRecursive(s, path.join(DIST, d));
  });

  // Dictionnaire genere, consomme par le navigateur.
  writeFileSafe(path.join(DIST, "assets", "i18n.js"), `window.BM_I18N = ${JSON.stringify(i18n)};\n`);

  const articles = loadArticles();

  let count = 0;
  pages.forEach((page) => {
    LANGS.forEach((lang) => {
      writeFileSafe(outputPath(page.id, lang), renderPage(page, lang));
      count += 1;
    });
  });

  LANGS.forEach((lang) => writeFileSafe(guideIndexOutput(lang), renderGuideIndex(lang, articles)));
  let artCount = 0;
  articles.forEach((a) =>
    Object.keys(a.langs).forEach((lang) => {
      writeFileSafe(articleOutput(a, lang), renderArticle(a, lang));
      artCount += 1;
    })
  );

  writeFileSafe(path.join(DIST, "index.html"), buildRoot());
  writeFileSafe(path.join(DIST, "sitemap.xml"), buildSitemap(articles));
  writeFileSafe(path.join(DIST, "robots.txt"), buildRobots());
  writeFileSafe(path.join(DIST, ".htaccess"), buildHtaccess());

  console.log(
    `OK : ${count} pages + ${LANGS.length} index Guide + ${artCount} article(s) + racine + sitemap.xml + robots.txt + .htaccess`
  );
  console.log("Tout est dans dist/ — depose son CONTENU a la racine web de behostings (FTP).");
}

main();
