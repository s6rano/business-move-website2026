---
title: "Business Move — Blacklist transposée NL-BE (table-02)"
derive_de: "../couches/02-blacklist.md"
langue_cible: nl-BE
contrat_version: "v0.2"
statut: "v0.1 — À VALIDER par un relecteur natif nl-BE."
---

# Blacklist transposée — NL-BE (table-02)

Table dérivée de la couche 02 (blacklist FR) pour la traduction vers le néerlandais de Belgique. **Le moteur lit cette table, pas la couche 02.** Trois sections fixes, toutes dérivées de la couche 02 :

- **§1 inversée** (`forme`) — proscrit en FR pour la forme ; neutre/prescrit/inexistant en NL. *(Précédence 02↔03 : si l'entrée a un référent glossaire, on met un pointeur `→ table-03`, pas le rendu.)*
- **§2 transposée** (`fond`) — mauvais aussi en NL.
- **§3 vigilance** — tolérées sous condition + jargon hype propre au NL à surveiller.

> **Hors de cette table** (voir contrat §5) : les marqueurs LLM néerlandais (« naadloos », « in het hart van »…) vivent dans `Stack-editorial-translate/langues/NL-BE.md` (universels) ; les règles structurelles aussi ; la glose PICAT vient du `manifest` ; les réalités belges nl gardent leur terme natif (voir table-03 + `langues/NL-BE.md` §5).

> **Statut v0.1 — traduction non encore validée par un relecteur natif nl-BE.** Toute la colonne « à éviter / préférer / rendu » ci-dessous est une proposition de travail à faire vérifier.

---

## §1. Transposition INVERSÉE (entrées `forme`)

| FR proscrit (couche 02) | Statut en NL-BE | Rendu / pointeur | Note |
|---|---|---|---|
| relocation | **prescrit** | « kantoorverhuizing », « bedrijfsverhuizing » | l'inverse du FR : terme normal/attendu en néerlandais |
| QVT / QVCT | **inexistant** | — | sigle franco-français ; ne pas calquer ; décrire le sens si besoin |
| boostez / dopez | **neutre** (verbe) | « een boost geven » (sobre) | néerlandais courant ; éviter l'emphase marketing |
| permis de construire | réalité belge | **→ table-03** (stedenbouwkundige vergunning) | rendu appartient à table-03 |
| Code du travail (français) | réalité belge | **→ table-03** (Codex over het welzijn op het werk) | idem |
| coordonnateur SPS / CSPS | réalité belge | **→ table-03** (Veiligheidscoördinator / CSS) | idem |
| norme NF / NF C 15-100 | réalité belge | **→ table-03** (AREI/RGIE) | idem |
| normes AFNOR | réalité belge | **→ table-03** (NBN-normen) | idem |
| brut de béton / clos couvert | réalité belge | **→ table-03** (Casco) | idem |
| second œuvre | réalité belge | **→ table-03** (afwerking / fit-out) | idem |
| déclaration préalable (DP) | réalité belge | « vrijstelling van vergunning / kleine werken » [v0.1, à valider] | **pas d'entrée glossaire** — à ajouter à la couche 03 si on industrialise |
| moquette en lés | technique | « tapijttegels » (préféré ; « tapijt op rol » = en lés) [v0.1] | **pas d'entrée glossaire** |
| placo / placoplâtre | technique | « gipskartonplaat » [v0.1] | **pas d'entrée glossaire** ; *Gyproc* = marque belge |

---

## §2. Transposition TRANSPOSÉE (entrées `fond` — à éviter aussi en NL-BE)

| FR proscrit (couche 02) | À éviter en NL-BE | Préférer en NL-BE |
|---|---|---|
| open space repensé | « heruitgevonden open space » | décrire le réel (« een verdieping ingedeeld per geluidsniveau ») |
| espaces de demain / bureaux du futur | « kantoren van de toekomst », « werkplekken van morgen » | le présent et les usages réels |
| lieu de vie | « een plek om te leven » | « de kantoren », « de werkplek » |
| expérience collaborateur | « employee experience » (en propre, comme slogan) | « de dagelijkse werking », « hoe mensen hier werken » |
| bien-être au travail | « welzijn op het werk » | le bénéfice concret (« minder lawaai », « kortere interne verplaatsingen ») |
| espace de travail nouvelle génération | « werkplek van de nieuwe generatie » | l'aménagement par ses usages |
| environnement de travail inspirant | « inspirerende werkomgeving » | montrer la scène, pas l'adjectif |
| solutions sur-mesure / clé en main | « oplossingen op maat / kant-en-klaar » | décrire ce qu'on prend en charge (l'iceberg) |
| accompagnement à 360° | « 360°-begeleiding » (creux) | énoncer le périmètre réel |
| expert / leader / référence | « zelfverklaarde expert », « zelfverklaarde marktleider » | montrer un projet, un chiffre, une méthode |
| partenaire de confiance | « vertrouwde partner » | prouver par un fait (délai tenu, projet livré) |
| au cœur de | « in het hart van » | un propos concret (voir aussi `langues/NL-BE.md` §1) |
| écosystème (de travail) | « (werk)ecosysteem » | « de teams en hoe ze werken » |
| synergies | « synergieën » | le gain concret recherché |
| ADN (de l'entreprise) | « bedrijfs-DNA » | « wat de organisatie uniek maakt » |
| dynamique / passionné(e) | « dynamisch / gepassioneerd » | supprimer ou prouver par un fait |
| incontournable | « onmisbaar » (gratuit) | supprimer |
| dans un monde où / à l'ère de | « in een wereld waar », « in het tijdperk van » | entrer par une scène ou un fait |
| il convient de noter que | « het is belangrijk op te merken dat » | énoncer directement (voir `langues/NL-BE.md` §7) |
| force est de constater | « men kan niet anders dan vaststellen dat » | énoncer directement |
| en effet / par ailleurs / en outre (excès) | excès de « immers / bovendien / daarnaast » | varier ou supprimer |
| plonger / explorer en profondeur | « diep induiken », « grondig verkennen » | « onderzoeken », « van naderbij bekijken » |
| transformer le paysage / redéfinir | « het landschap transformeren », « herdefiniëren » | décrire le changement réel et mesuré |
| libérer le potentiel | « het potentieel ontsluiten » | le résultat concret attendu |
| à l'heure du télétravail / hybride | « in het tijdperk van hybride werken » | entrer par le cas concret du client |
| n'hésitez pas à | « aarzel niet om » | une invitation précise (« contacteer ons voor een test fit ») |
| que vous soyez X ou Y | « of u nu X of Y bent » | s'adresser à la cible réelle (couche 04) |
| révolutionner / révolution | « revolutioneren », « revolutie » | « evolueren », « herdenken vanuit reëel gebruik » |
| game changer / disruptif | « game changer », « disruptief » | décrire l'effet réel |
| tout simplement / il suffit de | « gewoonweg », « het volstaat om » | reconnaître la complexité réelle |
| comme vous le savez / évidemment | « zoals u weet », « uiteraard » | exposer sans condescendance |
| petit conseil / on vous explique tout | « een kleine tip », « we leggen alles uit » | éclairer sans paternalisme |
| !!! / exclamations en rafale | même excès en NL | point simple ; laisser le fait porter |
| émojis décoratifs (contenu institutionnel) | idem en NL | réserver aux formats C (LinkedIn) avec parcimonie |

---

## §3. VIGILANCE (tolérées sous condition + jargon hype NL à surveiller)

| Terme (NL-BE) | Condition / à éviter | Préférer |
|---|---|---|
| open space | OK comme terme technique neutre ; proscrit en slogan (« heruitgevonden open space », §2) | décrire la réalité spatiale |
| optimaliseren / optimalisatie | OK si chiffré/précisé ; vague et corporate sinon | préciser le gain |
| ondersteuning (begeleiding) | OK adossé à un périmètre concret ; vide sinon | énoncer le périmètre réel |
| strategisch | OK si l'enjeu est réellement démontré ; enflure sinon | démontrer l'enjeu |
| premium | OK pour qualifier le niveau d'encadrement ; ne pas sur-employer | — |
| Workcafé / Corporate Kitchen | **jargon hype à éviter** (Orientation B2B, couche 02) | « pauzeruimte », « keukenhoek » (sobre) |
| Boardroom / Huddle room / Brainstorming room | **jargon hype à éviter** | « vergaderzaal », « kleine vergaderruimte » (sobre) |

---

*table-02.nl-BE.md — brouillon v0.1 (6 juillet 2026), projeté depuis la table-02.en-GB.md et la couche 02 de GTTP/BM (identiques), conforme au contrat v0.2. Suit les règles `Stack-editorial-translate/langues/NL-BE.md` (vouvoiement « u », registre belge posé, réalités belges natives). **Traduction non validée — à faire relire par un locuteur natif nl-BE**, en particulier les rendus marqués [v0.1, à valider]. Régénérer (ne pas éditer à la main) si la couche 02 évolue.*
