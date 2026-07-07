---
title: "Business Move — Glossaire transposé EN-GB (table-03)"
derive_de: "../couches/03-glossaire-metier-bm.md"
version_source: "v0.4 (hérité de GTTP)"
langue_cible: en-GB
contrat_version: "v0.2"
statut: "v0.1 — hérité de GTTP. À élaguer au vocabulaire réel de BM (annuaire de déménageurs)."
---

# Glossaire transposé — EN-GB (table-03)

Table dérivée de la couche 03 (glossaire FR) pour la traduction vers l'anglais britannique. Chaque terme est classé en **3 cas** (contrat §2.2) :

- **déjà-EN** — terme déjà anglais → conservé tel quel.
- **belge** — réalité réglementaire/locale belge → **gardée + glosée** en anglais (public = décideurs internationaux en Belgique, cf. `manifest.cible_traduction`).
- **universel** — terme métier universel → **traduit**.

Colonnes : `id` (cible des pointeurs table-02) · Terme FR · Cas · Rendu EN-GB · Définition EN-GB (courte) · Note.

---

## Catégorie 1 — Gestion de projet & maîtrise d'ouvrage

| id | Terme FR | Cas | Rendu EN-GB | Définition EN-GB | Note |
|---|---|---|---|---|---|
| gl-amo | Assistance à Maîtrise d'Ouvrage (AMO) | universel | client-side / owner's project management | Managing a project on the client's behalf — framing, coordinating suppliers, oversight — without carrying out the works. | pas de sigle « AMO » en anglais |
| gl-moa | Maîtrise d'Ouvrage (MOA) | universel | the client (building owner / principal) | The party commissioning and funding the project, on whose behalf it is run; sets the objectives, does not carry out the works. | le prestataire de pilotage n'est pas le MOA |
| gl-moe | Maîtrise d'Œuvre (MOE) | universel | lead designer & works supervisor | The party that designs the solution and directs the building works to meet the client's brief (architect / engineering practice). | le prestataire de pilotage n'est pas la MOE du bâtiment |
| gl-cctp | Cahier des charges (CCTP) | universel | (tender) specifications | A document setting out a project's needs, constraints and technical requirements, used to invite and select suppliers. | en BE on garde aussi « cahier des charges » |
| gl-tender | Appel d'offres | universel | tender (call for tenders) | A process putting several suppliers in competition on the basis of specifications, to compare and select the best bid. | — |
| gl-auteur-projet | Auteur de projet | belge | design author / lead designer (BE *auteur de projet*) | Belgian term for the designer responsible for an interior project — conceives, documents and safeguards its coherence. | rôle d'auteur de projet pour le space design (hérité, à confirmer pour BM) |
| gl-boq | Métré récapitulatif | universel | bill of quantities (priced schedule) | A priced, itemised schedule of works (quantities, unit prices) used as the basis for tendering and bid comparison. | — |

---

## Catégorie 2 — Architecture d'intérieur & aménagement

| id | Terme FR | Cas | Rendu EN-GB | Définition EN-GB | Note |
|---|---|---|---|---|---|
| gl-brief | Programme (architectural) | universel | the (design) brief | A document expressing the client's needs in areas, functions and uses, before any design — what the organisation needs, not yet what it will look like. | **faux ami** : FR « programme » = EN « brief » (PAS « programme » = planning) |
| gl-esq | Esquisse (ESQ) | belge | concept sketch (FR/BE phase « ESQ ») | First graphic translation of the brief: design intentions and broad spatial organisation, no technical detail. | phases francophones ≈ RIBA stages ; garder le sigle + gloser |
| gl-aps | Avant-Projet Sommaire (APS) | belge | outline / concept design (« APS ») | Design stage refining the sketch: overall layout, first dimensions, technical principles; still adjustable. | — |
| gl-apd | Avant-Projet Détaillé (APD) | belge | developed / detailed design (« APD ») | Stage that freezes the design: detailed drawings, materials, final dimensions, precise cost estimate. | — |
| gl-pro | Études de Projet (PRO) | belge | technical / production design (« PRO ») | Final design stage before works: complete technical documents to consult contractors and execute the fit-out. | — |
| gl-net-area | Surface utile | universel | net usable (floor) area | The genuinely usable area of an office floor, excluding circulation, plant rooms and structure; key to sizing a future space. | — |
| gl-floorplate | Plateau de bureaux | universel | office floor / floorplate | A floor or large workspace in a commercial building, fitted out to the organisation's needs (partitioning, zones, workstations). | — |
| gl-flex-office | Flex office | déjà-EN | flex office | Work setup where desks aren't individually assigned; people sit according to the day's needs, reducing desk count for a given headcount. | terme déjà anglais, conservé |
| gl-test-fit | Test fit | déjà-EN | test fit | A quick, plan-based check that a candidate space can house the organisation's real needs before committing. | conservé |
| gl-space-planning | Space planning | déjà-EN | space planning | Optimising available space around flows, headcount and uses, from macro-zoning (large zones) to micro-zoning (desks, rooms). | conservé |
| gl-fit-out | Fit-out (parachèvement intérieur) | déjà-EN | fit-out | All interior finishing and fit-out works of an office space (partitions, floors, ceilings, finishes), after the envelope is delivered. | **cible du pointeur table-02 « second œuvre »** |
| gl-ffe | Mobilier & équipements (FF&E) | déjà-EN | FF&E | Furniture, Fixtures & Equipment: all loose furniture, light fittings and equipment not fixed to the building. | conservé |
| gl-abw | Activity-Based Working (ABW) | déjà-EN | activity-based working (ABW) | A fit-out based on activity: people pick the space suited to their task (focus, meeting, exchange) rather than a fixed desk. | conservé |
| gl-biophilic | Design biophilique | universel | biophilic design | Bringing natural elements (light, planting, materials) into a fit-out to support comfortable use of the spaces. | décrire l'effet concret, pas « wellbeing » |
| gl-acoustic | Confort acoustique | universel | acoustic comfort | Controlling noise on a floor via panels, baffles, partitions or booths: managing reverberation and sound insulation. | ex. phone booth, acoustic tiles |

---

## Catégorie 3 — Conduite du changement humain

| id | Terme FR | Cas | Rendu EN-GB | Définition EN-GB | Note |
|---|---|---|---|---|---|
| gl-change-mgmt | Conduite du changement | universel | change management | The actions that support the people affected by a project (information, consultation, training) so a transformation — here a move — is accepted and succeeds. | différenciateur humain hérité (à confirmer pour BM) |
| gl-kubler-ross | Courbe de Kübler-Ross | universel | the Kübler-Ross (change) curve | A model of the emotional stages faced in an imposed change (denial, resistance, acceptance…), applied to supporting teams through change. | nom propre |
| gl-sponsorship | Sponsoring (du changement) | universel | (executive) change sponsorship | Active, visible leadership backing for a change project; without a clearly committed sponsor, change management loses legitimacy with teams. | EN « sponsorship », pas « sponsoring » |
| gl-change-agents | Agents du changement | universel | change agents (change champions) | People inside the organisation who carry and spread the change among colleagues, beyond leadership alone. | — |

---

## Catégorie 4 — Réglementaire & technique

| id | Terme FR | Cas | Rendu EN-GB | Définition EN-GB | Note |
|---|---|---|---|---|---|
| gl-prm | Personnes à Mobilité Réduite (PMR) | belge | people with reduced mobility (accessibility) | Accessibility requirements for spaces used by people with reduced mobility (circulation, sanitary facilities, access), set by regulation. | à confirmer (passe praticien) |
| gl-erp | Établissement Recevant du Public (ERP) | belge | public-access building (regulatory category) | Regulatory category of buildings receiving the public, subject to specific rules (fire safety, evacuation, accessibility) by type and capacity. | catégorie d'origine française — pertinence BE à confirmer |
| gl-decommissioning | Décommissionnement (des anciens locaux) | universel | decommissioning (make-good / dilapidations) | Reinstating and handing back former premises after the move: dismantling, bringing back to standard, exit condition survey, per the lease. | « make good » / « dilapidations » = termes UK |
| gl-permis-urbanisme | Permis d'urbanisme | belge | planning permission (BE: *permis d'urbanisme*) | Belgian administrative authorisation required to change a building's use, façades or structure. | **cible pointeur table-02** ; pas « permis de construire » |
| gl-casco | Casco (shell & core) | belge | shell & core (BE/NL: *Casco*) | A building delivered as bare structure with a closed envelope, without interior fit-out or services. | **cible pointeur table-02** |
| gl-code-bienetre | Code du Bien-être au travail | belge | the Belgian Code on Well-being at Work | Belgian legislation (FPS Employment) setting workplace standards: air volume, natural light, m² per worker, safety. | **cible pointeur table-02** ; ≠ slogan « wellbeing » ; pas « Labour Code » |
| gl-css | Coordinateur Sécurité-Santé (CSS) | belge | Health & Safety Coordinator (BE statutory, *CSS*) | Provider legally required on a Belgian site as soon as two firms work there; coordinates health and safety. | **cible pointeur table-02** ; pas « SPS coordinator » |
| gl-rgie | RGIE | belge | Belgium's electrical installation regulations (*RGIE*) | Belgian compliance standard for electrical installations, checked before premises are brought into service. | **cible pointeur table-02** ; pas « NF » |
| gl-nbn | Normes NBN | belge | NBN standards (Belgian) | Standards from the Belgian standards body (e.g. NBN EN 12464-1 for workplace lighting). | **cible pointeur table-02** ; pas AFNOR/NF |
| gl-currents | Courants forts / courants faibles | universel | power (high-current) vs data (low-current) networks | The split between power networks (sockets, lighting) and data networks (data, RJ45, fibre). | anticiper dès le space planning |
| gl-cobat | CoBAT / CoDT / VCRO | belge | regional town-planning codes (Brussels *CoBAT*, Wallonia *CoDT*, Flanders *VCRO*) | The regional codes governing town planning and permits in Belgium. | mobiliser selon la région |

---

## Catégorie 5 — Phases & livrables du déménagement

| id | Terme FR | Cas | Rendu EN-GB | Définition EN-GB | Note |
|---|---|---|---|---|---|
| gl-det | Direction de l'Exécution des Travaux (DET) | universel | construction / site supervision (« DET ») | Mission of monitoring and steering the building works: checking compliance, deadlines and costs through to completion. | le prestataire de pilotage n'assure pas la DET du bâtiment |
| gl-handover | Réception de chantier | universel | handover / practical completion | The act by which the client (assisted by the project provider) accepts the completed works, noting any snags to clear; marks the official end of works. | — |
| gl-acceptance | Réception provisoire / définitive | belge | provisional / final acceptance (BE) | In Belgium: provisional acceptance ends the works, transfers risk and starts occupation (with a snag list); final acceptance follows once snags are cleared. | précision belge de la réception |
| gl-asbuilt | Dossier As-Built (DIU) | belge | as-built dossier (BE: *DIU*) | Final drawings and documents handed to the client, reflecting exactly what was built. BE: *DIU* = post-intervention file. | « as-built » déjà anglais ; *DIU* glosé |
| gl-aftercare | After care | déjà-EN | after care / aftercare | Support after move-in: clearing final snags, use adjustments, helping teams take ownership of the new spaces. | conservé |
| gl-moving-day | Jour J (du déménagement) | universel | moving day (D-day) | The day of the physical transfer to the new premises; the project's peak-tension moment, when everything must be ready and coordinated. | — |

---

*table-03.en-GB.md — v0.1 (6 juillet 2026), hérité intégralement de la table-03.en-GB.md de GTTP v0.1/v0.4 (contenu identique, mentions « GTTP » neutralisées en « le prestataire de pilotage »). À élaguer au vocabulaire réel de Business Move (annuaire de déménageurs) quand la couche 03 BM divergera. Faits belges à confirmer en passe praticien. Régénérer (ne pas éditer à la main) si la couche 03 évolue.*
