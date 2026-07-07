---
title: "Business Move — Glossaire transposé NL-BE (table-03)"
derive_de: "../couches/03-glossaire-metier-bm.md"
langue_cible: nl-BE
contrat_version: "v0.2"
statut: "v0.1 — À VALIDER par un relecteur natif nl-BE."
---

# Glossaire transposé — NL-BE (table-03)

Table dérivée de la couche 03 (glossaire FR) pour la traduction vers le néerlandais de Belgique. Chaque terme est classé en **3 cas** (contrat §2.2) :

- **déjà-NL** — terme déjà courant en néerlandais → conservé tel quel.
- **belge** — réalité réglementaire/locale belge → **gardée en néerlandais belge natif** (registre nl-BE, pas nl-NL — voir `langues/NL-BE.md` §5).
- **universel** — terme métier universel → **traduit**.

Colonnes : `id` (cible des pointeurs table-02) · Terme FR · Cas · Rendu NL-BE · Définition NL-BE (courte) · Note.

> **Statut v0.1 — traduction non encore validée par un relecteur natif nl-BE.** Les réalités belges natives (permis d'urbanisme, RGIE/AREI, CSS…) utilisent ici le terme belge néerlandophone, jamais l'équivalent des Pays-Bas.

---

## Catégorie 1 — Gestion de projet & maîtrise d'ouvrage

| id | Terme FR | Cas | Rendu NL-BE | Définition NL-BE | Note |
|---|---|---|---|---|---|
| gl-amo | Assistance à Maîtrise d'Ouvrage (AMO) | universel | bijstand aan de bouwheer (opdrachtgeversbegeleiding) | Begeleiding van de opdrachtgever bij een project — kadering, coördinatie van leveranciers, toezicht — zonder de werken zelf uit te voeren. | geen afkorting « AMO » in het Nederlands [v0.1] |
| gl-moa | Maîtrise d'Ouvrage (MOA) | universel | de bouwheer (opdrachtgever) | De partij die het project bestelt en financiert, in wiens naam het wordt uitgevoerd; bepaalt de doelstellingen, voert de werken niet zelf uit. | de dienstverlener is niet de bouwheer |
| gl-moe | Maîtrise d'Œuvre (MOE) | universel | ontwerper & werftoezichter | De partij die de oplossing ontwerpt en de bouwwerken aanstuurt volgens het programma van de opdrachtgever (architect / studiebureau). | de dienstverlener is niet de MOE van het gebouw |
| gl-cctp | Cahier des charges (CCTP) | universel | bestek | Een document met de behoeften, randvoorwaarden en technische vereisten van een project, gebruikt om leveranciers te raadplegen en te selecteren. | in BE gebruikt men ook « cahier des charges » |
| gl-tender | Appel d'offres | universel | aanbesteding | Een proces waarbij meerdere leveranciers met elkaar concurreren op basis van een bestek, om het beste bod te vergelijken en te kiezen. | — |
| gl-auteur-projet | Auteur de projet | belge | ontwerpauteur (BE *auteur de projet*) | Belgische term voor de ontwerper die verantwoordelijk is voor een interieurproject — bedenkt, documenteert en bewaakt de samenhang ervan. | rol geërfd van GTTP, te bevestigen voor BM [v0.1] |
| gl-boq | Métré récapitulatif | universel | samenvattende opmeting (meetstaat) | Een geprijsde, gedetailleerde lijst van werken (hoeveelheden, eenheidsprijzen), gebruikt als basis voor aanbesteding en offertevergelijking. | — |

---

## Catégorie 2 — Architecture d'intérieur & aménagement

| id | Terme FR | Cas | Rendu NL-BE | Définition NL-BE | Note |
|---|---|---|---|---|---|
| gl-brief | Programme (architectural) | universel | het programma van eisen | Een document dat de behoeften van de opdrachtgever weergeeft in oppervlaktes, functies en gebruik, vóór elk ontwerp. | **valse vriend**: FR « programme » ≠ planning |
| gl-esq | Esquisse (ESQ) | belge | schetsontwerp (BE/FR-fase « ESQ ») | Eerste grafische vertaling van het programma: ontwerpintenties en grote ruimtelijke indeling, zonder technisch detail. | Franstalige fasen ≈ fasen zoals in de architectuurpraktijk; afkorting behouden + toelichten |
| gl-aps | Avant-Projet Sommaire (APS) | belge | voorontwerp (« APS ») | Ontwerpfase die de schets verfijnt: algemene indeling, eerste afmetingen, technische principes; nog aanpasbaar. | — |
| gl-apd | Avant-Projet Détaillé (APD) | belge | uitgewerkt voorontwerp (« APD ») | Fase die het ontwerp vastlegt: gedetailleerde plannen, materialen, definitieve afmetingen, nauwkeurige kostenraming. | — |
| gl-pro | Études de Projet (PRO) | belge | uitvoeringsontwerp (« PRO ») | Laatste ontwerpfase vóór de werken: volledige technische dossiers om aannemers te raadplegen en de afwerking uit te voeren. | — |
| gl-net-area | Surface utile | universel | netto bruikbare vloeroppervlakte | De werkelijk bruikbare oppervlakte van een kantoorverdieping, exclusief circulatie, technische ruimtes en structuur. | — |
| gl-floorplate | Plateau de bureaux | universel | kantoorverdieping | Een verdieping of grote werkruimte in een bedrijfsgebouw, ingericht volgens de behoeften van de organisatie. | — |
| gl-flex-office | Flex office | déjà-NL | flexplekken (flex office) | Werkopstelling zonder vaste bureaus per persoon; men kiest een plek volgens de behoefte van de dag. | in NL-BE meestal « flexplekken » [v0.1] |
| gl-test-fit | Test fit | déjà-NL | test fit | Een snelle, plan-gebaseerde controle of een kandidaat-ruimte de reële behoeften van de organisatie kan huisvesten. | behouden |
| gl-space-planning | Space planning | déjà-NL | space planning (ruimte-indeling) | Optimalisatie van de beschikbare ruimte op basis van circulatie, personeelsaantal en gebruik. | behouden, met omschrijving |
| gl-fit-out | Fit-out (parachèvement intérieur) | déjà-NL | afwerking (fit-out) | Alle interieurafwerkings- en inrichtingswerken van een kantoorruimte (wanden, vloeren, plafonds, afwerkingen), na oplevering van de ruwbouw. | **doelwit van de verwijzing in table-02 « second œuvre »** |
| gl-ffe | Mobilier & équipements (FF&E) | déjà-NL | FF&E (meubilair & uitrusting) | Meubilair, verlichtingsarmaturen en uitrusting die niet vast aan het gebouw zijn bevestigd. | behouden |
| gl-abw | Activity-Based Working (ABW) | déjà-NL | activity-based working (ABW) | Een inrichting op basis van activiteit: medewerkers kiezen de ruimte die past bij hun taak in plaats van een vast bureau. | behouden |
| gl-biophilic | Design biophilique | universel | biofiel design | Het integreren van natuurlijke elementen (licht, planten, materialen) in een inrichting om het comfortabel gebruik van de ruimtes te ondersteunen. | het concrete effect beschrijven, niet « welzijn » |
| gl-acoustic | Confort acoustique | universel | akoestisch comfort | Beheersing van geluid op een verdieping via panelen, schermen, wanden of cabines: beheer van galm en geluidsisolatie. | bv. phone booth, akoestische tegels |

---

## Catégorie 3 — Conduite du changement humain

| id | Terme FR | Cas | Rendu NL-BE | Définition NL-BE | Note |
|---|---|---|---|---|---|
| gl-change-mgmt | Conduite du changement | universel | verandermanagement | De acties die de door een project geraakte mensen begeleiden (informatie, overleg, opleiding) zodat een transformatie — hier een verhuizing — aanvaard wordt en slaagt. | menselijk onderscheidend kenmerk, geërfd (te bevestigen voor BM) |
| gl-kubler-ross | Courbe de Kübler-Ross | universel | de Kübler-Ross-veranderingscurve | Een model van de emotionele fasen bij een opgelegde verandering (ontkenning, weerstand, aanvaarding…), toegepast op de begeleiding van teams. | eigennaam |
| gl-sponsorship | Sponsoring (du changement) | universel | (executief) sponsorschap van de verandering | Actieve, zichtbare steun van het management voor een veranderproject; zonder duidelijk betrokken sponsor verliest verandermanagement legitimiteit. | — |
| gl-change-agents | Agents du changement | universel | change agents (veranderingsagenten) | Mensen binnen de organisatie die de verandering dragen en verspreiden onder collega's, verder dan het management alleen. | — |

---

## Catégorie 4 — Réglementaire & technique

| id | Terme FR | Cas | Rendu NL-BE | Définition NL-BE | Note |
|---|---|---|---|---|---|
| gl-prm | Personnes à Mobilité Réduite (PMR) | belge | personen met beperkte mobiliteit (toegankelijkheid) | Toegankelijkheidsvereisten voor ruimtes gebruikt door personen met beperkte mobiliteit (circulatie, sanitair, toegang), wettelijk bepaald. | te bevestigen (praktijkervaring) |
| gl-erp | Établissement Recevant du Public (ERP) | belge | publiek toegankelijke inrichting (regelgevende categorie) | Regelgevende categorie van gebouwen die publiek ontvangen, onderworpen aan specifieke regels (brandveiligheid, evacuatie, toegankelijkheid). | Franse oorsprong — relevantie voor BE te bevestigen |
| gl-decommissioning | Décommissionnement (des anciens locaux) | universel | leegmaken en herstellen van de oude ruimte (decommissioning) | Herstel en teruggave van de vroegere ruimte na de verhuizing: demontage, herstel in oorspronkelijke staat, plaatsbeschrijving bij vertrek, conform het huurcontract. | — |
| gl-permis-urbanisme | Permis d'urbanisme | belge | stedenbouwkundige vergunning | Belgische administratieve vergunning vereist om het gebruik, de gevels of de structuur van een gebouw te wijzigen. | **doelwit van de verwijzing in table-02** ; geen nl-NL-equivalent gebruiken |
| gl-casco | Casco (shell & core) | belge | casco (ruwbouw met gesloten schil) | Een gebouw geleverd als ruwe structuur met gesloten schil, zonder interieurafwerking of technieken. | **doelwit van de verwijzing in table-02** |
| gl-code-bienetre | Code du Bien-être au travail | belge | Codex over het welzijn op het werk | Belgische wetgeving (FOD Werkgelegenheid) die normen voor de werkplek vastlegt: luchtvolume, natuurlijk licht, m² per werknemer, veiligheid. | **doelwit van de verwijzing in table-02** ; niet gelijk aan het slogan « welzijn » |
| gl-css | Coordinateur Sécurité-Santé (CSS) | belge | Veiligheidscoördinator (BE wettelijk, *CSS*) | Dienstverlener wettelijk verplicht op een Belgische werf zodra twee firma's er werken; coördineert veiligheid en gezondheid. | **doelwit van de verwijzing in table-02** |
| gl-rgie | RGIE | belge | AREI (Algemeen Reglement op de Elektrische Installaties) | Belgische conformiteitsnorm voor elektrische installaties, gecontroleerd vóór ingebruikname van de ruimte. | **doelwit van de verwijzing in table-02** ; AREI = Nederlandstalige naam van RGIE, niet enkel de Franse afkorting gebruiken |
| gl-nbn | Normes NBN | belge | NBN-normen (Belgisch) | Normen van het Belgische normalisatie-instituut (bv. NBN EN 12464-1 voor verlichting op de werkplek). | **doelwit van de verwijzing in table-02** ; geen AFNOR/NF |
| gl-currents | Courants forts / courants faibles | universel | sterkstroom versus zwakstroom (datanetwerken) | Het onderscheid tussen stroomnetwerken (stopcontacten, verlichting) en datanetwerken (data, RJ45, glasvezel). | vroeg anticiperen tijdens de space planning |
| gl-cobat | CoBAT / CoDT / VCRO | belge | gewestelijke stedenbouwkundige codices (Brussel *CoBAT*, Wallonië *CoDT*, Vlaanderen *VCRO*) | De gewestelijke codices die stedenbouw en vergunningen in België regelen. | inzetten volgens het gewest |

---

## Catégorie 5 — Phases & livrables du déménagement

| id | Terme FR | Cas | Rendu NL-BE | Définition NL-BE | Note |
|---|---|---|---|---|---|
| gl-det | Direction de l'Exécution des Travaux (DET) | universel | werftoezicht (« DET ») | Opdracht om de bouwwerken op te volgen en aan te sturen: controle van conformiteit, termijnen en kosten tot de voltooiing. | de dienstverlener staat niet in voor de DET van het gebouw |
| gl-handover | Réception de chantier | universel | oplevering | De handeling waarbij de opdrachtgever (bijgestaan door de dienstverlener) de voltooide werken aanvaardt, met eventuele opmerkingen (gebreken) op te lossen. | BE-term: « oplevering », niet « receptie » (zie `langues/NL-BE.md` §6) |
| gl-acceptance | Réception provisoire / définitive | belge | voorlopige / definitieve oplevering (BE) | In België: de voorlopige oplevering beëindigt de werken, draagt het risico over en start de bewoning (met een lijst van gebreken); de definitieve oplevering volgt zodra de gebreken zijn opgelost. | Belgische precisering van de oplevering |
| gl-asbuilt | Dossier As-Built (DIU) | belge | as-builtdossier (BE: *PID/DIU*) | Definitieve plannen en documenten overhandigd aan de opdrachtgever, die exact weergeven wat gebouwd werd. BE: *DIU* (Frans) / *PID* (Post-Interventiedossier, Nederlandstalige benaming) = nazorgdossier. | Nederlandstalige benaming « PID » te bevestigen naast « DIU » [v0.1] |
| gl-aftercare | After care | déjà-NL | nazorg (after care) | Ondersteuning na de intrek: laatste gebreken oplossen, gebruiksaanpassingen, teams helpen de nieuwe ruimtes zich eigen te maken. | behouden, met Nederlandstalige verduidelijking |
| gl-moving-day | Jour J (du déménagement) | universel | de verhuisdag (D-day) | De dag van de fysieke overgang naar de nieuwe ruimte; het moment van hoogste spanning in het project. | — |

---

*table-03.nl-BE.md — brouillon v0.1 (6 juillet 2026), projeté depuis la table-03.en-GB.md et la couche 03 de GTTP/BM, conforme au contrat v0.2 §2.2. Réalités belges rendues en néerlandais belge natif (pas nl-NL), conformément à `Stack-editorial-translate/langues/NL-BE.md` §5. **Traduction non validée — à faire relire par un locuteur natif nl-BE**, en particulier les rendus marqués [v0.1]. Régénérer (ne pas éditer à la main) si la couche 03 évolue.*
