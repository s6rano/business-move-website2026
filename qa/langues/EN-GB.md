# Règles de langue — EN-GB (anglais britannique)

Fichier **universel** du moteur : ce qui est propre à l'anglais britannique et **indépendant de la marque**. Appliqué par le QA du moteur **en plus** des tables de chaque marque. (Voir `CONTRAT.md` §5.)

> Statut : v0.3 (2 juillet 2026). Enrichi par le référentiel de-Frenching : niveau **WATCH** (accumulation, non bloquant) ajouté (§1bis) ; §6 faux-amis étendu ; nouvelle §7 (calques & tournures non idiomatiques, lue par le QA en avertissement) ; nouvelle §8 (préférences stylistiques, passe humaine). `robust` rétrogradé de marqueur dur (§1) vers WATCH. v0.2 (10 juin 2026) : orthographe US→GB, réalités belges, faux-amis.

## 1. Marqueurs de LLM à proscrire (entrées « nouvelle »)

Tics d'écriture générée propres à l'anglais, sans origine française — donc absents des blacklists de marque. Valables pour **toutes** les marques traduisant vers l'EN-GB. Le script QA cherche ces marqueurs dans le texte traduit.

| Marqueur | Pourquoi | Préférer |
|---|---|---|
| delve | tic de LLM anglais par excellence | « look at », « examine » |
| in today's fast-paced world | ouverture LLM | entrer par un fait |
| tapestry | métaphore LLM | supprimer |
| navigate the complexities | tic LLM | « handle », « manage » |
| a testament to | tic LLM | montrer la preuve directement |
| underscore | tic LLM | « shows », « highlights » |
| underscores | tic LLM | « shows », « highlights » |
| seamless | hype LLM | décrire concrètement |
| seamlessly | hype LLM | décrire concrètement |
| ever-evolving | hype LLM | « changing », daté et situé |
| ever-changing | hype LLM | « changing », daté et situé |
| in the realm of | tic LLM | « in », « for » |
| it's not just | structure LLM « it's not just X — it's Y » | énoncer directement |
| the workplace landscape | « landscape » figuré, tic LLM | « workplaces », concret |
| dive deep | tic LLM | « examine », « look closely » |
| unlock the potential | tic LLM | le résultat concret attendu |
| game changer | hype LLM | décrire l'effet réel |
| cutting-edge | hype LLM | préciser la technique réelle |
| in conclusion | charnière scolaire LLM | conclure sans l'annoncer |
| holistic | tic LLM fourre-tout | préciser le périmètre réel |
| impactful | hype LLM | nommer l'effet concret |
| pave the way | tic LLM | « makes … possible », « leads to » |
| play a vital role | tic LLM | « is central to », dire lequel |
| at the heart of | tic LLM | « central to », concret |
| more than ever | ouverture LLM | entrer par un fait |
| in today's world | ouverture LLM | entrer par un fait |

## 1bis. Mots WATCH — à surveiller (accumulation)

Mots **acceptables isolément** mais typiques des textes gonflés / générés quand ils s'**accumulent** ou se **répètent**. Le QA ne les bloque **jamais** (pas de violation dure) : il compte leurs occurrences et signale la répétition (seuil : 3×) ou l'accumulation. Corriger à la relecture uniquement là où le mot n'apporte pas de précision — les **garder** quand ils portent un sens exact qu'on ne peut pas dire plus directement.

> `concrete` est ici (Conflit B) : viser le `concrete` creux (« a concrete CSR argument ») — **pas** la concrétude réelle, qui est une valeur GTTP (« du plan à l'usage »).

| Mot | Pourquoi surveiller |
|---|---|
| crucial | intensité vague |
| key | qualificatif passe-partout |
| significant | quantité floue |
| concrete | creux quand il ne montre rien de concret |
| genuine | emphase gratuite |
| real | emphase gratuite |
| effective | affirmé mais non prouvé |
| strategic | corporate générique |
| comprehensive | promesse d'exhaustivité |
| increasingly | tendance non située |
| ultimately | charnière de remplissage |
| meaningful | vague |
| tangible | souvent creux |
| dynamic | corporate décoratif |
| compelling | jugement non démontré |
| leverage | verbe corporate (préférer « use ») |
| foster | verbe corporate |
| empower | verbe corporate |
| drive | verbe corporate quand figuré |
| navigate | figuré passe-partout |
| unlock | figuré passe-partout |
| landscape | métaphore usée |
| journey | métaphore usée |
| robust | adjectif passe-partout (préciser) |

## 2. Registre EN-GB

- **Understated authority** : démontrer, ne pas proclamer (transpose l'« autorité tranquille » de marque).
- **Orthographe britannique** : -ise / -isation, -our (colour, behaviour), -re (centre), « organisation ».
- Éviter l'« American business hype » ; privilégier la sobriété.
- **Ponctuation** : guillemets britanniques droits (« " " »), espaces fines à la française proscrites, virgule d'Oxford optionnelle mais cohérente.

## 3. Orthographe américaine à corriger (US → GB)

Le script QA signale ces graphies américaines et propose la forme britannique. Liste non exhaustive, à enrichir au fil des productions.

| Américain (à éviter) | Britannique (préférer) |
|---|---|
| optimize | optimise |
| optimization | optimisation |
| organize | organise |
| organization | organisation |
| customize | customise |
| color | colour |
| behavior | behaviour |
| favorite | favourite |
| center | centre |
| meter | metre |
| program | programme |
| analyze | analyse |
| catalog | catalogue |
| license (verbe/nom) | licence (nom) / license (verbe) |
| fulfill | fulfil |
| traveled | travelled |

## 4. Règles structurelles (transposables, identiques au FR)

- Une phrase = une ligne continue dans les fichiers `.md`.
- Pas d'ellipses publicitaires (phrases nominales hachées).
- ≤ 1 exclamation par contenu (idéalement 0 en piliers I/T).
- Toute affirmation factuelle non triviale est sourcée/attribuée.

## 5. Réalités belges : gloser, ne jamais transposer

Règle **universelle** (le détail des rendus vit dans le `manifest.cible_traduction` + la table-03 de la marque, mais le principe est ici).

- Public cible v1 = **décideurs internationaux basés en Belgique** : on **garde** la réalité institutionnelle belge et on la **glose** en anglais, plutôt que de la remplacer par un équivalent britannique qui serait faux sur le terrain.
- Forme recommandée : `rendu anglais (BE: terme belge d'origine)` — ex. *planning permission (BE: permis d'urbanisme)*, *Health & Safety Coordinator (BE statutory, CSS)*.
- **À ne pas faire** : transposer vers un équivalent UK trompeur (« building permit », « CDM coordinator », « Labour Code »…). Ces faux-amis réglementaires sont listés, marque par marque, dans la table-03.

## 6. Faux-amis FR → EN fréquents (vigilance traduction)

Indépendants de la marque. Le QA ne les bloque pas automatiquement (trop dépendants du contexte) mais le protocole demande de les vérifier.

| FR | Faux-ami à éviter | Rendu correct |
|---|---|---|
| programme (architectural) | « programme » (= planning) | « brief » |
| actuellement | « actually » | « currently » |
| éventuellement | « eventually » | « possibly », « if needed » |
| sensible | « sensible » | « sensitive » |
| contrôler | « control » (au sens vérifier) | « check », « inspect » |
| chantier | « building site » seul | selon contexte : « project », « works », « site » |
| réception (de chantier) | « reception » | « handover », « practical completion » |
| acteur | « actor » | « player », « stakeholder », « participant » |
| formation | « formation » | « training » |
| exploitation | « exploitation » | « operation », « running », « use » |
| société | « society » | « company », « business », « firm » |
| délai | « delay » (= retard) | « deadline », « lead time », « timeframe » |
| accompagner | « accompany » | « support », « guide », « work with », « advise » |
| disposer de | « dispose of » (= jeter) | « have (available) » |
| intervenir | « intervene » | « take place », « happen », « occur », « step in » |
| réaliser | « realise » (au sens « faire ») | « carry out », « deliver » (ou « understand » au sens « comprendre ») |
| valoriser | « valorise » | « showcase », « make the most of », « add value to » |
| animation (d'une session) | « animation » | « running », « facilitation » |
| concret | « concrete » (adjectif creux) | « specific », « practical », « real » (voir §1bis WATCH) |
| pertinent | « pertinent » | « relevant » |
| structure (organisation) | « structure » | « organisation », « body », « provider » (ex. *refurbishment provider*) |
| logique (nom) | « logic » | « approach », « rationale », « principle » |
| problématique (nom) | « problematic » | « issue », « challenge », « question » |
| proposition (offre) | « proposition » | « offer », « proposal » |

## 7. Calques FR → EN et tournures non idiomatiques (vigilance QA)

Formulations grammaticalement possibles mais qui **sonnent traduites du français**. Le QA en signale les formes **contiguës** en **avertissement** (jamais en violation dure) : à reformuler à la relecture selon le sens visé, **pas** par remplacement mécanique. Source : cas réels relevés sur les premières traductions GTTP.

| Calque / tournure | Pourquoi | Rendu naturel |
|---|---|---|
| three logics | « logiques » traduit littéralement (`three logics not to confuse`) | « three distinct concepts / approaches » |
| keeps its relevance | « garde sa pertinence » | « remains relevant », « remains the better option » |
| the question that poses itself | « la question qui se pose » | « the question here is », « this raises the question » |
| this allows to | « cela permet de » (+ infinitif) | « this makes it possible to », « this lets you » |
| responds to the need | « répond au besoin » | « meets the need », « addresses the need » |
| crosses the question | « croise la question » | « this is where … and … intersect » |
| on a catalogue | préposition FR (`printed on a catalogue`) | « in a catalogue » |
| refurbishment structures | « structures » = organisations | « refurbishment specialists / providers » |
| a concrete … argument | « un argument concret » (creux) | dire l'argument précis ; voir §1bis (WATCH `concrete`) |
| it is important to note that | signposting / remplissage | énoncer directement |
| it should be remembered that | signposting / remplissage | énoncer directement |
| it is worth mentioning that | signposting / remplissage | énoncer directement |
| the key point is that | signposting / remplissage | énoncer directement |
| what this means is that | signposting / remplissage | énoncer directement |
| when it comes to | signposting / remplissage | « for », « in », entrer dans le vif |

> Calques à **middle variable** (ex. « weighs on a *fit-out project's* footprint », « tells *itself* an argument ») : non détectables automatiquement, laissés à la **passe de-Frenching** (protocole, Étape 5bis) et à `passe-de-frenching-EN-GB.md`.

## 8. Préférences stylistiques EN-GB B2B (passe humaine — non scriptées)

Préférences rédactionnelles, **pas** des interdictions. Elles guident la passe de-Frenching et la relecture ; le QA ne les vérifie pas.

- **Verbes concrets > nominalisations** : préférer un verbe à « the implementation of / the realisation of / the putting in place of / the taking into account of ».
- **Connecteurs sobres** : retirer *indeed, moreover, therefore, thus, consequently, in this context, as such, in effect* quand le lien est déjà évident ; les garder quand ils clarifient une vraie relation.
- **Contrastes binaires** : une construction « not X but Y » peut être efficace ; **répétée**, elle sonne générée → varier ou simplifier (le QA compte les `it's not just` en §1).
- **Aphorismes** : éviter la symétrie artificielle et les phrases-slogans ; préférer le précis au mémorable.
- **Ordre de l'information** : sujet et verbe tôt ; modifieurs près de ce qu'ils modifient ; ne pas retarder le sens par une longue subordonnée d'ouverture.
- **Ton** : sobre, précis, non promotionnel ; ni raideur académique, ni copy publicitaire, ni punchline réseau social.

---

## Note d'usage pour le QA

Le script `qa/qa_translate.py` lit automatiquement, dans ce fichier :
- la **colonne 1 du tableau §1** → marqueurs de LLM → **violation dure** ;
- la **colonne 1 du tableau §1bis** → mots WATCH → **comptés** (répétition ≥ 3× ou accumulation signalées, jamais bloquantes) ;
- la **colonne 1 du tableau §3** → graphies américaines → violation dure (avec la forme britannique de la colonne 2) ;
- la **colonne 1 du tableau §7** → calques contigus → **avertissement**.

Les sections §2, §5, §6 et §8 sont des **règles de jugement humain** (relecture guidée), pas des contrôles automatiques.

---

*langues/EN-GB.md — v0.3 (2 juillet 2026). Universel (toutes marques traduisant vers l'EN-GB). Enrichi par le référentiel de-Frenching : WATCH (§1bis), faux-amis étendus (§6), calques (§7), préférences stylistiques (§8). Source unique : ne pas dupliquer ces règles dans une table de marque.*
