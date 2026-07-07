---
title: "Business Move — Blacklist transposée EN-GB (table-02)"
derive_de: "../couches/02-blacklist.md"
version_source: "v0.3 (héritée de GTTP)"
langue_cible: en-GB
contrat_version: "v0.2"
statut: "v0.1 — hérité de GTTP (couche 02 non encore élaguée pour BM). À réviser quand la blacklist BM divergera."
---

# Blacklist transposée — EN-GB (table-02)

Table dérivée de la couche 02 (blacklist FR) pour la traduction vers l'anglais britannique. **Le moteur lit cette table, pas la couche 02.** Trois sections fixes, toutes dérivées de la couche 02 :

- **§1 inversée** (`forme`) — proscrit en FR pour la forme ; neutre/prescrit/inexistant en EN. *(Précédence 02↔03 : si l'entrée a un référent glossaire, on met un pointeur `→ table-03`, pas le rendu.)*
- **§2 transposée** (`fond`) — mauvais aussi en EN.
- **§3 vigilance** — tolérées sous condition + jargon hype propre à l'EN à surveiller.

> **Hors de cette table** (voir contrat §5) : les tics de LLM anglais (« delve », « tapestry »…) vivent dans `Stack-editorial-translate/langues/EN-GB.md` (universels) ; les règles structurelles aussi ; la glose PICAT vient du `manifest` ; le gloss des réalités belges vient du `manifest` (`cible_traduction`) + table-03.

---

## §1. Transposition INVERSÉE (entrées `forme`)

| FR proscrit (couche 02) | Statut en EN-GB | Rendu / pointeur | Note |
|---|---|---|---|
| relocation | **prescrit** | « office relocation », « office move » | l'inverse du FR : terme normal/attendu en anglais |
| QVT / QVCT | **inexistant** | — | sigle franco-français ; ne pas calquer ; décrire le sens si besoin |
| boostez / dopez | **neutre** (verbe) | « boost » (sobre) | anglais courant ; éviter l'emphase marketing |
| permis de construire | réalité belge | **→ table-03** (permis d'urbanisme) | rendu (planning permission + gloss) appartient à table-03 |
| Code du travail (français) | réalité belge | **→ table-03** (Code du Bien-être au travail) | idem |
| coordonnateur SPS / CSPS | réalité belge | **→ table-03** (Coordinateur Sécurité-Santé / CSS) | idem |
| norme NF / NF C 15-100 | réalité belge | **→ table-03** (RGIE) | idem |
| normes AFNOR | réalité belge | **→ table-03** (normes NBN) | idem |
| brut de béton / clos couvert | réalité belge | **→ table-03** (Casco) | idem |
| second œuvre | réalité belge | **→ table-03** (parachèvement / fit-out) | idem |
| déclaration préalable (DP) | réalité belge | « permit exemption / minor works » | **pas d'entrée glossaire** — à ajouter à la couche 03 si on industrialise |
| moquette en lés | technique | « carpet tiles » (préféré ; « broadloom » = en lés) | **pas d'entrée glossaire** |
| placo / placoplâtre | technique | « plasterboard » (« drywall ») | **pas d'entrée glossaire** ; *Gyproc* = marque belge |

---

## §2. Transposition TRANSPOSÉE (entrées `fond` — à éviter aussi en EN-GB)

| FR proscrit (couche 02) | À éviter en EN-GB | Préférer en EN-GB |
|---|---|---|
| open space repensé | « reimagined / reinvented open space » | décrire le réel (« a floor zoned by noise level ») |
| espaces de demain / bureaux du futur | « offices of the future », « workplaces of the future », « tomorrow's office » | le présent et les usages réels |
| lieu de vie | « a place to live », « home away from home » | « the offices », « the workspace » |
| expérience collaborateur | « employee experience » (en propre, comme slogan) | « the day-to-day of work », « how people work here » |
| bien-être au travail | « workplace wellbeing », « wellbeing at work » | le bénéfice concret (« less noise », « shorter internal trips ») |
| espace de travail nouvelle génération | « next-generation workspace » | l'aménagement par ses usages |
| environnement de travail inspirant | « inspiring work environment » | montrer la scène, pas l'adjectif |
| solutions sur-mesure / clé en main | « bespoke / turnkey solutions » | décrire ce qu'on prend en charge (l'iceberg) |
| accompagnement à 360° | « 360° / end-to-end support » (creux) | énoncer le périmètre réel |
| expert / leader / référence | « self-proclaimed expert », « self-proclaimed leader », « the go-to partner » | montrer un projet, un chiffre, une méthode |
| partenaire de confiance | « trusted partner » | prouver par un fait (délai tenu, projet livré) |
| au cœur de | « at the heart of » | un propos concret |
| écosystème (de travail) | « (work) ecosystem » | « teams and how they work » |
| synergies | « synergies » | le gain concret recherché |
| ADN (de l'entreprise) | « company DNA », « in our DNA » | « what makes the organisation singular » |
| dynamique / passionné(e) | « dynamic / passionate » | supprimer ou prouver par un fait |
| incontournable | « must-have », « essential » (gratuit) | supprimer |
| dans un monde où / à l'ère de | « in a world where », « in the era/age of » | entrer par une scène ou un fait |
| il convient de noter que | « it's worth noting that », « it should be noted that » | énoncer directement |
| force est de constater | « it must be said that », « one cannot help but notice » | énoncer directement |
| en effet / par ailleurs / en outre (excès) | excès de « indeed / moreover / furthermore » | varier ou supprimer |
| plonger / explorer en profondeur | « delve into », « dive deep into », « explore in depth » | « examine », « look at » |
| transformer le paysage / redéfinir | « transform the landscape », « redefine » | décrire le changement réel et mesuré |
| libérer le potentiel | « unlock / unleash the potential » | le résultat concret attendu |
| à l'heure du télétravail / hybride | « in the age of remote/hybrid work » | entrer par le cas concret du client |
| n'hésitez pas à | « don't hesitate to », « feel free to » | une invitation précise (« write to us for a test fit ») |
| que vous soyez X ou Y | « whether you're X or Y » | s'adresser à la cible réelle (couche 04) |
| révolutionner / révolution | « revolutionise », « revolution » | « evolve », « rethink around real uses » |
| game changer / disruptif | « game changer », « game-changing », « disruptive » | décrire l'effet réel |
| tout simplement / il suffit de | « simply put », « all you need to do », « it's just a matter of » | reconnaître la complexité réelle |
| comme vous le savez / évidemment | « as you know », « obviously », « of course » | exposer sans condescendance |
| petit conseil / on vous explique tout | « a quick tip », « we'll explain everything », « here's the thing » | éclairer sans paternalisme |
| !!! / exclamations en rafale | même excès en EN | point simple ; laisser le fait porter |
| émojis décoratifs (contenu institutionnel) | idem en EN | réserver aux formats C (LinkedIn) avec parcimonie |

---

## §3. VIGILANCE (tolérées sous condition + jargon hype EN à surveiller)

| Terme (EN-GB) | Condition / à éviter | Préférer |
|---|---|---|
| open space | OK comme terme technique neutre ; proscrit en slogan (« reimagined open space », §2) | décrire la réalité spatiale |
| optimise / optimisation | OK si chiffré/précisé ; vague et corporate sinon | préciser le gain |
| support (accompagnement) | OK adossé à un périmètre concret ; vide sinon | énoncer le périmètre réel |
| strategic | OK si l'enjeu est réellement démontré ; enflure sinon | démontrer l'enjeu |
| premium | OK pour qualifier le niveau d'encadrement ; ne pas sur-employer | — |
| Workcafé / Corporate Kitchen | **jargon hype à éviter** (Orientation B2B, couche 02) | « break-out space », « kitchen area » (sobre) |
| Boardroom / Huddle room / Brainstorming room | **jargon hype à éviter** | « meeting room », « small meeting room » (sobre) |

---

*table-02.en-GB.md — v0.1 (6 juillet 2026), hérité intégralement de la table-02.en-GB.md de GTTP v0.3 (contenu identique, marque non encore élaguée). À réviser dès que la blacklist BM (couche 02) divergera de celle de GTTP. Régénérer (ne pas éditer à la main) si la couche 02 évolue.*
