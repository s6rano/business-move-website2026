# QA éditoriale en CI (bundle vendoré)

Ce dossier fait tourner la **QA rédaction** et la **QA traduction** sur les articles
`content/*.md`, en local **et** dans la GitHub Action (`.github/workflows/qa.yml`).
Le job **échoue** s'il reste une violation dure → **merge à bloquer** (voir plus bas).

## Lancer en local

```bash
python3 qa/run_qa.py        # exit 0 si tout est propre, 1 sinon
```

## Contenu (vendoré depuis les repos de stack — source unique)

Conforme à la décision « vendoring à l'instanciation » (ROADMAP, Chantier 2) : le
repo site embarque une **copie figée** du moteur QA pour être **auto-suffisant** en
CI (un seul checkout, aucun jeton cross-repo). La source de vérité reste ailleurs :

| Fichier ici | Source (repo s6rano) |
|---|---|
| `qa_bm.py` (QA rédaction, `--ci`) | `stack-editorial-bm` : `scripts/qa_bm.py` |
| `engine/qa_translate.py` (QA traduction) | `stack-editorial-translate` : `qa/qa_translate.py` |
| `langues/{NL-BE,EN-GB}.md` | `stack-editorial-translate` : `langues/` |
| `brand-tables/*` (tables + manifest) | `stack-editorial-bm` : `traduction/` |

Version figée : voir `ENGINE_VERSION`.

## Resynchroniser après une évolution du stack

Depuis la racine du monorepo `PROJETS-APP-SAAS/` :

```bash
cd business-move-website2026
cp ../Stack-editorial/Stack-editorial-BM/scripts/qa_bm.py            qa/qa_bm.py
cp ../Stack-editorial/Stack-editorial-translate/qa/qa_translate.py   qa/engine/qa_translate.py
cp ../Stack-editorial/Stack-editorial-translate/langues/NL-BE.md     qa/langues/NL-BE.md
cp ../Stack-editorial/Stack-editorial-translate/langues/EN-GB.md     qa/langues/EN-GB.md
cp ../Stack-editorial/Stack-editorial-BM/traduction/table-0*.md      qa/brand-tables/
cp ../Stack-editorial/Stack-editorial-BM/traduction/manifest.yaml    qa/brand-tables/
```
Puis mettre à jour `qa/ENGINE_VERSION` et relancer `python3 qa/run_qa.py`.

## Ce qui bloque / ne bloque pas

- **Bloque** (exit 1) : blacklist L-1 (terme proscrit en propre), méta-règle PICAT M-1,
  niveau rédaction « À retravailler », ou QA traduction avec violation dure.
- **Ne bloque pas** (signalements 🟡) : E-E-A-T, densité mot-clé, gras, tirets — ce sont
  des points de relecture humaine, pas des bloquants.

## Rendre le contrôle obligatoire (à faire une fois)

Sur GitHub : **Settings → Branches → Add branch ruleset/protection** sur `main` →
**Require status checks to pass before merging** → sélectionner **`qa`**.
Sans ça, l'Action tourne et s'affiche (rouge/vert) mais n'empêche pas techniquement le merge.
