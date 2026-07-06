# ⚠️ ATTENTION TANGUY — à lire avant de modifier le site

## La règle d'or

Ce site est **généré automatiquement** dans le dossier `dist/`. Il ne faut donc **jamais modifier directement** le contenu de `dist/`.

Pourquoi ? Parce que `dist/` est **reconstruit** à chaque build. Si tu corriges un texte directement dans `dist/fr/index.html`, ta correction sera **écrasée** au prochain build. Travail perdu.

## Le plus simple : demande à Felx

Tu n'as **rien de technique** à gérer. Il te suffit de me décrire ton changement en français :

> « Felx, remplace le mot "Chercher" par "Rechercher". »
> « Felx, change le titre de la page devis. »
> « Felx, ajoute un paragraphe ici. »

Et je m'occupe de **tout** : je modifie le bon fichier source, je régénère `dist/`, je vérifie, et je commite/pousse si tu me le demandes. Tu ne touches jamais à un fichier compliqué.

## Si un jour tu veux comprendre "où ça se modifie"

Les textes ne sont écrits qu'**à un seul endroit** (la source), puis recopiés automatiquement dans les 3 langues.

| Ce que tu veux changer | Le fichier source à modifier |
|---|---|
| Un texte ou une traduction | `src/i18n.json` |
| Un titre ou une description SEO | `src/pages.json` |
| La structure d'une page (blocs, mise en page) | `src/templates/` |
| Un article Guide (blog) | `content/*.md` (un fichier par langue, reliés par `id`) |

Puis on régénère avec cette commande dans le dossier du site :

```bash
npm run build
```

## À retenir en une phrase

**Ne touche pas à `dist/` (c'est le généré) → demande le changement à Felx, ou modifie la source (`src/`, `content/`) puis `npm run build`. Pour publier : dépose le contenu de `dist/` sur behostings par FTP (FileZilla).**
