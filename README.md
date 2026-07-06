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

Le site est **généré** : on ne modifie jamais directement les pages dans `/fr`, `/nl`, `/en`. Ces dossiers sont produits automatiquement par un script à partir d'une **source unique**.

### Source de vérité (ce qu'on édite)

- `src/i18n.json` — toutes les traductions (FR / NL / EN), une seule fois par texte
- `src/pages.json` — la liste des pages : slugs par langue, titres et descriptions SEO
- `src/templates/` — les gabarits HTML (`index.html`, `organiser.html`, `devis.html`)
- `assets/site.js` — la logique (recherche, calculateur), sans les textes
- `assets/site.css` — le design
- `data/movers.js` — les déménageurs et les coordonnées des codes postaux

### Fichiers générés (à ne pas éditer à la main)

- `/fr`, `/nl`, `/en` — les 9 pages traduites
- `index.html` (racine) — détection automatique de la langue puis redirection
- `assets/i18n.js` — le dictionnaire chargé par le navigateur
- `sitemap.xml`, `robots.txt`

## Régénérer le site après une modification

```bash
npm run build
```

(ou `node build.js`). Le script régénère tout : pages par langue, `hreflang`, `canonical`, titres traduits, sitemap et robots.

## Aperçu en local

```bash
npm run build
python3 -m http.server 4173
```

Puis ouvrir `http://localhost:4173/` (la racine détecte la langue) ou directement `http://localhost:4173/fr/`.

## Publication

Le site est **en production chez behostings** (hébergeur privé), mis à jour par **FTP (FileZilla)**. GitHub ne sert que de **sauvegarde/versioning** ; pousser sur GitHub ne met PAS le site en ligne.

Pour publier :

1. `npm run build` — régénère tout et assemble un dossier `dist/` (contenu publiable uniquement : `fr/ nl/ en/ assets/ identity/ data/`, `index.html`, `sitemap.xml`, `robots.txt`, les relais).
2. Dans FileZilla, déposer **le contenu de `dist/`** à la racine web de behostings.

`dist/` est régénéré à chaque build et exclu de Git. Les articles Guide vivent dans `content/*.md` (un fichier par langue, reliés par le champ `id`). Voir la feuille de route SEO dans `docs/PLAN-SEO-MULTILINGUE.md`.
