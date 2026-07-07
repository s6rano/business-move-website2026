# Règles de langue — NL-BE (néerlandais de Belgique)

Fichier **universel** du moteur : ce qui est propre au néerlandais de Belgique et **indépendant de la marque**. Appliqué par le QA du moteur **en plus** des tables de chaque marque. (Voir `CONTRAT.md` §5.) Calqué sur `langues/EN-GB.md`.

> Statut : **v0.2 (6 juillet 2026)** — socle v0.1 **enrichi par la 1ʳᵉ critique externe réelle** (relecture nl-BE B2B de l'article pilote GUI002) : nouveaux faux-amis §6 (*ernstig, vork, verdieping, situeren, vertrekken van*), calques auto §7 (*valt uiteen in, botst op dezelfde muur, om u te situeren, het volume dat verhuist, ernstige offerte*), règle d'**animacy** et « libérer les équipes » en §8. Toujours à **valider par un relecteur nl-BE natif**. Exigence de fond : **relecture anti-littéral** — voir §7 et §8.

## 1. Marqueurs de LLM à proscrire

Tics d'écriture générée propres au néerlandais, sans origine française — absents des blacklists de marque. Valables pour **toutes** les marques traduisant vers le NL-BE. Le QA cherche ces marqueurs dans le texte traduit → **violation dure**. Les formes fléchies (ex. *naadloos* / *naadloze*) sont listées séparément car le QA cherche la forme de base. Liste à enrichir au fil des productions.

| Marqueur | Pourquoi | Préférer |
|---|---|---|
| in de snelle wereld van vandaag | ouverture LLM | entrer par un fait |
| in de wereld van vandaag | ouverture LLM | entrer par un fait |
| meer dan ooit | ouverture LLM | entrer par un fait |
| in het tijdperk van | ouverture LLM | un fait daté et situé |
| naadloos | hype LLM | décrire concrètement |
| naadloze | hype LLM | décrire concrètement |
| in het hart van | tic LLM | « centraal in », concret |
| een getuigenis van | tic LLM (a testament to) | montrer la preuve |
| de complexiteit navigeren | tic LLM | « beheren », « aanpakken » |
| navigeren door de complexiteit | tic LLM | « beheren », « aanpakken » |
| duik diep | tic LLM (dive deep) | « onderzoeken », « van naderbij bekijken » |
| het potentieel ontsluiten | tic LLM (unlock the potential) | le résultat concret attendu |
| baanbrekend | hype LLM (cutting-edge) | préciser la technique réelle |
| tot slot | charnière scolaire (in conclusion) | conclure sans l'annoncer |
| holistisch | tic fourre-tout | préciser le périmètre réel |
| in het landschap van | « landscape » figuré | concret |
| het is niet alleen | structure « it's not just X — it's Y » | énoncer directement |
| een cruciale rol spelen | tic (play a vital role) | dire lequel |
| de weg effenen voor | tic (pave the way) | « maakt … mogelijk » |
| de weg vrijmaken voor | tic (pave the way) | « maakt … mogelijk » |
| game changer | hype LLM | décrire l'effet réel |
| een revolutie teweegbrengen | hype (revolutionise) | l'effet concret |
| het beste van beide werelden | cliché LLM | supprimer |
| toekomstbestendig | hype (future-proof) | préciser ce qui dure et pourquoi |
| wanneer het aankomt op | signposting (when it comes to) | entrer dans le vif |

## 1bis. Mots WATCH — à surveiller (accumulation)

Mots **acceptables isolément** mais typiques des textes gonflés / générés quand ils s'**accumulent** ou se **répètent**. Le QA ne les bloque **jamais** : il compte et signale la répétition (seuil : 3×) ou l'accumulation. Les **garder** quand ils portent un sens exact.

| Mot | Pourquoi surveiller |
|---|---|
| cruciaal | intensité vague |
| essentieel | intensité vague |
| belangrijk | qualificatif passe-partout |
| aanzienlijk | quantité floue |
| effectief | affirmé mais non prouvé |
| strategisch | corporate générique |
| uitgebreid | promesse d'exhaustivité |
| dynamisch | corporate décoratif |
| robuust | adjectif passe-partout |
| impactvol | hype |
| waardevol | emphase gratuite |
| benutten | verbe corporate (leverage) — préférer « gebruiken » |
| faciliteren | verbe corporate |
| empoweren | anglicisme corporate |
| navigeren | figuré passe-partout |
| ontsluiten | figuré passe-partout |
| reis | métaphore usée (journey) |
| landschap | métaphore usée |
| toonaangevend | hype |
| innovatief | hype non prouvée |
| toegevoegde waarde | cliché corporate |

## 2. Registre NL-BE

- **Vouvoiement « u » / « uw »** en B2B — jamais « je / jij ». Constant dans tout le texte.
- **Néerlandais de Belgique** (nl-BE), pas nl-NL : registre plus posé et formel ; éviter les tournures familières typiques des Pays-Bas.
- **Sobriété** : pas de « business hype », pas d'ellipses publicitaires, ≤ 1 exclamation (idéalement 0 en piliers I/T).
- **Orthographe** : règles officielles de la Taalunie (« Groene Boekje »). Réalités belges natives (voir §5).

## 3. Formes nl-NL → nl-BE (à préférer)

Équivalent, pour le néerlandais, du « US → GB » de l'anglais. **Non auto-vérifiée pour l'instant** (décision du 6/7/2026 : relecture humaine ; le QA ne lit pas cette section tant qu'elle n'est pas généralisée). **À enrichir par un relecteur natif nl-BE.**

| nl-NL (à éviter en BE) | nl-BE (préférer) | Note |
|---|---|---|
| je / jij (par défaut en B2B) | u / uw | registre belge formel |
| gaaf, tof, super (registre familier) | — (éviter en B2B) | ton pro |
| verhuizing (registre) | verhuizing | *« verhuis »* (nom) est oral/belge → **écrire « verhuizing »** |
| appartement / flat | appartement | — |

## 4. Règles structurelles (identiques au FR/EN)

- Une phrase = une ligne continue dans les `.md`.
- Pas d'ellipses publicitaires (phrases nominales hachées).
- ≤ 1 exclamation par contenu (idéalement 0 en piliers I/T).
- Toute affirmation factuelle non triviale est sourcée/attribuée.

## 5. Réalités belges : garder les termes belges natifs

Contrairement à l'EN-GB (où l'on **glose** pour des internationaux), le lecteur nl-BE **est** belge néerlandophone : on **emploie directement** les termes institutionnels belges en néerlandais, et on **n'importe pas** les équivalents des Pays-Bas.

- Institutions/droit : *ondernemingsraad*, *CPBW (Comité voor Preventie en Bescherming op het Werk)*, *vakbond*, *arbeidsreglement*, *opzegtermijn*, *handelshuur* (bail commercial), *stedenbouwkundige vergunning* (permis d'urbanisme).
- Géographie/admin : *postcode*, *gemeente*, *Vlaanderen / Brussel / Wallonië*.
- Métier (déménagement/bureaux) : *werf* (chantier, BE), *oplevering* (réception de chantier), *uitbating* (exploitation, BE), *syndicus* (gestionnaire d'immeuble, BE).

## 6. Faux-amis FR → NL (vigilance traduction)

Le français de Belgique glisse vers des calques néerlandais. Le QA ne les bloque pas (trop contextuels) ; le protocole demande de les vérifier. **À enrichir.**

| FR | Faux-ami à éviter | Rendu correct |
|---|---|---|
| actuellement | « actueel » (= d'actualité) | « momenteel », « op dit moment » |
| éventuellement | « eventueel » seul (nuance) | « eventueel », « indien nodig », « mogelijk » |
| contrôler (vérifier) | « controleren » systématique | « nakijken », « verifiëren » |
| chantier | « chantier » | « werf » (BE), « bouwplaats » |
| réception (de chantier) | « receptie » | « oplevering » |
| délai | « vertraging » (= retard) | « termijn », « deadline » |
| formation | « formatie » | « opleiding », « training » |
| société (entreprise) | « maatschappij » | « bedrijf », « onderneming », « firma » |
| réaliser (faire) | « realiseren » systématique | « uitvoeren », « verwezenlijken » |
| sensible (données) | « sensibel » | « gevoelig » |
| exploitation | « exploitatie » | « werking », « uitbating » (BE), « gebruik » |
| acteur | « acteur » (= comédien) | « speler », « betrokkene », « partij » |
| important (montant) | « belangrijk » | « aanzienlijk », « groot » |
| local (pièce) | « lokaal » seul | « ruimte », « lokaal » (selon contexte) |
| sérieux (offre, entreprise) | « ernstig » (= grave, maladie/accident) | « betrouwbaar », « professioneel » |
| fourchette (de prix) | « vork » seul (= couvert) | « prijsvork », « prijsmarge », « bandbreedte » |
| plateau (de bureaux) | « verdieping » (= étage) | « kantoorvloer », « kantoorplateau » |
| situer (des chiffres repères) | « situeren » (= localiser un lieu) | « ter oriëntatie », « houvast bieden » |
| partir de / se baser sur | « vertrekken van » (flandricisme oral) | « uitgaan van » |

## 7. Calques FR → NL contigus (vigilance QA — avertissement)

Formulations grammaticalement possibles mais qui **sonnent traduites du français**. Le QA en signale les formes **contiguës** en **avertissement** (jamais en violation dure) : à reformuler à la relecture selon le sens, **pas** par remplacement mécanique. **À enrichir sur les premières traductions réelles.**

| Calque / tournure | Pourquoi | Rendu naturel |
|---|---|---|
| toelaten om te | « permettre de » | « maakt het mogelijk om », « zo kunt u » |
| dit laat toe te | « cela permet de » | « hiermee kunt u », « zo kunt u » |
| in functie van | « en fonction de » | « afhankelijk van », « naargelang » |
| zich de vraag stellen | « se poser la question » | « de vraag rijst », « de vraag is » |
| een oplossing brengen | « apporter une solution » | « een oplossing bieden » |
| op punt stellen | « mettre au point » (belgicisme) | « afwerken », « finaliseren » |
| ter hoogte van (figuré) | « au niveau de » | « op het vlak van », « wat … betreft » |
| het is belangrijk op te merken dat | signposting / remplissage | énoncer directement |
| het is de moeite waard te vermelden dat | signposting / remplissage | énoncer directement |
| wanneer het gaat over | « quand il s'agit de » | « voor », « bij », entrer dans le vif |
| uiteen in | « se décompose en » (*uiteenvallen* = s'effondrer) ; noyau contigu de *valt … uiteen in* | « is als volgt opgebouwd », « bestaat uit » |
| op dezelfde muur | « au même mur » (calque *se heurter au mur*) ; noyau contigu de *botst … op dezelfde muur* | « loopt tegen dezelfde muur aan », « stoot op dezelfde hindernissen » |
| om u te situeren | « pour vous situer » (chiffres repères) | « ter oriëntatie », « om u op te baseren » |
| ernstige offerte | « offre sérieuse » (*ernstig* = grave) | « betrouwbare / professionele offerte » |
| het volume dat verhuist | objet inanimé, sujet actif de *verhuizen* | « het te verhuizen volume » |

## 8. Anti-littéral & préférences stylistiques NL-BE (passe humaine — non scriptée)

**Cœur de la relecture exigeante** demandée : le NL n'est pas du FR réécrit mot à mot.

- **Reconstruire la phrase selon la syntaxe néerlandaise** (ordre V2, rejet du verbe en fin de subordonnée) — **pas** selon l'ordre des mots français.
- **Verbes concrets > nominalisations** : préférer un verbe à « de implementatie van », « het in kaart brengen van » quand un verbe suffit.
- **Animacy (objets inanimés) : ne pas les rendre sujets actifs.** Un objet inanimé (*volume, meubilair, archief, materiaal*) ne « fait » pas l'action. FR « le volume à déplacer » → **pas** *het volume dat verhuist* (comme si les meubles marchaient seuls) mais **« het te verhuizen volume »** (adjectif verbal *te + infinitif*) ou une tournure passive. Vaut pour tout *N + dat/die + verbe d'action*.
- **« libérer / soulager les équipes »** → *ontlasten* (ou *tijd vrijmaken voor…*), **pas** le calque *(teams) vrij maken*.
- **« se décomposer / se répartir en »** → *is opgebouwd uit*, *is als volgt opgebouwd*, **pas** *uiteenvallen* (connote l'effondrement).
- **Registre « u » (rappel Rule QA humaine)** : le QA ne détecte pas encore *je/jij/jouw/jullie* automatiquement (risque de faux positifs sur *je* réduit). La relecture vérifie **manuellement** qu'aucune forme informelle nl-NL ne s'est glissée dans le corps (fréquent avec les traducteurs calibrés Pays-Bas).
- **Connecteurs sobres** : retirer *immers, bovendien, derhalve, aldus, in dit kader* quand le lien est déjà évident.
- **Éviter les longues subordonnées d'ouverture** : le rejet du verbe rend les phrases longues illisibles → couper.
- **« u » cohérent** partout ; pas de bascule u/je.
- **Mots-clés SEO en néerlandais réel** (recherche native), pas la traduction littérale du mot-clé FR.
- **Titres, slugs, méta** repensés pour le NL, pas traduits mot à mot.

---

## Note d'usage pour le QA

Le script `qa/qa_translate.py --lang nl-BE` lit automatiquement dans ce fichier :
- **col. 1 du tableau §1** → marqueurs de LLM → **violation dure** ;
- **col. 1 du tableau §1bis** → mots WATCH → **comptés** (répétition ≥ 3× ou accumulation), jamais bloquants ;
- **col. 1 du tableau §7** → calques contigus → **avertissement**.

Les sections **§2, §3, §5, §6, §8** sont des **règles de jugement humain** (relecture guidée), pas des contrôles automatiques. La §3 n'est pas encore auto-vérifiée (décision du 6/7/2026).

> Limite connue (v0.1) : `construire_motif` du QA applique une **flexion anglaise** (`s|es|d|ed|ing`). Pour le NL, on s'appuie sur la **forme de base** et on liste explicitement les variantes fléchies utiles (ex. *naadloos* / *naadloze*). Généralisation de la flexion par langue : voir ROADMAP (décision ouverte).

---

*langues/NL-BE.md — v0.2 (6 juillet 2026). Universel (toutes marques traduisant vers le NL-BE). Enrichi par la 1ʳᵉ critique externe réelle (GUI002). À valider par un relecteur natif nl-BE. Source unique : ne pas dupliquer ces règles dans une table de marque.*
