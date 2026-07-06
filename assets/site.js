(function () {
  const coords = window.BM_POSTAL_COORDS || {};
  const movers = window.BM_MOVERS || [];
  const params = new URLSearchParams(window.location.search);
  const requestedTheme = params.get("theme");
  const state = {
    // La langue est definie par l'URL de la page (window.BM_LANG, injecte au build).
    lang: ["fr", "nl", "en"].includes(window.BM_LANG) ? window.BM_LANG : "fr",
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

  const i18n = window.BM_I18N || {};

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
    // Le <title> et la meta description sont pre-rendus par langue au build (SEO) :
    // on ne les ecrase plus cote navigateur.

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
          <img src="/identity/logo-bm-white-200-62.png" alt="Business Move">
          <h3>${t("search.promoTitle")}</h3>
          <p class="microcopy">${t("search.promoText")}</p>
          <a class="btn light" href="${(window.BM_LINKS && window.BM_LINKS.quote) || "/"}">${t("search.promoCta")}</a>
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
        const lang = button.dataset.lang;
        // On memorise la preference (la racine du site la relira) puis on navigue
        // vers la version localisee de la meme page.
        try { localStorage.setItem("bm.lang", lang); } catch (e) {}
        const urls = window.BM_PAGE_URLS || {};
        if (urls[lang] && lang !== state.lang) window.location.href = urls[lang];
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

  // --- Consentement cookies + mesure d'audience (Google Analytics) ----------
  // Charge GA UNIQUEMENT apres consentement explicite (RGPD / ePrivacy).
  // Rien ne se declenche si window.BM_GA_ID est vide : aucun cookie, aucun bandeau.
  function loadGA(id) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", id, { anonymize_ip: true });
  }

  function showConsentBanner(gaId) {
    const bar = document.createElement("div");
    bar.className = "cookie-consent";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", t("consent.text"));
    const privacyUrl = (window.BM_LINKS && window.BM_LINKS.privacy) || "/";
    bar.innerHTML =
      `<p>${t("consent.text")} <a href="${privacyUrl}">${t("consent.more")}</a></p>` +
      `<div class="cookie-consent-actions">` +
      `<button type="button" class="btn secondary" data-consent="refuse">${t("consent.refuse")}</button>` +
      `<button type="button" class="btn" data-consent="accept">${t("consent.accept")}</button>` +
      `</div>`;
    document.body.appendChild(bar);
    bar.querySelector('[data-consent="accept"]').addEventListener("click", () => {
      try { localStorage.setItem("bm.consent", "granted"); } catch (e) {}
      loadGA(gaId);
      bar.remove();
    });
    bar.querySelector('[data-consent="refuse"]').addEventListener("click", () => {
      try { localStorage.setItem("bm.consent", "denied"); } catch (e) {}
      bar.remove();
    });
  }

  function initConsent() {
    const gaId = window.BM_GA_ID;
    if (!gaId) return; // pas d'ID => site sans cookie ni bandeau (etat honnete par defaut)
    let choice = null;
    try { choice = localStorage.getItem("bm.consent"); } catch (e) {}
    if (choice === "granted") { loadGA(gaId); return; }
    if (choice === "denied") { return; }
    showConsentBanner(gaId);
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyTranslations();
    initUiPreferences();
    initSearchForm();
    initQuoteForm();
    initConsent();
  });
})();
