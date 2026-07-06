# Moteur & fonctionnalités du site Business Move

Référence technique du générateur statique (`build.js`) et de tout ce qui a été construit.
Sert deux buts : produire la suite du contenu, et préparer la **réutilisation du générateur** comme brique d'un stack de marque (voir ROADMAP, chantier 4).

Dernière révision : 6 juillet 2026.

## Principe

Générateur statique **sans dépendance** (Node.js pur). La **racine ne contient que la source** ; tout le généré va dans `dist/`.

```
Source                      →  build.js  →  Sortie
src/i18n.json                             dist/  (à déposer par FTP
src/pages.json                                    à la racine web de behostings)
src/templates/*.html
content/*.md          (articles du Guide)
content/legal/*.md    (CGU + confidentialité)
assets/  identity/  data/
```

Commande : `npm run build`. Prévisualisation : `python3 -m http.server --directory dist 4173`.
**Prod = behostings (FTP)** ; GitHub = backup. `dist/` est git-ignoré.

## Les trois langues

`LANGS = ["fr","nl","en"]`. Chaque page existe en 3 URLs localisées, reliées par `hreflang` + `canonical` (non-www). La racine `/` détecte la langue et redirige (elle est en `noindex`, volontaire). Slugs, titres et méta **localisés** (pas traduits mot à mot).

## Types de pages et où les éditer

| Type | Source | Rendu |
|---|---|---|
| Pages (accueil, organiser, devis) | `src/pages.json` + `src/templates/` | `/{lang}/{slug}` |
| Index Guide | constante `GUIDE_TEXT` + `guide-index.html` | `/{lang}/{guide}/` |
| **Articles du Guide** | `content/GUIxxx-*.md` (1 fichier / langue) | `/{lang}/{guide}/{slug}.html` |
| CGU + Confidentialité | `content/legal/{cgu,privacy}.{lang}.md` | `/{lang}/{slug}` (gabarit `cgu.html`) |

### Anatomie d'un article (`content/GUIxxx-slug.md`)

Frontmatter (entre `---`) :
```yaml
id: GUI001            # commun aux 3 langues → relie les versions (hreflang)
lang: fr              # fr | nl | en
pilier: I             # PICAT
type: satellite       # hub | satellite (documentaire)
hub: GUI001           # documentaire
vague: 1              # documentaire
statut: redige-v0.1   # documentaire
slug: prix-...        # slug localisé de l'URL
seo_title: "..."      # <title>
seo_meta_description: "..."
cta: calculateur      # calculateur (→ devis) | annuaire (→ accueil) | (vide = pas de bouton)
illus: price          # thème de bannière (voir banque)
liens: [GUI002, ...]  # MAILLAGE : ids reliés (voir « Lire aussi » auto)
reserve: "..."        # mention de réserve (prix indicatifs)
```
Corps = Markdown (sous-ensemble maison). Marqueur `{{sponsor}}` = insère l'encart sponsor (Go to the Point par défaut) en cours de lecture. **Ne pas écrire de « Lire aussi » à la main** : il est généré (voir ci-dessous).

## Fonctionnalités clés

### Maillage interne automatique (« Lire aussi »)
Généré au build depuis `liens`. Ne relie **que les articles réellement présents** dans le build, **dans la même langue**. Un article « à venir » est ignoré → **publication incrémentale sans lien cassé**. (`renderArticle` + placeholder `<!--RELATED-->`.)

### Bannières (banque d'illustrations)
`assets/illustrations/banners/` ; noms `bm-illus-{theme}-move-NN.png`. Le thème vient du frontmatter `illus`. Tirage **déterministe par id** parmi les fichiers du thème → un article garde la même image dans les 3 langues ; plusieurs fichiers d'un thème = diversité auto. Réserve = sous-dossier `_reserve/` (non publié). **Compresser** les PNG (pngquant) avant commit.

### Pages légales
Mêmes mécaniques (gabarit `cgu.html`, slug localisé, hreflang, sitemap). Lien footer « Conditions générales » + « Politique de confidentialité » dans les 6 gabarits. Mentions éditeur remplies (Noir de Monde…). Reste 1 placeholder volontaire : néant (à jour au 6 juillet).

### RGPD / Google Analytics (consentement)
**Interrupteur unique** dans `build.js` :
```js
const GA_MEASUREMENT_ID = "G-NY3X23BD1N"; // vide = aucun cookie, aucun bandeau
```
Si renseigné : un **bandeau de consentement** s'affiche ; GA (`gtag.js`) ne se charge **qu'après « Accepter »** (IP anonymisée). Logique dans `assets/site.js` (`initConsent`/`loadGA`), textes dans `i18n.json` (`consent.*`), style `.cookie-consent` dans `site.css`. Aucun script GA en dur dans le HTML.

### SEO technique
`sitemap.xml` (toutes les pages + `hreflang`), `robots.txt` (Allow + sitemap), `.htaccess` (301 www→non-www). **Google Search Console** : propriété préfixe d'URL `https://businessmove.eu`, vérif par fichier HTML, sitemap à soumettre.

## Recettes

- **Ajouter un article** : créer `content/GUIxxx-slug.{fr,nl,en}.md` (frontmatter + corps, `{{sponsor}}` si voulu), renseigner `liens`, choisir `illus`. `npm run build`. Le maillage se met à jour seul.
- **Activer/désactiver GA** : changer `GA_MEASUREMENT_ID`. Rebuild.
- **Déployer** : `npm run build` → FTP du **contenu de `dist/`** à la racine web behostings.

## Note de réutilisabilité (chantier 4 — fusion dans le stack de marque)

Pour neutraliser ce générateur en brique de stack, il faudra paramétrer ce qui est **propre à BM** :
- `BASE_URL`, mentions « Business Move », logos/`identity/`, couleurs (`site.css`), liens sortants **Go to the Point** (`gttpUrl`), l'ID GA, les réseaux sociaux (footers), la banque `bm-illus-*`.
- Ce qui est **générique** (à garder tel quel) : la mécanique multilingue, le maillage auto, le rendu légal + bandeau RGPD, le SEO technique, le convertisseur Markdown.
