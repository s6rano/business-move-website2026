(function () {
  const coords = window.BM_POSTAL_COORDS || {};
  const movers = window.BM_MOVERS || [];
  const params = new URLSearchParams(window.location.search);
  const requestedLang = params.get("lang");
  const requestedTheme = params.get("theme");
  const state = {
    lang: ["fr", "nl", "en"].includes(requestedLang) ? requestedLang : localStorage.getItem("bm.lang") || "fr",
    theme: ["light", "dark"].includes(requestedTheme) ? requestedTheme : localStorage.getItem("bm.theme") || "light",
    lastSearch: null
  };

  const i18n = {
    fr: {
      "meta.title": "Business Move | Trouver un déménageur d'entreprise en Belgique",
      "meta.description": "Annuaire de déménageurs pour entreprises en Belgique avec recherche par code postal, rayon kilométrique et devis indicatif.",
      "aria.nav": "Navigation principale",
      "aria.languages": "Langues",
      "aria.quickCodes": "Codes postaux rapides",
      "city.brussels": "Bruxelles",
      "city.antwerp": "Anvers",
      "city.ghent": "Gand",
      "city.liege": "Liège",
      "nav.directory": "Annuaire",
      "nav.organize": "Organiser votre déménagement",
      "nav.quoteContact": "Devis & contact",
      "nav.quote": "Devis",
      "theme.dark": "Sombre",
      "theme.light": "Clair",
      "footer.guide": "Guide",
      "footer.baseline": "Annuaire indépendant de déménageurs d'entreprise en Belgique.",
      "home.eyebrow": "Annuaire belge B2B",
      "home.heroTitle": "Trouvez un déménageur d'entreprise par code postal.",
      "home.heroLead": "Recherchez les prestataires proches de votre site, comparez leur spécialité et élargissez le rayon pour inclure les communes voisines.",
      "home.adviceEyebrow": "Avant de demander un prix",
      "home.adviceTitle": "Un bon déménagement d'entreprise se prépare comme une opération.",
      "home.adviceLead": "Les meilleurs devis sont comparables quand le périmètre est clair : volume, contraintes d'accès, continuité de service, matériel IT, archives et calendrier.",
      "home.card1Kicker": "Cartographier",
      "home.card1Title": "Sites, étages, flux",
      "home.card1Text": "Listez les implantations, les ascenseurs, les zones de chargement, les horaires autorisés et les postes critiques.",
      "home.card2Kicker": "Comparer",
      "home.card2Title": "3 devis cohérents",
      "home.card2Text": "Demandez les mêmes hypothèses à chaque déménageur : volume, distance, emballage, IT, assurance et week-end.",
      "home.card3Kicker": "Orchestrer",
      "home.card3Title": "Planning de bascule",
      "home.card3Text": "Préparez un plan par équipe, une communication interne, un étiquetage simple et un responsable par zone.",
      "home.gttpTitle": "Quand le choix du déménageur ne suffit pas, faites piloter le projet.",
      "home.gttpText": "Go to the Point aide les entreprises à organiser le transfert : analyse, cahier des charges, coordination, communication et suivi du jour J.",
      "home.gttpCta": "Obtenir une estimation",
      "search.title": "Recherche locale",
      "search.help": "Saisissez le code postal du site à déménager.",
      "search.postal": "Code postal",
      "search.radius": "Rayon",
      "search.submit": "Chercher",
      "search.hint": "Base locale de démonstration, extensible vers Airtable ou un fichier éditorial.",
      "search.invalid": "Entrez un code postal belge valide. La base locale contient déjà les principales zones urbaines et peut être étendue.",
      "search.empty": "Aucun déménageur trouvé autour de {postal}. Élargissez le rayon ou contactez Go to the Point pour une recherche manuelle.",
      "search.partners": "{count} partenaire{plural} autour de {city}",
      "search.contact": "Contacter",
      "search.email": "Email",
      "search.subject": "Demande de disponibilité - déménagement d'entreprise",
      "search.promoTitle": "Besoin d'orchestrer tout le transfert ?",
      "search.promoText": "Go to the Point organise les déménagements d'entreprise de bout en bout : planning, cahier des charges, coordination des prestataires et bascule opérationnelle.",
      "search.promoCta": "Calculer un devis",
      "organize.eyebrow": "Méthode",
      "organize.title": "Organiser votre déménagement sans bloquer l'activité.",
      "organize.lead": "Le déménageur exécute le transfert. L'entreprise doit d'abord cadrer le périmètre, préparer les équipes et protéger la continuité opérationnelle.",
      "organize.step1Kicker": "Cadrage",
      "organize.step1Title": "Fixer le périmètre du transfert",
      "organize.step1Text": "Sites d'origine et de destination, nombre de postes, mobilier, archives, salles de réunion, zones sensibles, contraintes de bail et calendrier cible.",
      "organize.step2Kicker": "Inventaire",
      "organize.step2Title": "Mesurer ce qui bouge vraiment",
      "organize.step2Text": "Un inventaire clair évite les devis incomparables. Distinguez ce qui déménage, ce qui part au stockage, ce qui est recyclé et ce qui reste.",
      "organize.step3Kicker": "Consultation",
      "organize.step3Title": "Demander 3 offres comparables",
      "organize.step3Text": "Transmettez le même cahier des charges aux prestataires : visites, emballage, IT, assurance, monte-charge, nettoyage, horaires et pénalités.",
      "organize.step4Kicker": "Bascule",
      "organize.step4Title": "Séquencer les équipes",
      "organize.step4Text": "Planifiez par vague, attribuez un responsable par zone et gardez une cellule de décision disponible pendant le transfert.",
      "organize.step5Kicker": "Reprise",
      "organize.step5Title": "Vérifier le redémarrage",
      "organize.step5Text": "Contrôlez les postes critiques, les badges, les connexions, les imprimantes et la signalétique avant le retour des équipes.",
      "organize.promoTitle": "Besoin d'un chef de projet ?",
      "organize.promoText": "Go to the Point peut prendre le rôle de coordinateur : cahier des charges, sélection des déménageurs, planning, communication interne et suivi du jour J.",
      "organize.promoCta": "Préparer mon devis",
      "quote.eyebrow": "Devis & contacts",
      "quote.title": "Calculez une fourchette et préparez un email de demande.",
      "quote.lead": "Le calculateur estime le budget, sélectionne trois déménageurs proches du code postal d'origine et génère un email prêt à envoyer.",
      "quote.formTitle": "Paramètres du projet",
      "quote.formHelp": "Les montants sont indicatifs et doivent être confirmés après visite technique.",
      "quote.company": "Entreprise",
      "quote.companyDefault": "Votre entreprise",
      "quote.email": "Email destinataire",
      "quote.emailPlaceholder": "prenom@entreprise.be",
      "quote.origin": "Code postal départ",
      "quote.destination": "Code postal arrivée",
      "quote.workstations": "Postes de travail",
      "quote.volume": "Volume estimé",
      "quote.floors": "Étages contraints",
      "quote.radius": "Rayon prestataires",
      "quote.lift": "Ascenseur / monte-charge",
      "quote.available": "Disponible",
      "quote.unavailable": "Non disponible",
      "quote.it": "Matériel IT",
      "quote.included": "Inclus",
      "quote.notIncluded": "Non inclus",
      "quote.timing": "Intervention",
      "quote.weekday": "En semaine",
      "quote.weekend": "Week-end ou hors heures",
      "quote.notes": "Notes",
      "quote.notesPlaceholder": "Contraintes d'accès, délai, sites multiples, stockage...",
      "quote.recalculate": "Recalculer",
      "quote.contactsTitle": "3 contacts proposés",
      "quote.gttpTitle": "Coordination par Go to the Point",
      "quote.gttpText": "Pour un appel d'offres propre et une bascule sans interruption, faites piloter le projet par une agence spécialisée en organisation de déménagement d'entreprise.",
      "quote.gttpCta": "Voir gotothepoint.eu",
      "quote.emailEyebrow": "Email automatique",
      "quote.emailTitle": "Envoyer l'estimation",
      "quote.emailCta": "Ouvrir l'email",
      "quote.estimate": "Estimation indicative",
      "quote.distance": "Distance estimée : {distance} km. Prix à confirmer après visite technique.",
      "quote.noMover": "Aucun déménageur trouvé dans ce rayon. Essayez 50 km ou 75 km.",
      "quote.emailSubject": "Votre estimation de déménagement d'entreprise",
      "quote.breakPreparation": "Préparation et équipe",
      "quote.breakVolume": "Volume mobilier",
      "quote.breakAccess": "Accès bâtiment",
      "quote.breakDistance": "Distance",
      "quote.breakIt": "IT et postes",
      "quote.breakWeekend": "Intervention week-end",
      "email.hello": "Bonjour,",
      "email.intro": "Voici une estimation pour {company}.",
      "email.trip": "Trajet: {origin} vers {destination}",
      "email.workstations": "Postes: {value}",
      "email.volume": "Volume: {value} m3",
      "email.range": "Fourchette indicative: {low} à {high}",
      "email.movers": "Déménageurs à contacter:",
      "email.noMover": "Aucun déménageur trouvé dans le rayon choisi.",
      "email.note": "Note: pour coordonner le cahier des charges, les visites techniques et le planning de bascule, Go to the Point peut piloter le projet: https://gotothepoint.eu"
    },
    nl: {
      "meta.title": "Business Move | Vind een zakelijke verhuizer in België",
      "meta.description": "Gids met zakelijke verhuizers in België, zoeken per postcode, straal en indicatieve offerte.",
      "aria.nav": "Hoofdnavigatie",
      "aria.languages": "Talen",
      "aria.quickCodes": "Snelle postcodes",
      "city.brussels": "Brussel",
      "city.antwerp": "Antwerpen",
      "city.ghent": "Gent",
      "city.liege": "Luik",
      "nav.directory": "Gids",
      "nav.organize": "Uw verhuis organiseren",
      "nav.quoteContact": "Offerte & contact",
      "nav.quote": "Offerte",
      "theme.dark": "Donker",
      "theme.light": "Licht",
      "footer.guide": "Gids",
      "footer.baseline": "Onafhankelijke gids met zakelijke verhuizers in België.",
      "home.eyebrow": "Belgische B2B-gids",
      "home.heroTitle": "Vind een zakelijke verhuizer per postcode.",
      "home.heroLead": "Zoek dienstverleners dicht bij uw site, vergelijk hun specialisatie en vergroot de straal om naburige gemeenten mee te nemen.",
      "home.adviceEyebrow": "Voor u een prijs vraagt",
      "home.adviceTitle": "Een goede bedrijfsverhuis wordt voorbereid als een operatie.",
      "home.adviceLead": "Offertes zijn pas vergelijkbaar wanneer de scope duidelijk is: volume, toegang, bedrijfscontinuïteit, IT-materiaal, archieven en timing.",
      "home.card1Kicker": "In kaart brengen",
      "home.card1Title": "Sites, verdiepingen, stromen",
      "home.card1Text": "Noteer vestigingen, liften, laad zones, toegestane uren en kritieke werkplekken.",
      "home.card2Kicker": "Vergelijken",
      "home.card2Title": "3 vergelijkbare offertes",
      "home.card2Text": "Geef elke verhuizer dezelfde hypotheses: volume, afstand, verpakking, IT, verzekering en weekendwerk.",
      "home.card3Kicker": "Orkestreren",
      "home.card3Title": "Omschakelplanning",
      "home.card3Text": "Werk per team, voorzie interne communicatie, duidelijke labels en een verantwoordelijke per zone.",
      "home.gttpTitle": "Wanneer de keuze van de verhuizer niet volstaat, laat het project begeleiden.",
      "home.gttpText": "Go to the Point helpt bedrijven met analyse, lastenboek, coördinatie, communicatie en opvolging op de verhuisdag.",
      "home.gttpCta": "Raming krijgen",
      "search.title": "Lokale zoekopdracht",
      "search.help": "Voer de postcode van de te verhuizen site in.",
      "search.postal": "Postcode",
      "search.radius": "Straal",
      "search.submit": "Zoeken",
      "search.hint": "Lokale demonstratiedatabase, uitbreidbaar naar Airtable of een redactioneel bestand.",
      "search.invalid": "Voer een geldige Belgische postcode in. De lokale database bevat al de belangrijkste stedelijke zones en kan worden uitgebreid.",
      "search.empty": "Geen verhuizer gevonden rond {postal}. Vergroot de straal of contacteer Go to the Point voor een manuele zoekopdracht.",
      "search.partners": "{count} partner{plural} rond {city}",
      "search.contact": "Contact",
      "search.email": "Email",
      "search.subject": "Beschikbaarheidsaanvraag - bedrijfsverhuis",
      "search.promoTitle": "Moet het hele traject gecoördineerd worden?",
      "search.promoText": "Go to the Point organiseert bedrijfsverhuizingen van begin tot eind: planning, lastenboek, coördinatie van leveranciers en operationele omschakeling.",
      "search.promoCta": "Offerte berekenen",
      "organize.eyebrow": "Methode",
      "organize.title": "Organiseer uw verhuis zonder de activiteit te blokkeren.",
      "organize.lead": "De verhuizer voert de verhuis uit. Het bedrijf moet eerst de scope vastleggen, de teams voorbereiden en de operationele continuïteit beschermen.",
      "organize.step1Kicker": "Kadering",
      "organize.step1Title": "De scope vastleggen",
      "organize.step1Text": "Vertrek- en aankomstsites, aantal werkplekken, meubilair, archieven, vergaderzalen, gevoelige zones, huurvoorwaarden en timing.",
      "organize.step2Kicker": "Inventaris",
      "organize.step2Title": "Meten wat echt verhuist",
      "organize.step2Text": "Een duidelijke inventaris voorkomt onvergelijkbare offertes. Splits wat verhuist, opgeslagen wordt, gerecycleerd wordt en blijft staan.",
      "organize.step3Kicker": "Consultatie",
      "organize.step3Title": "3 vergelijkbare voorstellen vragen",
      "organize.step3Text": "Bezorg hetzelfde lastenboek aan elke leverancier: bezoeken, verpakking, IT, verzekering, lift, schoonmaak, uren en boetes.",
      "organize.step4Kicker": "Omschakeling",
      "organize.step4Title": "Teams in fases plannen",
      "organize.step4Text": "Plan per golf, wijs per zone een verantwoordelijke aan en hou een beslissingscel beschikbaar tijdens de verhuis.",
      "organize.step5Kicker": "Herstart",
      "organize.step5Title": "De herstart controleren",
      "organize.step5Text": "Controleer kritieke werkplekken, badges, verbindingen, printers en signalisatie voor de teams terugkomen.",
      "organize.promoTitle": "Een projectleider nodig?",
      "organize.promoText": "Go to the Point kan de coördinatie opnemen: lastenboek, selectie van verhuizers, planning, interne communicatie en opvolging op de verhuisdag.",
      "organize.promoCta": "Mijn offerte voorbereiden",
      "quote.eyebrow": "Offerte & contacten",
      "quote.title": "Bereken een prijsvork en bereid een aanvraagmail voor.",
      "quote.lead": "De calculator schat het budget, selecteert drie verhuizers dicht bij de vertrekpostcode en genereert een mail die klaar is om te verzenden.",
      "quote.formTitle": "Projectparameters",
      "quote.formHelp": "Bedragen zijn indicatief en moeten na een technisch bezoek worden bevestigd.",
      "quote.company": "Bedrijf",
      "quote.companyDefault": "Uw bedrijf",
      "quote.email": "Ontvanger email",
      "quote.emailPlaceholder": "voornaam@bedrijf.be",
      "quote.origin": "Vertrekpostcode",
      "quote.destination": "Aankomstpostcode",
      "quote.workstations": "Werkplekken",
      "quote.volume": "Geschat volume",
      "quote.floors": "Moeilijke verdiepingen",
      "quote.radius": "Straal leveranciers",
      "quote.lift": "Lift / goederenlift",
      "quote.available": "Beschikbaar",
      "quote.unavailable": "Niet beschikbaar",
      "quote.it": "IT-materiaal",
      "quote.included": "Inbegrepen",
      "quote.notIncluded": "Niet inbegrepen",
      "quote.timing": "Interventie",
      "quote.weekday": "Tijdens de week",
      "quote.weekend": "Weekend of buiten uren",
      "quote.notes": "Notities",
      "quote.notesPlaceholder": "Toegang, timing, meerdere sites, opslag...",
      "quote.recalculate": "Herberekenen",
      "quote.contactsTitle": "3 voorgestelde contacten",
      "quote.gttpTitle": "Coördinatie door Go to the Point",
      "quote.gttpText": "Voor een helder aanbestedingsproces en een omschakeling zonder onderbreking kan een gespecialiseerd bureau het project aansturen.",
      "quote.gttpCta": "Bekijk gotothepoint.eu",
      "quote.emailEyebrow": "Automatische email",
      "quote.emailTitle": "De raming verzenden",
      "quote.emailCta": "Email openen",
      "quote.estimate": "Indicatieve raming",
      "quote.distance": "Geschatte afstand: {distance} km. Prijs te bevestigen na technisch bezoek.",
      "quote.noMover": "Geen verhuizer gevonden binnen deze straal. Probeer 50 km of 75 km.",
      "quote.emailSubject": "Uw raming voor een bedrijfsverhuis",
      "quote.breakPreparation": "Voorbereiding en team",
      "quote.breakVolume": "Volume meubilair",
      "quote.breakAccess": "Toegang gebouw",
      "quote.breakDistance": "Afstand",
      "quote.breakIt": "IT en werkplekken",
      "quote.breakWeekend": "Weekendinterventie",
      "email.hello": "Hallo,",
      "email.intro": "Hier is een raming voor {company}.",
      "email.trip": "Traject: {origin} naar {destination}",
      "email.workstations": "Werkplekken: {value}",
      "email.volume": "Volume: {value} m3",
      "email.range": "Indicatieve prijsvork: {low} tot {high}",
      "email.movers": "Te contacteren verhuizers:",
      "email.noMover": "Geen verhuizer gevonden binnen de gekozen straal.",
      "email.note": "Opmerking: voor de coördinatie van het lastenboek, technische bezoeken en omschakelplanning kan Go to the Point het project begeleiden: https://gotothepoint.eu"
    },
    en: {
      "meta.title": "Business Move | Find a corporate mover in Belgium",
      "meta.description": "Directory of corporate movers in Belgium with postcode search, distance radius and indicative quote.",
      "aria.nav": "Main navigation",
      "aria.languages": "Languages",
      "aria.quickCodes": "Quick postcodes",
      "city.brussels": "Brussels",
      "city.antwerp": "Antwerp",
      "city.ghent": "Ghent",
      "city.liege": "Liege",
      "nav.directory": "Directory",
      "nav.organize": "Organise your move",
      "nav.quoteContact": "Quote & contact",
      "nav.quote": "Quote",
      "theme.dark": "Dark",
      "theme.light": "Light",
      "footer.guide": "Guide",
      "footer.baseline": "Independent directory of corporate movers in Belgium.",
      "home.eyebrow": "Belgian B2B directory",
      "home.heroTitle": "Find a corporate mover by postcode.",
      "home.heroLead": "Search providers close to your site, compare their specialities and expand the radius to include neighbouring municipalities.",
      "home.adviceEyebrow": "Before requesting a price",
      "home.adviceTitle": "A good office move is prepared like an operation.",
      "home.adviceLead": "Quotes are comparable when the scope is clear: volume, access constraints, business continuity, IT equipment, archives and calendar.",
      "home.card1Kicker": "Map",
      "home.card1Title": "Sites, floors, flows",
      "home.card1Text": "List locations, lifts, loading zones, authorised hours and critical workstations.",
      "home.card2Kicker": "Compare",
      "home.card2Title": "3 coherent quotes",
      "home.card2Text": "Give every mover the same assumptions: volume, distance, packing, IT, insurance and weekend work.",
      "home.card3Kicker": "Orchestrate",
      "home.card3Title": "Switch-over plan",
      "home.card3Text": "Prepare a team-by-team plan, internal communication, simple labelling and one owner per zone.",
      "home.gttpTitle": "When choosing a mover is not enough, have the project managed.",
      "home.gttpText": "Go to the Point helps companies organise the transfer: analysis, specifications, coordination, communication and move-day follow-up.",
      "home.gttpCta": "Get an estimate",
      "search.title": "Local search",
      "search.help": "Enter the postcode of the site to be moved.",
      "search.postal": "Postcode",
      "search.radius": "Radius",
      "search.submit": "Search",
      "search.hint": "Local demo database, ready to be extended to Airtable or an editorial file.",
      "search.invalid": "Enter a valid Belgian postcode. The local database already covers the main urban areas and can be expanded.",
      "search.empty": "No mover found around {postal}. Increase the radius or contact Go to the Point for a manual search.",
      "search.partners": "{count} partner{plural} near {city}",
      "search.contact": "Contact",
      "search.email": "Email",
      "search.subject": "Availability request - corporate move",
      "search.promoTitle": "Need the whole transfer orchestrated?",
      "search.promoText": "Go to the Point organises corporate moves end to end: planning, specifications, provider coordination and operational switch-over.",
      "search.promoCta": "Calculate a quote",
      "organize.eyebrow": "Method",
      "organize.title": "Organise your move without blocking activity.",
      "organize.lead": "The mover executes the transfer. The company must first define the scope, prepare teams and protect operational continuity.",
      "organize.step1Kicker": "Scoping",
      "organize.step1Title": "Define the transfer scope",
      "organize.step1Text": "Origin and destination sites, number of workstations, furniture, archives, meeting rooms, sensitive zones, lease constraints and target calendar.",
      "organize.step2Kicker": "Inventory",
      "organize.step2Title": "Measure what really moves",
      "organize.step2Text": "A clear inventory prevents incomparable quotes. Separate what moves, what goes to storage, what is recycled and what stays.",
      "organize.step3Kicker": "Consultation",
      "organize.step3Title": "Request 3 comparable offers",
      "organize.step3Text": "Send the same specifications to providers: visits, packing, IT, insurance, lift, cleaning, hours and penalties.",
      "organize.step4Kicker": "Switch-over",
      "organize.step4Title": "Sequence the teams",
      "organize.step4Text": "Plan by wave, assign one owner per zone and keep a decision cell available during the transfer.",
      "organize.step5Kicker": "Restart",
      "organize.step5Title": "Check the restart",
      "organize.step5Text": "Check critical workstations, badges, connections, printers and signage before teams return.",
      "organize.promoTitle": "Need a project manager?",
      "organize.promoText": "Go to the Point can coordinate the specifications, mover selection, planning, internal communication and move-day follow-up.",
      "organize.promoCta": "Prepare my quote",
      "quote.eyebrow": "Quote & contacts",
      "quote.title": "Calculate a price range and prepare a request email.",
      "quote.lead": "The calculator estimates the budget, selects three movers near the origin postcode and generates an email ready to send.",
      "quote.formTitle": "Project parameters",
      "quote.formHelp": "Amounts are indicative and must be confirmed after a technical visit.",
      "quote.company": "Company",
      "quote.companyDefault": "Your company",
      "quote.email": "Recipient email",
      "quote.emailPlaceholder": "name@company.be",
      "quote.origin": "Origin postcode",
      "quote.destination": "Destination postcode",
      "quote.workstations": "Workstations",
      "quote.volume": "Estimated volume",
      "quote.floors": "Constrained floors",
      "quote.radius": "Provider radius",
      "quote.lift": "Lift / goods lift",
      "quote.available": "Available",
      "quote.unavailable": "Unavailable",
      "quote.it": "IT equipment",
      "quote.included": "Included",
      "quote.notIncluded": "Not included",
      "quote.timing": "Timing",
      "quote.weekday": "Weekday",
      "quote.weekend": "Weekend or out of hours",
      "quote.notes": "Notes",
      "quote.notesPlaceholder": "Access constraints, timing, multiple sites, storage...",
      "quote.recalculate": "Recalculate",
      "quote.contactsTitle": "3 suggested contacts",
      "quote.gttpTitle": "Coordination by Go to the Point",
      "quote.gttpText": "For a clean tender process and a switch-over without interruption, have the project managed by a specialist corporate move organisation agency.",
      "quote.gttpCta": "View gotothepoint.eu",
      "quote.emailEyebrow": "Automatic email",
      "quote.emailTitle": "Send the estimate",
      "quote.emailCta": "Open email",
      "quote.estimate": "Indicative estimate",
      "quote.distance": "Estimated distance: {distance} km. Price to be confirmed after a technical visit.",
      "quote.noMover": "No mover found within this radius. Try 50 km or 75 km.",
      "quote.emailSubject": "Your corporate move estimate",
      "quote.breakPreparation": "Preparation and crew",
      "quote.breakVolume": "Furniture volume",
      "quote.breakAccess": "Building access",
      "quote.breakDistance": "Distance",
      "quote.breakIt": "IT and workstations",
      "quote.breakWeekend": "Weekend intervention",
      "email.hello": "Hello,",
      "email.intro": "Here is an estimate for {company}.",
      "email.trip": "Route: {origin} to {destination}",
      "email.workstations": "Workstations: {value}",
      "email.volume": "Volume: {value} m3",
      "email.range": "Indicative range: {low} to {high}",
      "email.movers": "Movers to contact:",
      "email.noMover": "No mover found within the selected radius.",
      "email.note": "Note: to coordinate the specifications, technical visits and switch-over planning, Go to the Point can manage the project: https://gotothepoint.eu"
    }
  };

  const moverLabels = {
    fr: {
      "Brussels": "Bruxelles",
      "Antwerpen": "Anvers",
      "Gent": "Gand",
      "Kortrijk": "Courtrai",
      "Mechelen": "Malines",
      "Leuven": "Louvain",
      "Aalst": "Alost"
    },
    nl: {
      "Bruxelles": "Brussel",
      "Malines": "Mechelen",
      "Liège": "Luik",
      "Courtrai": "Kortrijk",
      "Bureaux": "Kantoren",
      "Déménagement professionnel": "Professionele verhuis",
      "Mobilier": "Meubilair",
      "Stockage": "Opslag",
      "Archives": "Archieven",
      "International": "Internationaal",
      "Machines": "Machines",
      "Agréé": "Erkend",
      "Planning": "Planning",
      "Week-end": "Weekend",
      "Industrie": "Industrie",
      "Monte-charge": "Goederenlift",
      "Administrations": "Administraties",
      "Entrepots": "Magazijnen",
      "Transport longue distance": "Langeafstandstransport",
      "Labellisation": "Labeling",
      "PME et plateaux complets": "Kmo's en volledige verdiepingen",
      "10 postes et plus": "10 werkplekken en meer",
      "Start-up, PME, campus": "Start-ups, kmo's, campussen",
      "Sites multi-etages": "Sites met meerdere verdiepingen",
      "20 postes et plus": "20 werkplekken en meer",
      "PME et entrepots": "Kmo's en magazijnen",
      "Coworking et PME": "Coworking en kmo's"
    },
    en: {
      "Bruxelles": "Brussels",
      "Anvers": "Antwerp",
      "Malines": "Mechelen",
      "Liège": "Liege",
      "Courtrai": "Kortrijk",
      "Bureaux": "Offices",
      "Déménagement professionnel": "Corporate moving",
      "Mobilier": "Furniture",
      "Stockage": "Storage",
      "Archives": "Archives",
      "International": "International",
      "Machines": "Machinery",
      "Agréé": "Accredited",
      "Planning": "Planning",
      "Week-end": "Weekend",
      "Industrie": "Industrial",
      "Monte-charge": "Goods lift",
      "Administrations": "Public bodies",
      "Entrepots": "Warehouses",
      "Transport longue distance": "Long-distance transport",
      "Labellisation": "Labelling",
      "PME et plateaux complets": "SMEs and full floors",
      "10 postes et plus": "10 workstations and more",
      "Start-up, PME, campus": "Start-ups, SMEs, campuses",
      "Sites multi-etages": "Multi-floor sites",
      "20 postes et plus": "20 workstations and more",
      "PME et entrepots": "SMEs and warehouses",
      "Coworking et PME": "Coworking and SMEs"
    }
  };

  const byId = (id) => document.getElementById(id);
  const t = (key, vars = {}) => {
    const value = (i18n[state.lang] && i18n[state.lang][key]) || i18n.fr[key] || key;
    return Object.entries(vars).reduce((text, [name, replacement]) => text.replaceAll(`{${name}}`, replacement), value);
  };
  const localizeMover = (value) => (moverLabels[state.lang] && moverLabels[state.lang][value]) || value;
  const euro = (value) =>
    new Intl.NumberFormat(`${state.lang}-BE`, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(value);

  function distanceKm(a, b) {
    const radius = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return radius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  function normalizePostalCode(value) {
    const match = String(value || "").match(/\d{4}/);
    return match ? match[0] : "";
  }

  function postalLookup(postalCode) {
    const exact = coords[postalCode];
    if (exact) return exact;

    const numeric = Number(postalCode);
    if (!Number.isFinite(numeric)) return null;

    const nearest = Object.entries(coords)
      .map(([code, data]) => ({ code, data, gap: Math.abs(Number(code) - numeric) }))
      .sort((a, b) => a.gap - b.gap)[0];

    return nearest && nearest.gap <= 140 ? nearest.data : null;
  }

  function findMovers(postalCode, radius) {
    const normalized = normalizePostalCode(postalCode);
    const origin = postalLookup(normalized);
    if (!origin) return { normalized, origin: null, results: [] };

    const results = movers
      .map((mover) => ({
        ...mover,
        distance: distanceKm(origin, { lat: mover.lat, lng: mover.lng })
      }))
      .filter((mover) => mover.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return { normalized, origin, results };
  }

  function applyTheme() {
    document.body.dataset.theme = state.theme;
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.textContent = state.theme === "dark" ? t("theme.light") : t("theme.dark");
      button.setAttribute("aria-label", button.textContent);
    });
  }

  function applyTranslations() {
    document.documentElement.lang = state.lang;
    document.title = t("meta.title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.description"));

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
      node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
    });
    const companyInput = byId("company");
    if (companyInput && ["Votre entreprise", "Uw bedrijf", "Your company"].includes(companyInput.value)) {
      companyInput.value = t("quote.companyDefault");
    }
    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === state.lang));
    });
    applyTheme();
  }

  function renderMoverCard(mover, options = {}) {
    const specialties = mover.specialties
      .map((specialty) => `<span class="pill">${localizeMover(specialty)}</span>`)
      .join("");
    const contactLink = mover.email
      ? `mailto:${mover.email}?subject=${encodeURIComponent(t("search.subject"))}`
      : mover.website || "#";
    const contactLabel = mover.email
      ? (options.short ? t("search.email") : t("search.contact"))
      : "Website";
    const rating = mover.rating ? `<span class="pill">${mover.rating}/5</span>` : "";
    const phone = mover.phone ? `<p class="microcopy">${mover.phone}</p>` : "";

    return `
      <article class="result-card">
        <div>
          <h3>${mover.name}</h3>
          <p class="muted">${mover.address}</p>
          ${phone}
          <div class="result-meta">
            <span class="pill">${localizeMover(mover.city)}</span>
            ${rating}
            <span class="pill">${localizeMover(mover.minProject)}</span>
            ${specialties}
          </div>
        </div>
        <div>
          <p class="distance">${mover.distance.toFixed(1)} km</p>
          <a class="btn secondary" href="${contactLink}">${contactLabel}</a>
        </div>
      </article>
    `;
  }

  function renderSearchResults(targetId, postalCode, radius, limit) {
    const target = byId(targetId);
    if (!target) return [];

    const { normalized, origin, results } = findMovers(postalCode, radius);
    const limited = results.slice(0, limit || results.length);
    state.lastSearch = { targetId, postalCode, radius, limit };

    if (!normalized || !origin) {
      target.innerHTML = `<div class="notice">${t("search.invalid")}</div>`;
      return [];
    }

    if (!limited.length) {
      target.innerHTML = `<div class="notice">${t("search.empty", { postal: normalized })}</div>`;
      return [];
    }

    target.innerHTML = `
      <div class="results-shell">
        <div>
          <p class="eyebrow">${t("search.partners", {
            count: limited.length,
            plural: limited.length > 1 ? "s" : "",
            city: localizeMover(origin.city)
          })}</p>
          <div class="results-list">${limited.map((mover) => renderMoverCard(mover)).join("")}</div>
        </div>
        <aside class="soft-panel promo">
          <img src="identity/logo-bm-white-200-62.png" alt="Business Move">
          <h3>${t("search.promoTitle")}</h3>
          <p class="microcopy">${t("search.promoText")}</p>
          <a class="btn light" href="devis.html">${t("search.promoCta")}</a>
        </aside>
      </div>
    `;

    return limited;
  }

  function initSearchForm() {
    const form = byId("search-form");
    if (!form) return;

    const postalInput = byId("postal-code");
    const radiusInput = byId("radius-km");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      renderSearchResults("search-results", postalInput.value, Number(radiusInput.value || 25));
      byId("search-results")?.scrollIntoView({ block: "nearest" });
    });

    document.querySelectorAll("[data-postal]").forEach((button) => {
      button.addEventListener("click", () => {
        postalInput.value = button.getAttribute("data-postal");
        form.requestSubmit();
      });
    });

    renderSearchResults("search-results", postalInput.value || "1000", Number(radiusInput.value || 25), 3);
  }

  function calculateQuote(values) {
    const workstations = Number(values.get("workstations") || 0);
    const volume = Number(values.get("volume") || 0);
    const floors = Number(values.get("floors") || 0);
    const hasLift = values.get("lift") === "yes";
    const itMove = values.get("it") === "yes";
    const weekend = values.get("weekend") === "yes";
    const originCode = normalizePostalCode(values.get("origin"));
    const destinationCode = normalizePostalCode(values.get("destination"));
    const origin = postalLookup(originCode);
    const destination = postalLookup(destinationCode);
    const tripDistance = origin && destination ? Math.max(8, distanceKm(origin, destination)) : 25;

    const base = 680;
    const labor = workstations * 62;
    const handling = volume * 34;
    const access = hasLift ? floors * 55 : floors * 160;
    const travel = tripDistance * 5.8;
    const it = itMove ? workstations * 28 + 290 : 0;
    const timing = weekend ? (base + labor + handling + access + travel + it) * 0.18 : 0;
    const low = Math.round((base + labor + handling + access + travel + it + timing) * 0.9);
    const high = Math.round((base + labor + handling + access + travel + it + timing) * 1.18);

    return {
      low,
      high,
      tripDistance,
      breakdown: [
        ["quote.breakPreparation", base + labor],
        ["quote.breakVolume", handling],
        ["quote.breakAccess", access],
        ["quote.breakDistance", travel],
        ["quote.breakIt", it],
        ["quote.breakWeekend", timing]
      ].filter((item) => item[1] > 0)
    };
  }

  function buildQuoteEmail(form, quote, selectedMovers) {
    const company = form.get("company") || t("quote.company");
    const origin = normalizePostalCode(form.get("origin"));
    const destination = normalizePostalCode(form.get("destination"));
    const moversText =
      selectedMovers
        .map((mover, index) => `${index + 1}. ${mover.name} - ${mover.email} - ${mover.phone}`)
        .join("\n") || t("email.noMover");

    return `${t("email.hello")}

${t("email.intro", { company })}

${t("email.trip", { origin, destination })}
${t("email.workstations", { value: form.get("workstations") })}
${t("email.volume", { value: form.get("volume") })}
${t("email.range", { low: euro(quote.low), high: euro(quote.high) })}

${t("email.movers")}
${moversText}

${t("email.note")}
`;
  }

  function updateQuote() {
    const form = byId("quote-form");
    if (!form) return;

    const output = byId("quote-output");
    const moversOutput = byId("quote-movers");
    const emailLink = byId("email-link");
    const emailPreview = byId("email-preview");
    const values = new FormData(form);
    const quote = calculateQuote(values);
    const radius = Number(values.get("radius") || 35);
    const selectedMovers = findMovers(values.get("origin"), radius).results.slice(0, 3);

    if (selectedMovers.length < 3) {
      findMovers(values.get("origin"), 250).results.forEach((mover) => {
        const alreadySelected = selectedMovers.some((selected) => selected.id === mover.id);
        if (selectedMovers.length < 3 && !alreadySelected) selectedMovers.push(mover);
      });
    }

    output.innerHTML = `
      <p class="eyebrow">${t("quote.estimate")}</p>
      <div class="price-total">${euro(quote.low)} - ${euro(quote.high)}</div>
      <p class="microcopy">${t("quote.distance", { distance: quote.tripDistance.toFixed(1) })}</p>
      <ul class="quote-breakdown">
        ${quote.breakdown.map(([label, value]) => `<li><span>${t(label)}</span><strong>${euro(value)}</strong></li>`).join("")}
      </ul>
    `;

    moversOutput.innerHTML = selectedMovers.length
      ? selectedMovers.map((mover) => renderMoverCard(mover, { short: true })).join("")
      : `<div class="notice">${t("quote.noMover")}</div>`;

    const email = buildQuoteEmail(values, quote, selectedMovers);
    emailPreview.textContent = email;
    emailLink.href = `mailto:${encodeURIComponent(values.get("email") || "")}?subject=${encodeURIComponent(
      t("quote.emailSubject")
    )}&body=${encodeURIComponent(email)}`;
  }

  function initQuoteForm() {
    const form = byId("quote-form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      updateQuote();
    });
    form.addEventListener("input", updateQuote);
    updateQuote();
  }

  function initUiPreferences() {
    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.addEventListener("click", () => {
        state.lang = button.dataset.lang;
        localStorage.setItem("bm.lang", state.lang);
        applyTranslations();
        if (state.lastSearch) renderSearchResults(
          state.lastSearch.targetId,
          state.lastSearch.postalCode,
          state.lastSearch.radius,
          state.lastSearch.limit
        );
        updateQuote();
      });
    });

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        state.theme = state.theme === "dark" ? "light" : "dark";
        localStorage.setItem("bm.theme", state.theme);
        applyTheme();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyTranslations();
    initUiPreferences();
    initSearchForm();
    initQuoteForm();
  });
})();
