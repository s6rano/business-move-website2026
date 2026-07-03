# Plan d'action — Business Move : SEO multilingue + cocons sémantiques

> Feuille de route validée avec Tanguy. Statut : **Phases 0 à 2 faites** — moteur multilingue en place, 3 pages migrées. Reste Phases 3 (cocons), 4 (entonnoir), 5 (mesure).
> Site concerné : `businessmove.eu` (statique, hébergé sur GitHub Pages).

## Les 2 objectifs business

1. **Générer du trafic** organique en FR / NL / EN.
2. **Entonnoir** : rediriger subtilement les internautes vers **gotothepoint.eu**, et à terme vers des **partenaires payants** (modèle de trafic entrant rémunéré).

## Le problème de départ

Le trilinguisme créé par Codex remplace les textes **en JavaScript** sur une **seule URL** par page. Résultat : pour Google, le site est **quasi-monolingue (français)**. Les versions NL et EN ne sont pas indexées séparément (pas d'URL propre, pas de `hreflang`, titres/descriptions non traduits côté index).

## La cible

Chaque langue a sa **propre URL**, avec le **contenu traduit écrit en dur dans le HTML** (pas injecté par JS), relié par des balises `hreflang`. Le tout généré depuis **une seule source de vérité** (le dictionnaire `i18n` déjà présent dans `assets/site.js`).

---

## Phase 0 — Décisions

### A. Structure des URL par langue (à valider mot par mot)

Un dossier par langue, avec des slugs traduits et descriptifs (bons pour le SEO).

| Rôle de la page | FR | NL | EN | Mot-clé principal |
|---|---|---|---|---|
| Accueil / Annuaire | `/fr/` | `/nl/` | `/en/` | déménageur d'entreprise / zakelijke verhuizer / corporate movers |
| Organiser le déménagement | `/fr/organiser-demenagement-entreprise.html` | `/nl/kantoorverhuizing-organiseren.html` | `/en/plan-office-move.html` | organiser déménagement entreprise |
| Devis / Offerte / Quote | `/fr/devis-demenagement-entreprise.html` | `/nl/offerte-bedrijfsverhuizing.html` | `/en/office-move-quote.html` | devis déménagement entreprise |

**Statut** : VALIDÉ. Style retenu = slugs « riches en mots-clés » pour les 3 langues. Les pages d'accueil restent à la racine du dossier de langue (`index.html`), leur SEO repose sur le `<title>` et le `<h1>`.

### B. Langue par défaut à la racine — DÉCIDÉ

Quand un visiteur tape `businessmove.eu` tout court : **détection automatique de la langue du navigateur**, puis redirection vers `/fr/`, `/nl/` ou `/en/`. La racine porte aussi le `hreflang="x-default"` pour Google.

### C. Indexation existante (à vérifier)

Si des URL actuelles (ex. `businessmove.eu/devis.html`) sont déjà indexées, il faudra des **pages-relais de redirection** (GitHub Pages ne gère pas les vraies redirections 301). À contrôler dans la Google Search Console.

---

## Phase 1 — Moteur multilingue SEO-friendly (technique)

Principe : garder **une seule source de vérité** (le dictionnaire `i18n`) et un **script Node.js** qui génère automatiquement les pages HTML par langue.

Pour chaque page x chaque langue, le script produit :

- Le contenu traduit **écrit en dur dans le HTML** (visible par Google).
- Un `<title>` et une meta description propres à la langue.
- Les balises `hreflang` reliant les 3 versions.
- Une balise `canonical`.

Ne change pas : le design, le calculateur de distance (déjà corrigé), le sélecteur de langue côté visiteur.

Livrables :

- Un dossier `src/` (gabarits + dictionnaire).
- Un script `build.js` (`npm run build` → génère `/fr/ /nl/ /en/`).
- Un `sitemap.xml` (toutes les URL, toutes langues) + `robots.txt`.
- Une page racine avec détection auto de langue (décision B).

---

## Phase 2 — Migration des 3 pages existantes

1. Transformer les pages actuelles en gabarits pour le script.
2. Générer les 9 pages (3 pages x 3 langues).
3. Mettre les redirections des anciennes URL vers les nouvelles.
4. Tester en local avant de pousser en ligne.

Résultat : site iso-fonctionnel, mais vraiment trilingue pour Google. Aucun contenu nouveau encore.

---

## Phase 3 — Cocons sémantiques (stratégie de contenu)

Principe d'un cocon : une **page-pilier** (sujet large) entourée d'**articles-satellites** (sous-sujets précis), tous reliés par des liens internes. Google fait remonter tout le cocon.

Exemple pour Business Move :

```
PILIER : « Guide complet du déménagement d'entreprise en Belgique »
   - Combien coûte un déménagement de bureaux ?
   - Checklist : préparer le déménagement de vos bureaux
   - Déménager son parc informatique sans coupure
   - Gérer les archives lors d'un déménagement B2B
   - Déménagement d'entreprise : quel planning ?
   - Bruxelles / Anvers / Liège : déménager ses bureaux (pages locales SEO)
```

Chaque article existe en 3 langues (même moteur qu'en Phase 1).

Décisions à préparer : choix des piliers et des mots-clés cibles par langue. Outil recommandé : le skill `content-strategy` (topic clusters, calendrier éditorial).

---

## Phase 4 — Entonnoir : GTTP + partenaires

| Mécanisme | Comment |
|---|---|
| Redirection subtile vers gotothepoint.eu | Encarts contextuels en fin d'article (« Vous préférez déléguer ? »), déclinés dans les cocons. CTA non-agressifs. |
| Suivi du trafic sortant | Marquer les liens vers GTTP (`?utm_source=businessmove`) pour mesurer le trafic envoyé. |
| Emplacements partenaires payants | Prévoir des « slots » identifiables (annuaire des movers, encarts sponsorisés) → base d'un futur modèle de trafic entrant payé. |

Point d'attention honnêteté / SEO : la redirection doit rester **transparente et utile au lecteur**. Google pénalise les entonnoirs trompeurs. « Subtil » = pertinent et bien intégré, pas caché.

---

## Phase 5 — Mesure & indexation

- Soumettre le `sitemap.xml` à la Google Search Console.
- Suivre les positions par langue, le trafic, les clics vers GTTP.

---

## Récap de l'effort

| Phase | Nature | Effort |
|---|---|---|
| 0 · Décisions | ensemble, rapide | court |
| 1 · Moteur multilingue | technique | moyen |
| 2 · Migration 3 pages | technique | petit |
| 3 · Cocons sémantiques | éditorial + technique | gros (par vagues) |
| 4 · Entonnoir GTTP | léger | petit |
| 5 · Mesure | accompagnement | continu |

---

## Journal des décisions

- **2026-07-03** : Racine du site = détection automatique de la langue du navigateur (Phase 0.B).
- **2026-07-03** : Slugs traduits validés en style « riche en mots-clés » pour les 3 langues (Phase 0.A) — tableau figé.
- **2026-07-03** : Plan sauvegardé comme feuille de route avant démarrage technique.
- **2026-07-03** : Phase 0.C réglée. Redirections des anciennes URL générées par `build.js` (pages-relais canonical + meta refresh + JS) : `organiser.html` → `/fr/organiser-demenagement-entreprise.html`, `devis.html` → `/fr/devis-demenagement-entreprise.html` ; l'ancienne `index.html`/`/` est couverte par la racine à détection auto. Reste conseillé : vérifier dans la Search Console quelles anciennes URL étaient réellement indexées.
- **2026-07-03** : Phases 1 et 2 réalisées. Moteur de génération statique en place (`build.js`, source unique `src/`), 9 pages générées (3 x FR/NL/EN) avec `hreflang`, `canonical`, titres/descriptions traduits, liens localisés, racine à détection auto, `sitemap.xml` et `robots.txt`. Régénération via `npm run build`. Restent à faire : redirections des anciennes URL si déjà indexées (Phase 0.C) et Phases 3-4-5.
