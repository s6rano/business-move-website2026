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

  const QUOTE_CONFIG = {
    volumeRates: {
      0: { maxKm: 15, low: 28, high: 36 },
      1: { maxKm: 35, low: 32, high: 42 },
      2: { maxKm: 75, low: 38, high: 50 },
      3: { maxKm: Infinity, low: 45, high: 60 }
    },
    team: {
      baseLow: 950,
      baseHigh: 1350,
      perPostLow: 32,
      perPostHigh: 48
    },
    it: {
      none: { low: 0, high: 0 },
      standard: { low: 18, high: 30 },
      advanced: { low: 35, high: 55 }
    },
    access: {
      available: { baseLow: 0, baseHigh: 40, floorLow: 8, floorHigh: 14 },
      narrow: { baseLow: 60, baseHigh: 140, floorLow: 14, floorHigh: 24 },
      unavailable: { baseLow: 110, baseHigh: 220, floorLow: 22, floorHigh: 36 },
      hoistRequired: { baseLow: 250, baseHigh: 320, floorLow: 0, floorHigh: 8 }
    },
    distance: {
      baseLow: 18,
      baseHigh: 30,
      perKmLow: 2.8,
      perKmHigh: 4.5
    },
    schedule: {
      weekday: { low: 1.0, high: 1.0 },
      saturday: { low: 1.25, high: 1.4 },
      sundayHoliday: { low: 1.7, high: 2.0 },
      evening: { low: 1.2, high: 1.35 }
    },
    providerRadius: {
      25: { low: 1.0, high: 1.0 },
      35: { low: 1.04, high: 1.08 },
      50: { low: 1.07, high: 1.12 },
      75: { low: 1.1, high: 1.15 },
      100: { low: 1.13, high: 1.18 },
      125: { low: 1.16, high: 1.22 }
    },
    minimums: {
      low: 1800,
      high: 2500
    }
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
      "home.gttpTitle": "Le choix de votre déménageur ne suffit pas: faites piloter votre projet par des pros!",
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
      "search.promoTitle": "Besoin d'une idée de prix? ",
      "search.promoText": "Notre calculateur vous permet d'évaluer le coût de transport. Ce prix ne comprend pas tous les services qui seront nécessaires à la réussite de votre déménagement B2B mais c'est une base de réflexion. Pour un prix global réaliste, contactez l'agence Go to the Point. ",
      "search.promoCta": "Estimer le coût",
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
      "organize.promoText": "Vous êtes une TPE, une PME ou une grande entreprise? Go to the Point prend en main 100% de l'organisaiton et de la coordination de votre déménagement d'entreprise : cahier des charges, plans, aménéagements, sélection des déménageurs, planning, coordination, suivi, présence au jour J et même after care!",
      "organize.promoCta": "Contactez-nous sans tarder",
      "quote.eyebrow": "Devis & contacts",
      "quote.title": "Estimez le coût de transport de votre déménagement d'entreprise et préparez un email de demande.",
      "quote.lead": "Le calculateur crée une fourchette de prix approximatifs, sélectionne trois déménageurs proches du code postal d'origine et génère un email prêt à envoyer.",
      "quote.formTitle": "Paramètres du projet",
      "quote.formHelp": "Les montants sont strictement indicatifs. Il ne peuvent en aucun cas être considérés comme des devis définitifs. Ces montant seront confirmés ou modifiés après visite technique.",
      "quote.company": "Entreprise",
      "quote.companyDefault": "Votre entreprise",
      "quote.email": "Email destinataire",
      "quote.emailPlaceholder": "prenom@entreprise.be",
      "quote.origin": "Code postal départ",
      "quote.destination": "Code postal arrivée",
      "quote.workstations": "Postes de travail",
      "quote.volume": "Volume estimé (m³)",
      "quote.floors": "Étages contraints",
      "quote.radius": "Rayon prestataires",
      "quote.lift": "Ascenseur / monte-charge",
      "quote.available": "Disponible",
      "quote.unavailable": "Non disponible",
      "quote.it": "Matériel IT",
      "quote.included": "Inclus",
      "quote.notIncluded": "Non inclus",
      "quote.accessAvailable": "Disponible",
      "quote.accessNarrow": "Étroit / contraintes légères",
      "quote.accessUnavailable": "Non disponible",
      "quote.accessHoistRequired": "Monte-meuble requis",
      "quote.itNone": "Non inclus",
      "quote.itStandard": "Standard",
      "quote.itAdvanced": "Avancé",
      "quote.timing": "Intervention",
      "quote.weekday": "En semaine",
      "quote.weekend": "Week-end ou hors heures",
      "quote.saturday": "Samedi",
      "quote.sundayHoliday": "Dimanche / jour férié",
      "quote.evening": "Soirée",
      "quote.notes": "Notes",
      "quote.notesPlaceholder": "Contraintes d'accès, délai, sites multiples, stockage...",
      "quote.recalculate": "Recalculer",
      "quote.contactsTitle": "3 contacts proposés",
      "quote.gttpTitle": "Votre déménagement 100% sous contrôle",
      "quote.gttpText": "Pour un appel d'offres propre et une bascule sans interruption, faites concevoir et piloter votre projet par une agence spécialisée en organisation de déménagement d'entreprise.",
      "quote.gttpCta": "Voir gotothepoint.eu",
      "quote.emailEyebrow": "Email automatique",
      "quote.emailTitle": "Envoyer l'estimation",
      "quote.emailCta": "Ouvrir l'email",
      "quote.estimate": "Estimation indicative",
      "quote.distance": "Distance estimée : {distance}. Prix à confirmer après visite technique.",
      "distance.under": "Moins de {max} km",
      "distance.between": "Entre {min} et {max} km",
      "distance.over": "Plus de {min} km",
      "quote.noMover": "Aucun déménageur trouvé dans ce rayon. Essayez 50 km, 75 km, 100 km ou 125 km.",
      "quote.emailSubject": "Votre estimation de déménagement d'entreprise",
      "quote.breakPreparation": "Préparation et équipe",
      "quote.breakVolume": "Volume mobilier",
      "quote.breakAccess": "Accès bâtiment",
      "quote.breakDistance": "Distance",
      "quote.breakIt": "IT et postes",
      "quote.breakWeekend": "Intervention week-end",
      "quote.breakSchedule": "Coefficient intervention",
      "quote.breakProviderRadius": "Logistique prestataires",
      "quote.breakMinimum": "Minimum de mission",
      "quote.manualReviewTitle": "Revue manuelle conseillée",
      "quote.flagNotes": "Notes spécifiques à vérifier",
      "quote.flagLongDistance": "Distance longue",
      "quote.flagDifficultAccess": "Accès bâtiment difficile",
      "quote.flagAdvancedIt": "IT avancé",
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
      "search.promoText": "Go to the Point organiseert bedrijfsverhuizingen van begin tot eind: planning, lastenboek, inrichting, sortering, inventaris, coördinatie van leveranciers en operationele omschakeling. Binnen die operaties vertegenwoordigt de verhuis zelf een variabele kost.",
      "search.promoCta": "Kost inschatten",
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
      "organize.promoText": "Bent u een micro-onderneming, kmo of grote onderneming? Go to the Point neemt 100% van de organisatie en coördinatie van uw bedrijfsverhuis in handen: lastenboek, plannen, inrichting, selectie van verhuizers, planning, coördinatie, opvolging, aanwezigheid op de verhuisdag en zelfs aftercare!",
      "organize.promoCta": "Neem meteen contact op",
      "quote.eyebrow": "Offerte & contacten",
      "quote.title": "Bereken een prijsvork en bereid een aanvraagmail voor.",
      "quote.lead": "De calculator schat het budget, selecteert drie verhuizers dicht bij de vertrekpostcode en genereert een mail die klaar is om te verzenden.",
      "quote.formTitle": "Projectparameters",
      "quote.formHelp": "De bedragen zijn strikt indicatief. Ze mogen in geen geval worden beschouwd als definitieve offertes. Deze bedragen worden bevestigd of aangepast na een technisch bezoek.",
      "quote.company": "Bedrijf",
      "quote.companyDefault": "Uw bedrijf",
      "quote.email": "Ontvanger email",
      "quote.emailPlaceholder": "voornaam@bedrijf.be",
      "quote.origin": "Vertrekpostcode",
      "quote.destination": "Aankomstpostcode",
      "quote.workstations": "Werkplekken",
      "quote.volume": "Geschat volume (m³)",
      "quote.floors": "Moeilijke verdiepingen",
      "quote.radius": "Straal leveranciers",
      "quote.lift": "Lift / goederenlift",
      "quote.available": "Beschikbaar",
      "quote.unavailable": "Niet beschikbaar",
      "quote.it": "IT-materiaal",
      "quote.included": "Inbegrepen",
      "quote.notIncluded": "Niet inbegrepen",
      "quote.accessAvailable": "Beschikbaar",
      "quote.accessNarrow": "Smal / lichte beperkingen",
      "quote.accessUnavailable": "Niet beschikbaar",
      "quote.accessHoistRequired": "Verhuislift vereist",
      "quote.itNone": "Niet inbegrepen",
      "quote.itStandard": "Standaard",
      "quote.itAdvanced": "Geavanceerd",
      "quote.timing": "Interventie",
      "quote.weekday": "Tijdens de week",
      "quote.weekend": "Weekend of buiten uren",
      "quote.saturday": "Zaterdag",
      "quote.sundayHoliday": "Zondag / feestdag",
      "quote.evening": "Avond",
      "quote.notes": "Notities",
      "quote.notesPlaceholder": "Toegang, timing, meerdere sites, opslag...",
      "quote.recalculate": "Herberekenen",
      "quote.contactsTitle": "3 voorgestelde contacten",
      "quote.gttpTitle": "Uw verhuis 100% onder controle",
      "quote.gttpText": "Voor een helder aanbestedingsproces en een omschakeling zonder onderbreking laat u uw project ontwerpen en aansturen door een gespecialiseerd bureau in de organisatie van bedrijfsverhuizingen.",
      "quote.gttpCta": "Bekijk gotothepoint.eu",
      "quote.emailEyebrow": "Automatische email",
      "quote.emailTitle": "De raming verzenden",
      "quote.emailCta": "Email openen",
      "quote.estimate": "Indicatieve raming",
      "quote.distance": "Geschatte afstand: {distance}. Prijs te bevestigen na technisch bezoek.",
      "distance.under": "Minder dan {max} km",
      "distance.between": "Tussen {min} en {max} km",
      "distance.over": "Meer dan {min} km",
      "quote.noMover": "Geen verhuizer gevonden binnen deze straal. Probeer 50 km, 75 km, 100 km of 125 km.",
      "quote.emailSubject": "Uw raming voor een bedrijfsverhuis",
      "quote.breakPreparation": "Voorbereiding en team",
      "quote.breakVolume": "Volume meubilair",
      "quote.breakAccess": "Toegang gebouw",
      "quote.breakDistance": "Afstand",
      "quote.breakIt": "IT en werkplekken",
      "quote.breakWeekend": "Weekendinterventie",
      "quote.breakSchedule": "Interventiecoëfficiënt",
      "quote.breakProviderRadius": "Leverancierslogistiek",
      "quote.breakMinimum": "Minimumopdracht",
      "quote.manualReviewTitle": "Manuele controle aanbevolen",
      "quote.flagNotes": "Specifieke notities te controleren",
      "quote.flagLongDistance": "Lange afstand",
      "quote.flagDifficultAccess": "Moeilijke toegang gebouw",
      "quote.flagAdvancedIt": "Geavanceerde IT",
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
      "search.promoText": "Go to the Point organises corporate moves end to end: planning, specifications, fit-out, sorting, inventory, provider coordination and operational switch-over. Within these operations, the move itself represents a variable cost.",
      "search.promoCta": "Estimate the cost",
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
      "organize.promoText": "Whether you are a micro-business, SME or large company, Go to the Point takes care of 100% of the organisation and coordination of your corporate move: specifications, plans, fit-out, mover selection, planning, coordination, follow-up, presence on move day and even aftercare!",
      "organize.promoCta": "Contact us without delay",
      "quote.eyebrow": "Quote & contacts",
      "quote.title": "Calculate a price range and prepare a request email.",
      "quote.lead": "The calculator estimates the budget, selects three movers near the origin postcode and generates an email ready to send.",
      "quote.formTitle": "Project parameters",
      "quote.formHelp": "Amounts are strictly indicative. They cannot under any circumstances be considered final quotes. These amounts will be confirmed or amended after a technical visit.",
      "quote.company": "Company",
      "quote.companyDefault": "Your company",
      "quote.email": "Recipient email",
      "quote.emailPlaceholder": "name@company.be",
      "quote.origin": "Origin postcode",
      "quote.destination": "Destination postcode",
      "quote.workstations": "Workstations",
      "quote.volume": "Estimated volume (m³)",
      "quote.floors": "Constrained floors",
      "quote.radius": "Provider radius",
      "quote.lift": "Lift / goods lift",
      "quote.available": "Available",
      "quote.unavailable": "Unavailable",
      "quote.it": "IT equipment",
      "quote.included": "Included",
      "quote.notIncluded": "Not included",
      "quote.accessAvailable": "Available",
      "quote.accessNarrow": "Narrow / light constraints",
      "quote.accessUnavailable": "Unavailable",
      "quote.accessHoistRequired": "Hoist required",
      "quote.itNone": "Not included",
      "quote.itStandard": "Standard",
      "quote.itAdvanced": "Advanced",
      "quote.timing": "Timing",
      "quote.weekday": "Weekday",
      "quote.weekend": "Weekend or out of hours",
      "quote.saturday": "Saturday",
      "quote.sundayHoliday": "Sunday / public holiday",
      "quote.evening": "Evening",
      "quote.notes": "Notes",
      "quote.notesPlaceholder": "Access constraints, timing, multiple sites, storage...",
      "quote.recalculate": "Recalculate",
      "quote.contactsTitle": "3 suggested contacts",
      "quote.gttpTitle": "Your move 100% under control",
      "quote.gttpText": "For a clean tender process and a switch-over without interruption, have your project designed and managed by a specialist corporate move organisation agency.",
      "quote.gttpCta": "View gotothepoint.eu",
      "quote.emailEyebrow": "Automatic email",
      "quote.emailTitle": "Send the estimate",
      "quote.emailCta": "Open email",
      "quote.estimate": "Indicative estimate",
      "quote.distance": "Estimated distance: {distance}. Price to be confirmed after a technical visit.",
      "distance.under": "Under {max} km",
      "distance.between": "Between {min} and {max} km",
      "distance.over": "Over {min} km",
      "quote.noMover": "No mover found within this radius. Try 50 km, 75 km, 100 km or 125 km.",
      "quote.emailSubject": "Your corporate move estimate",
      "quote.breakPreparation": "Preparation and crew",
      "quote.breakVolume": "Furniture volume",
      "quote.breakAccess": "Building access",
      "quote.breakDistance": "Distance",
      "quote.breakIt": "IT and workstations",
      "quote.breakWeekend": "Weekend intervention",
      "quote.breakSchedule": "Timing coefficient",
      "quote.breakProviderRadius": "Provider logistics",
      "quote.breakMinimum": "Minimum project fee",
      "quote.manualReviewTitle": "Manual review advised",
      "quote.flagNotes": "Specific notes to review",
      "quote.flagLongDistance": "Long distance",
      "quote.flagDifficultAccess": "Difficult building access",
      "quote.flagAdvancedIt": "Advanced IT",
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

  // Affichage de la distance par fourchettes (paliers) plutôt qu'en décimales.
  // Une estimation à vol d'oiseau corrigée reste approximative : les paliers
  // communiquent honnêtement cette imprécision.
  function distanceBracket(km) {
    if (km < 5) return { key: "distance.under", vars: { max: 5 } };
    if (km < 10) return { key: "distance.between", vars: { min: 5, max: 10 } };
    if (km < 20) return { key: "distance.between", vars: { min: 10, max: 20 } };
    if (km < 30) return { key: "distance.between", vars: { min: 20, max: 30 } };
    if (km < 50) return { key: "distance.between", vars: { min: 30, max: 50 } };
    if (km < 75) return { key: "distance.between", vars: { min: 50, max: 75 } };
    return { key: "distance.over", vars: { min: 75 } };
  }

  function formatDistanceLabel(km) {
    const bracket = distanceBracket(km);
    return t(bracket.key, bracket.vars);
  }

  function formatMoverDistance(mover) {
    return formatDistanceLabel(mover.distance);
  }

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

  // La distance à vol d'oiseau (Haversine) sous-estime la vraie distance en camion.
  // On applique un facteur routier moyen (~1,3 en Belgique) pour rester crédible.
  const ROAD_FACTOR = 1.3;
  function roadDistanceKm(a, b) {
    return distanceKm(a, b) * ROAD_FACTOR;
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
        distance: roadDistanceKm(origin, { lat: mover.lat, lng: mover.lng })
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
    const distanceLabel = formatMoverDistance(mover);

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
          <p class="distance">${distanceLabel}</p>
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
          <div class="results-list">${limited.map((mover) => renderMoverCard(mover, { originPostalCode: normalized })).join("")}</div>
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

  function roundToTen(value) {
    return Math.round(value / 10) * 10;
  }

  function numberFromForm(values, key) {
    return Math.max(0, Number(values.get(key) || 0));
  }

  function selectVolumeRate(distance) {
    return Object.values(QUOTE_CONFIG.volumeRates).find((rate) => distance <= rate.maxKm);
  }

  function selectProviderRadiusRate(radius) {
    return QUOTE_CONFIG.providerRadius[radius] || QUOTE_CONFIG.providerRadius[35];
  }

  function quoteRange(label, low, high) {
    return {
      label,
      low: roundToTen(low),
      high: roundToTen(high)
    };
  }

  function sumRanges(blocks) {
    return blocks.reduce(
      (total, block) => ({
        low: total.low + block.low,
        high: total.high + block.high
      }),
      { low: 0, high: 0 }
    );
  }

  function calculateTripDistance(values) {
    const originCode = normalizePostalCode(values.get("origin"));
    const destinationCode = normalizePostalCode(values.get("destination"));
    const origin = postalLookup(originCode);
    const destination = postalLookup(destinationCode);
    return origin && destination ? Math.max(8, roadDistanceKm(origin, destination)) : 25;
  }

  function calculateManualFlags(values, tripDistance, accessType, itLevel) {
    const flags = [];
    if (String(values.get("notes") || "").trim()) flags.push("quote.flagNotes");
    if (tripDistance > 75) flags.push("quote.flagLongDistance");
    if (["narrow", "unavailable", "hoistRequired"].includes(accessType)) flags.push("quote.flagDifficultAccess");
    if (itLevel === "advanced") flags.push("quote.flagAdvancedIt");
    return flags;
  }

  function calculateQuote(values) {
    const workstations = numberFromForm(values, "workstations");
    const volume = numberFromForm(values, "volume");
    const floors = numberFromForm(values, "floors");
    const providerRadius = Number(values.get("radius") || 35);
    const accessType = { yes: "available", no: "unavailable" }[values.get("lift")] || values.get("lift") || "available";
    const itLevel = { yes: "standard", no: "none" }[values.get("it")] || values.get("it") || "standard";
    const scheduleType = { yes: "saturday", no: "weekday" }[values.get("weekend")] || values.get("weekend") || "weekday";
    const tripDistance = calculateTripDistance(values);
    const volumeRate = selectVolumeRate(tripDistance);
    const accessRate = QUOTE_CONFIG.access[accessType] || QUOTE_CONFIG.access.available;
    const itRate = QUOTE_CONFIG.it[itLevel] || QUOTE_CONFIG.it.standard;
    const scheduleRate = QUOTE_CONFIG.schedule[scheduleType] || QUOTE_CONFIG.schedule.weekday;
    const providerRate = selectProviderRadiusRate(providerRadius);

    const baseBlocks = [
      quoteRange(
        "quote.breakPreparation",
        QUOTE_CONFIG.team.baseLow + workstations * QUOTE_CONFIG.team.perPostLow,
        QUOTE_CONFIG.team.baseHigh + workstations * QUOTE_CONFIG.team.perPostHigh
      ),
      quoteRange("quote.breakVolume", volume * volumeRate.low, volume * volumeRate.high),
      quoteRange(
        "quote.breakAccess",
        accessRate.baseLow + floors * accessRate.floorLow,
        accessRate.baseHigh + floors * accessRate.floorHigh
      ),
      quoteRange(
        "quote.breakDistance",
        QUOTE_CONFIG.distance.baseLow + tripDistance * QUOTE_CONFIG.distance.perKmLow,
        QUOTE_CONFIG.distance.baseHigh + tripDistance * QUOTE_CONFIG.distance.perKmHigh
      ),
      quoteRange("quote.breakIt", workstations * itRate.low, workstations * itRate.high)
    ].filter((block) => block.low > 0 || block.high > 0);

    const baseTotal = sumRanges(baseBlocks);
    const providerBlock = quoteRange(
      "quote.breakProviderRadius",
      baseTotal.low * (providerRate.low - 1),
      baseTotal.high * (providerRate.high - 1)
    );
    const providerAdjusted = {
      low: baseTotal.low + providerBlock.low,
      high: baseTotal.high + providerBlock.high
    };
    const scheduleBlock = quoteRange(
      "quote.breakSchedule",
      providerAdjusted.low * (scheduleRate.low - 1),
      providerAdjusted.high * (scheduleRate.high - 1)
    );

    const blocks = [
      ...baseBlocks,
      providerBlock,
      scheduleBlock
    ].filter((block) => block.low > 0 || block.high > 0);

    const subtotal = sumRanges(blocks);
    const low = Math.max(subtotal.low, QUOTE_CONFIG.minimums.low);
    const high = Math.max(subtotal.high, QUOTE_CONFIG.minimums.high);
    const minimumBlock = quoteRange(
      "quote.breakMinimum",
      low - subtotal.low,
      high - subtotal.high
    );
    if (minimumBlock.low > 0 || minimumBlock.high > 0) blocks.push(minimumBlock);

    return {
      low: roundToTen(low),
      high: roundToTen(high),
      tripDistance,
      flags: calculateManualFlags(values, tripDistance, accessType, itLevel),
      breakdown: blocks
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
    const manualReviewText = quote.flags.length
      ? `\n${t("quote.manualReviewTitle")}:\n${quote.flags.map((flag) => `- ${t(flag)}`).join("\n")}\n`
      : "";

    return `${t("email.hello")}

${t("email.intro", { company })}

${t("email.trip", { origin, destination })}
${t("email.workstations", { value: form.get("workstations") })}
${t("email.volume", { value: form.get("volume") })}
${t("email.range", { low: euro(quote.low), high: euro(quote.high) })}

${t("email.movers")}
${moversText}
${manualReviewText}

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
    const flags = quote.flags.length
      ? `
        <div class="quote-flags">
          <strong>${t("quote.manualReviewTitle")}</strong>
          <ul>
            ${quote.flags.map((flag) => `<li>${t(flag)}</li>`).join("")}
          </ul>
        </div>
      `
      : "";

    output.innerHTML = `
      <p class="eyebrow">${t("quote.estimate")}</p>
      <div class="price-total">${euro(quote.low)} - ${euro(quote.high)}</div>
      <p class="microcopy">${t("quote.distance", { distance: formatDistanceLabel(quote.tripDistance) })}</p>
      <ul class="quote-breakdown">
        ${quote.breakdown.map((block) => `<li><span>${t(block.label)}</span><strong>${euro(block.low)} - ${euro(block.high)}</strong></li>`).join("")}
      </ul>
      ${flags}
    `;

    const originPostalCode = normalizePostalCode(values.get("origin"));
    moversOutput.innerHTML = selectedMovers.length
      ? selectedMovers.map((mover) => renderMoverCard(mover, { short: true, originPostalCode })).join("")
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
