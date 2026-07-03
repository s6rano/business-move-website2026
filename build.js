#!/usr/bin/env node
/*
 * build.js — Generateur statique multilingue de Business Move.
 *
 * Principe : une seule source de verite (src/i18n.json + src/pages.json + les
 * gabarits dans src/templates/) produit les pages HTML par langue dans /fr,
 * /nl, /en, avec titres traduits, hreflang, canonical et liens localises.
 *
 * Usage : node build.js  (ou npm run build)
 * Aucune dependance externe.
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const TEMPLATES = path.join(SRC, "templates");
const BASE_URL = "https://businessmove.eu";
const LANGS = ["fr", "nl", "en"];

const i18n = JSON.parse(fs.readFileSync(path.join(SRC, "i18n.json"), "utf8"));
const pages = JSON.parse(fs.readFileSync(path.join(SRC, "pages.json"), "utf8"));

// Correspondance : href du gabarit -> identifiant de page logique.
const HREF_TO_PAGE = {
  "index.html": "home",
  "organiser.html": "organize",
  "devis.html": "quote"
};

function pageById(id) {
  return pages.find((p) => p.id === id);
}

// URL publique (chemin absolu depuis la racine du domaine) d'une page/langue.
function pageUrl(id, lang) {
  const slug = pageById(id).slug[lang];
  return slug ? `/${lang}/${slug}` : `/${lang}/`;
}

// Chemin de sortie sur le disque.
function outputPath(id, lang) {
  const slug = pageById(id).slug[lang];
  return slug ? path.join(ROOT, lang, slug) : path.join(ROOT, lang, "index.html");
}

function escapeText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

function renderPage(page, lang) {
  const templateFile = path.join(TEMPLATES, page.template);
  let html = fs.readFileSync(templateFile, "utf8");

  // 1. Langue du document.
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);

  // 2. Contenu textuel des elements data-i18n (elements a texte simple).
  html = html.replace(
    /(<([a-zA-Z0-9]+)([^>]*?)\sdata-i18n="([^"]+)"([^>]*)>)([\s\S]*?)(<\/\2>)/g,
    (match, open, tag, pre, key, post, inner, close) => {
      const value = tr(lang, key, inner);
      return open + escapeText(value) + close;
    }
  );

  // 3. Placeholders traduits (placeholder="..." precede data-i18n-placeholder).
  html = html.replace(
    /placeholder="[^"]*"(\s[^>]*?data-i18n-placeholder="([^"]+)")/g,
    (match, tail, key) => `placeholder="${escapeAttr(tr(lang, key, ""))}"${tail}`
  );

  // 4. aria-label traduits.
  html = html.replace(
    /aria-label="[^"]*"(\s[^>]*?data-i18n-aria-label="([^"]+)")/g,
    (match, tail, key) => `aria-label="${escapeAttr(tr(lang, key, ""))}"${tail}`
  );

  // 5. Titre et meta description propres a la page + langue.
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(page.title[lang])}</title>`);
  html = html.replace(
    /(<meta name="description" content=")[^"]*(">)/,
    `$1${escapeAttr(page.description[lang])}$2`
  );

  // 6. Chemins des assets en absolu depuis la racine (le site vit sous /fr, /nl, /en).
  html = html.replace(/(src|href)="(assets|identity|data)\//g, '$1="/$2/');

  // 7. Liens internes -> URL localisees.
  Object.keys(HREF_TO_PAGE).forEach((href) => {
    const targetId = HREF_TO_PAGE[href];
    const url = pageUrl(targetId, lang);
    html = html.split(`href="${href}"`).join(`href="${url}"`);
  });

  // 8. Boutons de langue : etat actif correct.
  html = html.replace(
    /data-lang="([a-z]{2})" aria-pressed="[^"]*"/g,
    (match, code) => `data-lang="${code}" aria-pressed="${code === lang}"`
  );

  // 9. Balises canonical + hreflang dans le head.
  const alternates = LANGS.map(
    (l) => `    <link rel="alternate" hreflang="${l}" href="${BASE_URL}${pageUrl(page.id, l)}">`
  ).join("\n");
  const headLinks =
    `    <link rel="canonical" href="${BASE_URL}${pageUrl(page.id, lang)}">\n` +
    `${alternates}\n` +
    `    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/">\n`;
  html = html.replace("</head>", `${headLinks}  </head>`);

  // 10. Injection du dictionnaire + langue + URL soeurs avant site.js.
  const pageUrls = LANGS.reduce((acc, l) => {
    acc[l] = pageUrl(page.id, l);
    return acc;
  }, {});
  const bootstrap =
    `    <script src="/assets/i18n.js"></script>\n` +
    `    <script>window.BM_LANG="${lang}";window.BM_PAGE_URLS=${JSON.stringify(pageUrls)};</script>\n` +
    `    <script src="/assets/site.js"></script>`;
  html = html.replace('<script src="/assets/site.js"></script>', bootstrap);

  return html;
}

function writeFileSafe(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function buildRoot() {
  const alternates = LANGS.map(
    (l) => `    <link rel="alternate" hreflang="${l}" href="${BASE_URL}/${l}/">`
  ).join("\n");
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

function buildSitemap() {
  const urls = [];
  pages.forEach((page) => {
    LANGS.forEach((lang) => {
      const loc = `${BASE_URL}${pageUrl(page.id, lang)}`;
      const alternates = LANGS.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}${pageUrl(page.id, l)}"/>`
      ).join("\n");
      urls.push(
        `  <url>\n    <loc>${loc}</loc>\n${alternates}\n` +
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/"/>\n  </url>`
      );
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

function main() {
  // Dictionnaire consommable par le navigateur.
  writeFileSafe(
    path.join(ROOT, "assets", "i18n.js"),
    `window.BM_I18N = ${JSON.stringify(i18n)};\n`
  );

  // Pages par langue.
  let count = 0;
  pages.forEach((page) => {
    LANGS.forEach((lang) => {
      writeFileSafe(outputPath(page.id, lang), renderPage(page, lang));
      count += 1;
    });
  });

  // Racine + fichiers SEO.
  writeFileSafe(path.join(ROOT, "index.html"), buildRoot());
  writeFileSafe(path.join(ROOT, "sitemap.xml"), buildSitemap());
  writeFileSafe(path.join(ROOT, "robots.txt"), buildRobots());

  console.log(`OK : ${count} pages generees + racine + sitemap.xml + robots.txt + assets/i18n.js`);
}

main();
