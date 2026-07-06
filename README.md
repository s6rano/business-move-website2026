# Business Move Website 2026

Site trilingue (FR / NL / EN) pour trouver un déménageur d'entreprise en Belgique par code postal et rayon, avec un calculateur de devis indicatif.

## Fonctionnalités

- Interface FR / NL / EN avec **une vraie URL par langue** (bon pour le SEO)
- Modes clair et sombre
- Base locale de déménageurs
- Recherche par code postal et rayon
- Calculateur de devis indicatif (distances routières par fourchettes)
- Brouillon d'email avec trois contacts de déménageurs

## Comment le site est construit (important)

Le site est **généré** dans un dossier `dist/` : on ne modifie jamais directement le contenu de `dist/`. Tout est produit par un script à partir de la **source** (à la racine du dépôt).

### Source de vérité (ce qu'on édite)

- `src/i18n.json` — toutes les traductions (FR / NL / EN), une seule fois par texte
- `src/pages.json` — la liste des pages : slugs par langue, titres et descriptions SEO
- `src/templates/` — les gabarits HTML (pages appli + `guide-article`, `guide-index`)
- `content/*.md` — les articles Guide (un fichier par langue, reliés par le champ `id`)
- `assets/site.js` — la logique (recherche, calculateur), sans les textes
- `assets/site.css` — le design
- `data/movers.js` — les déménageurs et les coordonnées des codes postaux

### Fichiers générés — tout dans `dist/` (à ne pas éditer à la main)

`npm run build` produit **uniquement** le dossier `dist/` (la racine ne contient que la source). `dist/` contient : `fr/ nl/ en/` (pages + articles Guide), `assets/` (+ `i18n.js`), `identity/`, `data/`, `index.html` (routeur de langue), `sitemap.xml`, `robots.txt` et `.htaccess`.

## Régénérer le site après une modification

```bash
npm run build
```

(ou `node build.js`). Le script régénère tout `dist/` : pages par langue, articles Guide, `hreflang`, `canonical`, titres traduits, sitemap, robots et `.htaccess`.

## Aperçu en local

```bash
npm run build
python3 -m http.server --directory dist 4173
```

Puis ouvrir `http://localhost:4173/` (la racine détecte la langue) ou directement `http://localhost:4173/fr/`.

## Publication

Le site est **en production chez behostings** (hébergeur privé), mis à jour par **FTP (FileZilla)**. GitHub ne sert que de **sauvegarde/versioning** ; pousser sur GitHub ne met PAS le site en ligne.

Pour publier :

1. `npm run build` — régénère le dossier `dist/` (contenu publiable uniquement : `fr/ nl/ en/ assets/ identity/ data/`, `index.html`, `sitemap.xml`, `robots.txt`, `.htaccess`).
2. Dans FileZilla, déposer **le contenu de `dist/`** à la racine web de behostings.

`dist/` est régénéré à chaque build et exclu de Git. Les articles Guide vivent dans `content/*.md` (un fichier par langue, reliés par le champ `id`). Voir la feuille de route SEO dans `docs/PLAN-SEO-MULTILINGUE.md`.
