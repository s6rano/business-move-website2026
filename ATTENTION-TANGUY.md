# ⚠️ ATTENTION TANGUY — à lire avant de modifier le site

## La règle d'or

Ce site est **généré automatiquement**. Il ne faut donc **jamais modifier directement** les pages que tu vois dans les dossiers `/fr`, `/nl` et `/en`.

Pourquoi ? Parce que ces pages sont **reconstruites** à chaque fois qu'on lance le build. Si tu corriges un texte directement dans `/fr/index.html`, ta correction sera **écrasée** au prochain build. Travail perdu.

## Le plus simple : demande à Felx

Tu n'as **rien de technique** à gérer. Il te suffit de me décrire ton changement en français :

> « Felx, remplace le mot "Chercher" par "Rechercher". »
> « Felx, change le titre de la page devis. »
> « Felx, ajoute un paragraphe ici. »

Et je m'occupe de **tout** : je modifie le bon fichier source, je régénère les 9 pages, je vérifie, et je commite/pousse si tu me le demandes. Tu ne touches jamais à un fichier compliqué.

## Si un jour tu veux comprendre "où ça se modifie"

Les textes ne sont écrits qu'**à un seul endroit** (la source), puis recopiés automatiquement dans les 3 langues.

| Ce que tu veux changer | Le fichier source à modifier |
|---|---|
| Un texte ou une traduction | `src/i18n.json` |
| Un titre ou une description SEO | `src/pages.json` |
| La structure d'une page (blocs, mise en page) | `src/templates/` |

Puis on régénère avec cette commande dans le dossier du site :

```bash
npm run build
```

## À retenir en une phrase

**Ne touche pas à `/fr`, `/nl`, `/en` → demande le changement à Felx, ou modifie la source dans `src/` puis `npm run build`.**
