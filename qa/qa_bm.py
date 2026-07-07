#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
qa_gttp.py — Script de QA éditorial pour le stack Go to the Point (GTTP)

Version : v0.5 — 2 juillet 2026
Auteur : Tanguy (avec Felx)
Statut : Script QA automatisé du stack GTTP. Adapté de qa_ooyoo.py.
Couverture estimée : ~60-70 % des critères automatisables du Protocole QA
(couche 05b). Le jugement éditorial (identité, voix, vécu) reste humain.

Nouveautés v0.5 (anti-signature IA — miroir FR du dispositif EN-GB) :
    - module WATCH : mots légitimes isolément mais suspects par ACCUMULATION
      (concret, véritable, réel, clé, essentiel…). Non bloquant : compte,
      signale la répétition (≥ 3×) et l'accumulation. Miroir du §1bis EN-GB.
    - module SIGNATURE IA (niveau document, critère V-6) : détecte la
      rhétorique « générée » — antithèses binaires (« … pas …, mais/c'est … »),
      ouvertures « Mais/Or… » en cascade, exergues aphoristiques. Non bloquant :
      un motif isolé est légitime, c'est l'accumulation qui « sonne IA ».

Nouveautés v0.4 :
    - module CANEVAS T (Mode d'emploi / Check-list) : vérifie les marqueurs
      structurels du canevas T-Mode-emploi (découpage numéroté ≥ 3 unités,
      ≥ 1 check-list à cases `- [ ]`, ≥ 1 encadré ⚠️ Piège courant, critères
      de complétude « est terminée quand… », fermeture « Ce qu'il faut
      retenir »), + détection RENFORCÉE de la cat. D « faux sentiment de
      facilité » (il suffit de / tout simplement / en un clic), priorité du
      pilier T. Ne s'exécute que pour --pilier T.
    - correctif émojis : les émojis des call-outs typés des canevas Guide (I)
      et Mode d'emploi (T) — 📋 ⚠️ 📐 ⚖️ ⏱️ 💡 🔧 👁️ 📌 — sont des marqueurs
      de FORMAT, plus décoratifs. Ils sont désormais exclus du comptage du
      module_marqueurs (sinon faux positif « émoji proscrit en I/T »).

Nouveautés v0.3 :
    - module GRAS (règles de gras de l'article de blog, canevas pilier I) :
      vérifie que le 1er paragraphe du chapô (accroche) est en gras de bloc,
      et que le corps ne porte pas plus d'1 expression en gras par section
      H2 (hors chapô et hors phrases en exergue). Anti-tic de sur-gras.

Limites connues (vérifiées, non corrigées en v0.3 — passe dédiée à venir) :
    - le H1 est transformé en phrase par extraire_corps_editorial (gonfle le
      compte de phrases) ;
    - les ancrages de durée « depuis N ans / années » ne sont pas reconnus
      (ni module_eeat, ni un module d'ancrage temporel) ;
    - une liste à puces sans ponctuation finale peut être agrégée en une
      seule fausse « phrase trop longue » ;
    - une question en gras `**…?**` peut fusionner avec la phrase suivante
      (le découpeur exige `?` + espace + majuscule).

Nouveautés v0.2 :
    - module SEO : vérifie les micro-contenus obligatoires du frontmatter
      (seo_title 50-60 car., seo_meta_description 150-160 car., seo_slug),
      + présence du mot-clé dans title/slug (canevas pilier I, section 7)
    - correctif : le frontmatter est retiré avant les modules structure /
      hiérarchie / picat / mot-clé (un commentaire YAML "# ..." était lu
      comme un H1, les longues valeurs comme des phrases)
    - correctif : les blockquotes ne créent plus de faux "phrase trop longue"

Usage :
    python qa_gttp.py <fichier.md|.txt|.html> [--pilier P|I|C|T]
                                              [--motcle "mot-clé principal"]
                                              [--format md|json|both]
                                              [--output rapport.md]

Articulation avec le stack :
    - 05b Protocole QA   : définit les critères et seuils (familles 1 à 7)
    - 05a Grille E-E-A-T  : critères de crédibilité (renvoi)
    - 02 Blacklist v0.1   : catégories A-D, vigilance, méta-règle PICAT
    - 03 Glossaire v0.1   : vocabulaire métier prescrit (5 domaines)
    - 01 Brand Voice      : seuils de rythme (institutionnel incarné, ample)

Spécificités GTTP par rapport à OoyoO :
    - Détecteur d'EXCEPTION VERBATIM (critère L-2) : un terme proscrit
      ENTRE GUILLEMETS pour citer un client est admis (signalé, non bloqué).
    - Détecteur PICAT (critère M-1, bloquant) : alerte sur "Promotionnel" /
      "Aspirationnel".
"""

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path


# =============================================================================
# CONFIGURATION
# =============================================================================

PILIERS_VALIDES = {"P", "I", "C", "T"}

# Seuils de rythme — voix GTTP "institutionnel incarné", rythme AMPLE (couche 01).
# Phrases plus longues tolérées qu'OoyoO : le registre soutenu assume l'amplitude.
SEUILS_RYTHME = {
    "P": {"phrase_moyenne_max": 24, "phrase_max": 32},
    "I": {"phrase_moyenne_max": 28, "phrase_max": 38},
    "C": {"phrase_moyenne_max": 22, "phrase_max": 30},
    "T": {"phrase_moyenne_max": 24, "phrase_max": 32},
}

# Densité minimale de vocabulaire métier (critère G-1), pour 1000 mots.
# I et T sont les piliers d'expertise : exigence plus haute.
SEUILS_GLOSSAIRE_MIN = {
    "P": 2,   # landing page : on reste accessible
    "I": 4,   # dossier de fond : expertise visible
    "C": 1,   # post LinkedIn : parcimonie
    "T": 5,   # livrable technique : densité élevée
}

SEUILS_PONCTUATION = {
    "P": {"exclamations_max": 1},
    "I": {"exclamations_max": 0},
    "C": {"exclamations_max": 2},
    "T": {"exclamations_max": 0},
}


# =============================================================================
# BLACKLIST v0.1 — données embarquées (couche 02)
# =============================================================================

# Catégorie A — Faux-amis sectoriels du métier (cœur GTTP, proscrits tous piliers)
BLACKLIST_A = [
    r"\brelocations?\b",
    r"\bopen[\s-]?space repensés?\b",
    r"\bespaces? de demain\b",
    r"\bbureaux? du futur\b",
    r"\blieux? de vie\b",
    r"\bexpérience collaborateur\b",
    r"\bbien[\s-]?être au travail\b",
    r"\bQVC?T\b",
    r"\bnouvelle génération\b",
    r"\benvironnements? de travail inspirants?\b",
]

# Catégorie B — Clichés du marketing générique
BLACKLIST_B = [
    r"\bsur[\s-]?mesure\b",
    r"\bclé en main\b",
    r"\bà 360°?\b",
    r"\bleaders?\b",
    r"\bpartenaires? de confiance\b",
    r"\bau cœur de\b",
    r"\bécosystèmes?\b",
    r"\bsynergies?\b",
    r"\bADN\b",
    r"\bpassionnée?s?\b",
    r"\bincontournables?\b",
]

# Catégorie C — Marqueurs LLM et tournures de remplissage
BLACKLIST_C = [
    r"\bdans un monde où\b",
    r"\bà l'ère de\b",
    r"\bil convient de noter\b",
    r"\bforce est de constater\b",
    r"\ben effet\b",
    r"\bpar ailleurs\b",
    r"\ben outre\b",
    r"\bplonger dans\b",
    r"\bexplorer en profondeur\b",
    r"\btransformer le paysage\b",
    r"\bredéfinir\b",
    r"\blibérer le potentiel\b",
    r"\bn'hésitez pas à\b",
    r"\bque vous soyez\b",
]

# Catégorie D — Glissements de posture (registre & ton)
BLACKLIST_D = [
    r"\brévolutionn\w+\b",
    r"\brévolutions?\b",
    r"\bboostez?\b",
    r"\bdopez?\b",
    r"\bgame[\s-]?changers?\b",
    r"\bdisruptifs?\b",
    r"\btout simplement\b",
    r"\bil suffit de\b",
    r"\ben un clic\b",
    r"\bcomme vous le savez\b",
    r"\bévidemment\b",
    r"\bpetit conseil\b",
    r"\bon vous explique tout\b",
]

# Section Vigilance — termes à qualifier (non bloquants, signalés)
VIGILANCE = [
    r"\bopen[\s-]?space\b",
    r"\boptimisations?\b",
    r"\baccompagnements?\b",
    r"\bstratégiques?\b",
    r"\bmodernes?\b",
    r"\bcontemporaine?s?\b",
    r"\bpremium\b",
]

# Section WATCH (couche 02, miroir du §1bis EN-GB) — mots légitimes isolément
# mais suspects par ACCUMULATION. NON bloquant : on compte par lemme, on signale
# la répétition (>= SEUIL_WATCH) et l'accumulation globale. Clé = lemme affiché.
SEUIL_WATCH = 3
WATCH_FR = {
    "concret": r"\bconcr[èe]te?s?\b",
    "véritable": r"\bvéritables?\b",
    "réel": r"\bré(?:el|elle)s?\b",
    "clé": r"\bclés?\b",
    "essentiel": r"\bessentielle?s?\b",
    "crucial": r"\bcrucial(?:e|es|s)?\b|\bcruciaux\b",
    "majeur": r"\bmajeure?s?\b",
    "significatif": r"\bsignificati(?:f|fs|ve|ves)\b",
    "notable": r"\bnotables?\b",
    "pertinent": r"\bpertinente?s?\b",
    "fondamental": r"\bfondamental(?:e|es)?\b|\bfondamentaux\b",
    "authentique": r"\bauthentiques?\b",
    "profond": r"\bprofonde?s?\b",
    "puissant": r"\bpuissante?s?\b",
    "précieux": r"\bprécieux\b|\bprécieuse?s?\b",
    "unique": r"\buniques?\b",
    "remarquable": r"\bremarquables?\b",
}

# Catégorie A : faux-amis tolérés ENTRE GUILLEMETS (exception verbatim, L-2).
# Tous les termes de la cat. A peuvent être cités ; on liste ici ceux
# qu'un client dit réellement (couche 04, zone Entend).
TERMES_VERBATIM_TOLERES = BLACKLIST_A  # tout terme cat. A admis si cité

# Modulations PICAT : pour GTTP v0.1, les 4 catégories sont strictes partout
# (pilier A non mobilisé). On garde la structure pour évolution future.
CATEGORIES_STRICTES = {"A", "B", "C", "D"}

# Émojis STRUCTURELS des call-outs typés des canevas Guide (pilier I) et
# Mode d'emploi (pilier T). Ce sont des marqueurs de FORMAT, pas des émojis
# décoratifs : exclus du comptage du module_marqueurs (sinon faux positif
# « émoji proscrit en I/T » sur les livrables qui les utilisent légitimement).
# On stocke les caractères de base (sans sélecteur de variante U+FE0F).
CALLOUTS_STRUCTURELS = set("📋⚠📐⚖⏱💡🔧👁📌")


# =============================================================================
# GLOSSAIRE v0.1 — vocabulaire métier prescrit (couche 03, 5 domaines)
# =============================================================================

# Acronymes : matching SENSIBLE À LA CASSE pour éviter les faux positifs
# (ex. "MOA"/"PRO"/"DET" ne doivent pas matcher un mot courant).
TERMES_GLOSSAIRE_ACRONYMES = [
    "AMO", "MOA", "MOE", "CCTP", "ESQ", "APS", "APD", "PRO", "DET",
    "PMR", "ERP",
]

# Termes pleins : matching insensible à la casse.
TERMES_GLOSSAIRE_PLEINS = [
    # Cat. 1 — Gestion de projet
    "assistance à maîtrise d'ouvrage", "maîtrise d'ouvrage", "maîtrise d'œuvre",
    "cahier des charges", "appel d'offres", "appels d'offres",
    # Cat. 2 — Architecture & aménagement
    "programme", "esquisse", "avant-projet", "surface utile",
    "plateau de bureaux", "test fit", "flex office", "flex desk",
    # Cat. 3 — Conduite du changement
    "conduite du changement", "kübler-ross", "kubler-ross",
    "sponsoring", "agents du changement",
    # Cat. 4 — Réglementaire & technique
    "mobilité réduite", "établissement recevant du public",
    "décommissionnement", "accessibilité",
    # Cat. 5 — Phases & livrables
    "direction de l'exécution des travaux", "réception de chantier",
    "after care", "jour j", "déménagement d'entreprise",
]


# =============================================================================
# UTILITAIRES — extraction et nettoyage
# =============================================================================

def lire_fichier(chemin):
    p = Path(chemin)
    if not p.exists():
        sys.exit(f"Erreur : fichier introuvable : {chemin}")
    return p.read_text(encoding="utf-8")


def extraire_corps_editorial(texte):
    """
    Extrait le corps éditorial en retirant frontmatter, blocs de code,
    titres markdown, italiques de note, balises HTML, liens et images.
    Conserve les guillemets (nécessaires au détecteur verbatim).
    """
    texte = re.sub(r"^---\n.*?\n---\n", "", texte, count=1, flags=re.DOTALL)
    texte = re.sub(r"```.*?```", "", texte, flags=re.DOTALL)
    texte = re.sub(r"`[^`]+`", "", texte)
    # Blockquotes (citations en exergue) : on retire le marqueur '> ' mais on
    # ISOLE la citation comme paragraphe distinct (double saut avant/après),
    # pour qu'elle ne soit pas fusionnée avec la phrase précédente -> sinon
    # faux positif "phrase trop longue" (S-1/V-2).
    texte = re.sub(r"(?:^>.*\n?)+", lambda m: "\n\n" + m.group(0).replace("> ", "").replace(">", "") + "\n\n",
                   texte, flags=re.MULTILINE)
    texte = re.sub(r"^#+\s+(.+)$", r"\1.\n", texte, flags=re.MULTILINE)
    texte = re.sub(r"<[^>]+>", "", texte)
    texte = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", texte)
    texte = re.sub(r"!\[[^\]]*\]\([^\)]+\)", "", texte)
    texte = re.sub(r"^---\s*$", "", texte, flags=re.MULTILINE)
    return texte.strip()


def extraire_frontmatter(texte):
    """
    Extrait les champs du frontmatter YAML (parsing simple clé: valeur,
    suffisant pour les champs SEO ; ignore les commentaires inline #...).
    Retourne un dict {clé: valeur}.
    """
    m = re.match(r"^---\n(.*?)\n---", texte, flags=re.DOTALL)
    if not m:
        return {}
    champs = {}
    for ligne in m.group(1).split("\n"):
        mm = re.match(r"^([a-zA-Z0-9_]+)\s*:\s*(.+)$", ligne)
        if mm:
            cle = mm.group(1)
            val = mm.group(2).strip()
            val = re.sub(r"\s+#.*$", "", val)          # retire commentaire inline
            val = val.strip().strip('"').strip("'")     # retire guillemets
            champs[cle] = val
    return champs


def module_seo_microcontenus(frontmatter, motcle=None):
    """
    Vérifie les micro-contenus SEO obligatoires (canevas pilier I, section 7) :
    seo_title (50-60 car.), seo_meta_description (150-160 car.), seo_slug.
    """
    res = {}

    title = frontmatter.get("seo_title", "")
    n = len(title)
    statut = "ok"
    if not title:
        statut = "violation"
    elif n < 40 or n > 65:
        statut = "signalement"
    res["seo_title"] = {"valeur": title, "longueur": n, "cible": "50-60", "statut": statut}

    desc = frontmatter.get("seo_meta_description", "")
    n = len(desc)
    statut = "ok"
    if not desc:
        statut = "violation"
    elif n < 140 or n > 165:
        statut = "signalement"
    res["seo_meta_description"] = {"valeur": desc, "longueur": n, "cible": "150-160", "statut": statut}

    slug = frontmatter.get("seo_slug", "")
    statut = "ok"
    if not slug:
        statut = "violation"
    elif not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", slug):
        statut = "signalement"  # majuscules, accents ou espaces dans le slug
    res["seo_slug"] = {"valeur": slug, "statut": statut}

    # Présence du mot-clé dans title et slug (si motcle fourni)
    if motcle:
        mc_tokens = [t for t in re.split(r"\W+", motcle.lower()) if len(t) > 2]
        res["motcle_dans_title"] = all(t in title.lower() for t in mc_tokens) if title else False
        slug_norm = slug.lower().replace("-", " ")
        res["motcle_dans_slug"] = all(t in slug_norm for t in mc_tokens) if slug else False

    return res


def decouper_phrases(texte):
    abrev = [r"M\.", r"Mme\.", r"Dr\.", r"Pr\.", r"St\.", r"av\.",
             r"etc\.", r"cf\.", r"ex\.", r"p\.", r"vs\.", r"n°"]
    for a in abrev:
        texte = re.sub(a, a.replace(".", "<DOT>"), texte)
    phrases = re.split(r"(?<=[.!?])\s+(?=[A-ZÀÉÈÊÔÎÛÇŒÆ])", texte)
    phrases = [p.replace("<DOT>", ".").strip() for p in phrases]
    return [p for p in phrases if p]


def decouper_paragraphes(texte):
    return [p.strip() for p in re.split(r"\n\s*\n", texte) if p.strip()]


def compter_mots(texte):
    return len(re.findall(r"\b\w+\b", texte, flags=re.UNICODE))


def detecter_cesure(phrase):
    return any(c in phrase for c in [";", ":", "—", "–", "(", ")"])


def positions_entre_guillemets(texte):
    """
    Retourne la liste des intervalles (début, fin) du texte situés entre
    guillemets (« … » français ou "…" droits). Sert au critère L-2 :
    un terme proscrit dans un de ces intervalles est une CITATION (verbatim),
    pas un emploi en propre.
    """
    intervalles = []
    for m in re.finditer(r"«[^»]*»", texte):
        intervalles.append((m.start(), m.end()))
    for m in re.finditer(r'"[^"]+"', texte):
        intervalles.append((m.start(), m.end()))
    return intervalles


def est_dans_guillemets(position, intervalles):
    return any(deb <= position < fin for deb, fin in intervalles)


# =============================================================================
# MODULE BLACKLIST — catégories A-D + exception verbatim (L-1, L-2)
# =============================================================================

def module_blacklist(texte):
    """
    Applique les catégories A à D. Pour chaque occurrence, vérifie si elle
    est ENTRE GUILLEMETS (exception verbatim, critère L-2).
    - hors guillemets -> "violation"
    - entre guillemets et terme de cat. A -> "verbatim_admis" (signalé)
    - entre guillemets autre catégorie -> "verbatim_a_verifier" (signalé)
    """
    intervalles = positions_entre_guillemets(texte)
    categories = {
        "A": (BLACKLIST_A, "Faux-amis sectoriels du métier"),
        "B": (BLACKLIST_B, "Clichés du marketing générique"),
        "C": (BLACKLIST_C, "Marqueurs LLM et remplissage"),
        "D": (BLACKLIST_D, "Glissements de posture"),
    }
    resultats = {}
    for cle, (patterns, libelle) in categories.items():
        violations = []
        for pattern in patterns:
            for match in re.finditer(pattern, texte, flags=re.IGNORECASE):
                dans_guillemets = est_dans_guillemets(match.start(), intervalles)
                if dans_guillemets:
                    statut = "verbatim_admis" if cle == "A" else "verbatim_a_verifier"
                else:
                    statut = "violation"
                violations.append({
                    "categorie": cle,
                    "terme": match.group(0),
                    "position": match.start(),
                    "statut": statut,
                })
        resultats[cle] = {
            "libelle": libelle,
            "violations": violations,
            "count_violation": sum(1 for v in violations if v["statut"] == "violation"),
            "count_verbatim": sum(1 for v in violations if v["statut"].startswith("verbatim")),
        }
    return resultats


def module_vigilance(texte):
    occurrences = []
    for pattern in VIGILANCE:
        for match in re.finditer(pattern, texte, flags=re.IGNORECASE):
            occurrences.append({"terme": match.group(0), "position": match.start()})
    return occurrences


# =============================================================================
# MODULE WATCH — mots à surveiller par ACCUMULATION (V-6, non bloquant)
# =============================================================================

def module_watch(texte):
    """
    Compte les mots WATCH (hors guillemets). NON bloquant : signale la
    répétition d'un même lemme (>= SEUIL_WATCH) et l'accumulation globale.
    Miroir du §1bis EN-GB : un mot isolé est légitime, c'est la répétition /
    l'entassement qui « sonne texte gonflé ou généré ».
    """
    intervalles = positions_entre_guillemets(texte)
    comptes = {}
    for lemme, pattern in WATCH_FR.items():
        n = 0
        for m in re.finditer(pattern, texte, flags=re.IGNORECASE):
            if not est_dans_guillemets(m.start(), intervalles):
                n += 1
        if n:
            comptes[lemme] = n
    total = sum(comptes.values())
    repetes = {l: n for l, n in comptes.items() if n >= SEUIL_WATCH}
    return {
        "comptes": comptes,
        "distincts": len(comptes),
        "total": total,
        "repetes": repetes,
        "statut": "signalement" if (repetes or total >= 8) else "ok",
    }


# =============================================================================
# MODULE SIGNATURE IA — rhétorique de niveau document (V-6, non bloquant)
# =============================================================================

def module_signature_ia(texte_editorial, texte_brut):
    """
    Détecte la rhétorique « générée » à l'échelle du document. NON bloquant :
    un motif isolé est efficace ; c'est l'ACCUMULATION qui trahit l'assistance IA.
      - antithèses binaires « … pas …, (mais|c'est) … » ;
      - ouvertures « Mais/Or/Pourtant… » sur phrase courte (rythme antithétique) ;
      - exergues aphoristiques (blockquotes courts à retournement / deux-points).
    """
    phrases = decouper_phrases(texte_editorial)
    PIVOT = r"\b(?:mais|c['’]est|il est|elle est|ils sont|elles sont|ce sont)\b"
    ETRE = r"\b(?:est|sont|es|été|être|suis|êtes|sommes)\b"

    antitheses = []
    # (a) intra-phrase : « … pas …, (mais|c'est|il est) … »
    for ph in phrases:
        if re.search(r"\bpas\b[^.!?]{0,90}?" + PIVOT, ph, re.I) \
           or re.search(r"\bnon\s+pas\b[^.!?]{0,70}?\bmais\b", ph, re.I):
            antitheses.append(ph[:90])
    # (b) inter-phrases : « X n'est pas … . [Pronom] est / C'est … » (retournement
    #     aphoristique classique, à cheval sur deux phrases).
    for i in range(len(phrases) - 1):
        a, b = phrases[i], phrases[i + 1]
        a_neg = re.search(r"\bn['’](?:est|ont)\b.{0,40}\bpas\b|\bne\s+\w+\s+pas\b", a, re.I)
        b_ret = re.match(r"^(?:Elle|Il|Ils|Elles|C['’]|Ce|On)\b.*" + ETRE, b) or \
                re.match(r"^Mais\b", b)
        if a_neg and b_ret and compter_mots(b) <= 22:
            antitheses.append((a[-45:] + " ‖ " + b[:45]))

    mais_openers = []
    for ph in phrases:
        if re.match(r"^(?:Mais|Or|Pourtant|Et)\b", ph) and compter_mots(ph) <= 14:
            mais_openers.append(ph[:90])

    # Exergues aphoristiques (blockquotes) : maxime à négation + être, retournement
    # deux-points, ou tricolon symétrique — les 3 signatures de la punchline générée.
    aphorismes = []
    for m in re.finditer(r"(?m)^>\s?(.+)$", texte_brut):
        exergue = m.group(1).strip()
        if not exergue:
            continue
        neg_etre = re.search(r"\bpas\b", exergue, re.I) and re.search(ETRE, exergue, re.I)
        colon = ":" in exergue and compter_mots(exergue) <= 30
        sub = [s for s in re.split(r"[.!?]", exergue) if compter_mots(s) >= 2]
        tricolon = len(sub) >= 3 and all(compter_mots(s) <= 12 for s in sub)
        if neg_etre or colon or tricolon:
            aphorismes.append(exergue[:100])

    total = len(antitheses) + len(mais_openers) + len(aphorismes)
    statut = "ok"
    if len(antitheses) >= 3 or len(aphorismes) >= 2 or total >= 5:
        statut = "signalement"
    return {
        "antitheses": antitheses,
        "mais_openers": mais_openers,
        "aphorismes": aphorismes,
        "total": total,
        "statut": statut,
    }


# =============================================================================
# MODULE MÉTA-RÈGLE PICAT — critère M-1 (bloquant)
# =============================================================================

def module_picat(texte):
    """
    Détecte les gloses fautives de PICAT : P = Promotionnel, A = Aspirationnel.
    Critère M-1, bloquant. Cherche les mots interdits à proximité d'un P/A
    isolé, ou les expressions explicites.
    """
    patterns_fautifs = [
        r"\bpromotionnel\b",
        r"\baspirationnel\b",
        r"P\s*[=:]\s*promotionnel",
        r"A\s*[=:]\s*aspirationnel",
    ]
    violations = []
    for pattern in patterns_fautifs:
        for match in re.finditer(pattern, texte, flags=re.IGNORECASE):
            violations.append({"terme": match.group(0), "position": match.start()})
    return {
        "violations": violations,
        "statut": "violation" if violations else "ok",
    }


# =============================================================================
# MODULE GRAS — règles de gras de l'article de blog (canevas pilier I)
# =============================================================================

def module_gras(texte):
    """
    Vérifie les deux règles de gras de l'article de blog GTTP :
    - le 1er paragraphe du chapô (accroche) est composé EN GRAS DE BLOC ;
    - dans le corps, AU MAXIMUM 1 expression en gras par section H2,
      hors chapô et hors phrases en exergue (blockquotes).
    Opère sur le Markdown brut (sans frontmatter) : le gras `**…**` et les
    titres `#`/`##` sont nécessaires ici (ils sont retirés du corps éditorial).
    """
    lignes = texte.split("\n")
    SPAN = re.compile(r"\*\*[^*]+\*\*")

    # --- 1) Chapô : 1er paragraphe après le H1, en gras de bloc -------------
    idx_h1 = None
    for i, l in enumerate(lignes):
        if re.match(r"^#\s+", l):
            idx_h1 = i
            break

    chapo_para = None
    i = (idx_h1 + 1) if idx_h1 is not None else 0
    while i < len(lignes):
        s = lignes[i].strip()
        if not s:
            i += 1
            continue
        # on saute titres, exergues, tableaux, images, balises, blocs de code
        # et les vraies puces (`- `, `* `, `+ `) — mais PAS le gras `**…**`,
        # qui commence par `*` sans espace et doit être reconnu comme chapô.
        if s.startswith(("#", ">", "|", "```", "![", "<")) or re.match(r"^[-*+]\s", s):
            i += 1
            continue
        # premier paragraphe textuel = chapô ; on agrège jusqu'à une ligne vide
        bloc = []
        while i < len(lignes) and lignes[i].strip():
            bloc.append(lignes[i].strip())
            i += 1
        chapo_para = " ".join(bloc)
        break

    # accroche en gras de bloc = paragraphe encadré par un unique span **…**
    chapo_en_gras = bool(
        chapo_para
        and chapo_para.startswith("**")
        and chapo_para.endswith("**")
        and chapo_para.count("**") == 2
    )
    if chapo_para is None:
        statut_chapo = "signalement"   # chapô introuvable : à vérifier à l'œil
    else:
        statut_chapo = "ok" if chapo_en_gras else "violation"

    # --- 2) Gras de corps : ≤ 1 expression par section H2 ------------------
    sections = []
    courante = None
    for l in lignes:
        if re.match(r"^##\s+", l):            # ouverture d'une section H2
            if courante is not None:
                sections.append(courante)
            courante = {"titre": re.sub(r"^#+\s+", "", l).strip(), "lignes": []}
        elif re.match(r"^#\s+", l):           # H1 : on n'est pas (plus) en section
            if courante is not None:
                sections.append(courante)
            courante = None
        elif courante is not None:
            courante["lignes"].append(l)
    if courante is not None:
        sections.append(courante)

    sections_surchargees = []
    for sec in sections:
        n_gras = 0
        for l in sec["lignes"]:
            if l.lstrip().startswith(">"):    # exergue (blockquote) : exclue
                continue
            n_gras += len(SPAN.findall(l))
        if n_gras > 1:
            sections_surchargees.append({"titre": sec["titre"], "count": n_gras})

    return {
        "chapo": {
            "trouve": chapo_para is not None,
            "en_gras": chapo_en_gras,
            "statut": statut_chapo,
            "extrait": (chapo_para[:80] + "…") if chapo_para and len(chapo_para) > 80 else (chapo_para or ""),
        },
        "corps": {
            "nb_sections_h2": len(sections),
            "sections_surchargees": sections_surchargees,
            "statut": "signalement" if sections_surchargees else "ok",
        },
    }


# =============================================================================
# MODULE CANEVAS T — Mode d'emploi / Check-list (pilier T, famille 6)
# =============================================================================

def module_canevas_T_Mode_emploi(texte):
    """
    Vérifie les marqueurs structurels du canevas T-Mode-emploi (pilier T) :
      - découpage en unités numérotées (≥ 3 étapes/questions) ;
      - au moins une check-list à cases à cocher (`- [ ]`) ;
      - au moins un encadré ⚠️ Piège courant (valeur ajoutée propre au T) ;
      - critères de complétude (« est terminée quand… ») ;
      - section de fermeture « Ce qu'il faut retenir » ;
      - détection RENFORCÉE de la cat. D « faux sentiment de facilité »
        (priorité du pilier T : minimiser le coût d'une étape est dangereux).
    Opère sur le Markdown sans frontmatter. Ne s'exécute que pour --pilier T.
    """
    res = {}

    # 1) Découpage numéroté : H2/H3 « Étape/Question N », ou « N. » en titre,
    #    ou listes ordonnées « 1. » / « 1) » en début de ligne.
    unites = re.findall(
        r"(?im)^#{2,3}\s+(?:étape|question)\s*\d+"
        r"|^#{2,3}\s+\d+[.\)]"
        r"|^\s*\d+[.\)]\s+\S",
        texte)
    res["unites_numerotees"] = {
        "count": len(unites),
        "statut": "ok" if len(unites) >= 3 else "signalement",
    }

    # 2) Check-list à cases à cocher
    cases = re.findall(r"(?m)^\s*[-*]\s+\[[ xX]\]\s+\S", texte)
    res["check_list"] = {
        "count": len(cases),
        "statut": "ok" if cases else "signalement",
    }

    # 3) Encadré ⚠️ Piège courant
    pieges = re.findall(r"(?i)piège courant", texte)
    res["piege_courant"] = {
        "count": len(pieges),
        "statut": "ok" if pieges else "signalement",
    }

    # 4) Critères de complétude
    completude = re.findall(
        r"(?i)(?:est|sont)\s+terminée?s?\s+quand"
        r"|vous\s+avez\s+terminé"
        r"|passez\s+à\s+l.?étape\s+suivante\s+quand",
        texte)
    res["criteres_completude"] = {
        "count": len(completude),
        "statut": "ok" if completude else "signalement",
    }

    # 5) Fermeture « Ce qu'il faut retenir » (apostrophe droite ou courbe)
    retenir = bool(re.search(r"(?i)ce qu.?il faut retenir", texte))
    res["ce_qu_il_faut_retenir"] = {
        "present": retenir,
        "statut": "ok" if retenir else "signalement",
    }

    # 6) Cat. D renforcée — faux sentiment de facilité (hors guillemets)
    intervalles = positions_entre_guillemets(texte)
    facilite = []
    for pat in [r"\bil suffit de\b", r"\btout simplement\b", r"\ben un clic\b",
                r"\brien de plus simple\b", r"\bfacile et rapide\b"]:
        for m in re.finditer(pat, texte, flags=re.IGNORECASE):
            if not est_dans_guillemets(m.start(), intervalles):
                facilite.append(m.group(0))
    res["cat_D_facilite"] = {
        "occurrences": facilite,
        "count": len(facilite),
        "statut": "violation" if facilite else "ok",
    }

    return res


# =============================================================================
# MODULE STRUCTURE — rythme, césures, retours à la ligne durs (S-1, V-2)
# =============================================================================

def module_structure(texte_editorial, texte_brut, pilier):
    phrases = decouper_phrases(texte_editorial)
    paragraphes = decouper_paragraphes(texte_editorial)
    seuils = SEUILS_RYTHME[pilier]

    longueurs = [compter_mots(p) for p in phrases]
    longueur_moyenne = sum(longueurs) / len(longueurs) if longueurs else 0
    longueur_max = max(longueurs) if longueurs else 0

    phrases_longues = []
    for i, phrase in enumerate(phrases):
        if compter_mots(phrase) > seuils["phrase_max"] and not detecter_cesure(phrase):
            phrases_longues.append({
                "position": i,
                "longueur": compter_mots(phrase),
                "extrait": phrase[:80] + ("..." if len(phrase) > 80 else ""),
            })

    # S-1 — retour à la ligne dur au milieu d'une phrase (sur le texte brut).
    # Heuristique : une ligne non vide qui ne se termine pas par une
    # ponctuation forte ou un marqueur markdown, suivie d'une ligne qui
    # commence par une minuscule -> césure de phrase probable.
    coupures_dures = []
    lignes = texte_brut.split("\n")
    for i in range(len(lignes) - 1):
        cur = lignes[i].rstrip()
        nxt = lignes[i + 1].lstrip()
        if not cur or not nxt:
            continue
        if cur.lstrip().startswith(("#", "-", "*", ">", "|", "```")):
            continue
        if nxt.startswith(("#", "-", "*", ">", "|", "```")):
            continue
        if cur[-1] not in ".!?:;…»\"" and nxt[:1].islower():
            coupures_dures.append({
                "ligne": i + 1,
                "extrait": (cur[-40:] + " ⏎ " + nxt[:40]),
            })

    return {
        "nb_phrases": len(phrases),
        "nb_paragraphes": len(paragraphes),
        "longueur_moyenne": round(longueur_moyenne, 1),
        "longueur_max": longueur_max,
        "seuil_moyenne": seuils["phrase_moyenne_max"],
        "seuil_max": seuils["phrase_max"],
        "phrases_longues_sans_cesure": phrases_longues,
        "coupures_dures": coupures_dures,
    }


# =============================================================================
# MODULE MARQUEURS — ponctuation, em-dash, ellipses pub (V-5, S-3)
# =============================================================================

def module_marqueurs(texte, pilier):
    resultats = {}

    exclamations = re.findall(r"!", texte)
    seuil_excl = SEUILS_PONCTUATION[pilier]["exclamations_max"]
    resultats["exclamations"] = {
        "count": len(exclamations),
        "seuil": seuil_excl,
        "statut": "violation" if len(exclamations) > seuil_excl else "ok",
    }

    nb_mots = compter_mots(texte)
    em_dashes = re.findall(r"—", texte)
    densite_em = len(em_dashes) / nb_mots if nb_mots else 0
    statut_em = "ok"
    if densite_em > 0.005:
        statut_em = "signalement"
    if densite_em > 0.01:
        statut_em = "violation"
    resultats["em_dashes"] = {
        "count": len(em_dashes),
        "densite_pour_1000_mots": round(densite_em * 1000, 2),
        "statut": statut_em,
    }

    # Émojis (proscrits en I et T) — plage Unicode large.
    # Les émojis des call-outs typés (Guide I / Mode d'emploi T) sont des
    # marqueurs de FORMAT, pas décoratifs : on les retire avant comptage.
    emojis = re.findall(r"[\U0001F000-\U0001FAFF☀-➿]", texte)
    emojis = [e for e in emojis if e not in CALLOUTS_STRUCTURELS]
    statut_emoji = "ok"
    if emojis and pilier in ("I", "T"):
        statut_emoji = "violation"
    elif emojis:
        statut_emoji = "signalement"
    resultats["emojis"] = {
        "count": len(emojis),
        "statut": statut_emoji,
    }

    # Ellipses publicitaires : suite de phrases nominales très courtes (< 4 mots)
    phrases = decouper_phrases(texte)
    courtes_consecutives = 0
    max_consecutives = 0
    for p in phrases:
        if compter_mots(p) <= 3:
            courtes_consecutives += 1
            max_consecutives = max(max_consecutives, courtes_consecutives)
        else:
            courtes_consecutives = 0
    resultats["ellipses_publicitaires"] = {
        "max_phrases_courtes_consecutives": max_consecutives,
        "statut": "signalement" if max_consecutives >= 3 else "ok",
    }

    return resultats


# =============================================================================
# MODULE GLOSSAIRE — densité de vocabulaire métier (G-1)
# =============================================================================

def module_glossaire(texte, pilier):
    nb_mots = compter_mots(texte)
    if nb_mots == 0:
        return {"count": 0, "statut": "ok"}

    occurrences = 0
    termes_detectes = defaultdict(int)

    for acro in TERMES_GLOSSAIRE_ACRONYMES:
        matches = re.findall(r"\b" + re.escape(acro) + r"\b", texte)  # sensible à la casse
        if matches:
            occurrences += len(matches)
            termes_detectes[acro] = len(matches)

    for terme in TERMES_GLOSSAIRE_PLEINS:
        matches = re.findall(r"\b" + re.escape(terme) + r"\b", texte, flags=re.IGNORECASE)
        if matches:
            occurrences += len(matches)
            termes_detectes[terme] = len(matches)

    densite_pour_1000 = (occurrences / nb_mots) * 1000
    seuil_min = SEUILS_GLOSSAIRE_MIN[pilier]
    statut = "ok" if densite_pour_1000 >= seuil_min else "signalement"

    return {
        "count": occurrences,
        "nb_termes_uniques": len(termes_detectes),
        "termes_detectes": dict(termes_detectes),
        "densite_pour_1000_mots": round(densite_pour_1000, 2),
        "seuil_min_pour_1000": seuil_min,
        "statut": statut,
    }


# =============================================================================
# MODULE STRUCTURE HTML/MARKDOWN — hiérarchie des titres (S-2)
# =============================================================================

def module_hierarchie(texte):
    h1 = len(re.findall(r"^#\s+", texte, flags=re.MULTILINE)) + len(re.findall(r"<h1[^>]*>", texte, re.I))
    h2 = len(re.findall(r"^##\s+", texte, flags=re.MULTILINE)) + len(re.findall(r"<h2[^>]*>", texte, re.I))
    h3 = len(re.findall(r"^###\s+", texte, flags=re.MULTILINE)) + len(re.findall(r"<h3[^>]*>", texte, re.I))
    h4 = len(re.findall(r"^####\s+", texte, flags=re.MULTILINE)) + len(re.findall(r"<h4[^>]*>", texte, re.I))

    violations = []
    if h1 > 1:
        violations.append(f"plusieurs H1 détectés ({h1})")
    if h4 > 0 and h3 == 0:
        violations.append(f"H4 sans H3 parent ({h4})")

    return {
        "nb_h1": h1, "nb_h2": h2, "nb_h3": h3, "nb_h4_ou_plus": h4,
        "violations": violations,
        "statut": "violation" if h1 > 1 else ("signalement" if violations else "ok"),
    }


# =============================================================================
# MODULE MOT-CLÉ — présence stratégique (E-1 / SEO)
# =============================================================================

def module_motcle(texte_brut, motcle):
    if not motcle:
        return {"statut": "non_applicable"}

    nb_mots = compter_mots(texte_brut)
    occurrences = len(re.findall(r"\b" + re.escape(motcle) + r"\b", texte_brut, flags=re.IGNORECASE))
    densite = occurrences / nb_mots if nb_mots else 0

    h1_match = re.search(r"^#\s+(.+)$", texte_brut, flags=re.MULTILINE)
    presence_h1 = bool(h1_match and re.search(r"\b" + re.escape(motcle) + r"\b", h1_match.group(1), re.I))

    statut = "ok"
    if densite > 0.03:
        statut = "violation"  # bourrage
    elif densite < 0.003:
        statut = "signalement"
    if not presence_h1:
        statut = "signalement" if statut == "ok" else statut

    return {
        "motcle": motcle,
        "occurrences": occurrences,
        "densite_pct": round(densite * 100, 2),
        "presence_h1": presence_h1,
        "statut": statut,
    }


# =============================================================================
# MODULE E-E-A-T basique — dates et sources (E-1, E-2)
# =============================================================================

def module_eeat(texte):
    # Dates : année sur 4 chiffres, ou jour/mois français
    dates = re.findall(r"\b(?:19|20)\d{2}\b", texte)
    mois = re.findall(r"\b\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|"
                      r"août|septembre|octobre|novembre|décembre)\b", texte, re.I)
    # Chiffres "situés" (surfaces, m², %, €) — indices de cas concret / preuve
    chiffres_situes = re.findall(r"\b\d[\d\s.,]*\s*(?:m²|m2|%|€|euros?|salariés?|"
                                 r"personnes?|postes?|jours?|semaines?|mois)\b", texte, re.I)
    return {
        "nb_dates": len(dates) + len(mois),
        "nb_chiffres_situes": len(chiffres_situes),
        "exemples_chiffres": chiffres_situes[:5],
        "statut_dates": "ok" if (dates or mois) else "signalement",
        "statut_preuve": "ok" if chiffres_situes else "signalement",
    }


# =============================================================================
# SYNTHÈSE & RAPPORT
# =============================================================================

def synthese_niveau(r):
    nb_violations = 0
    nb_signalements = 0

    for cat, res in r.get("blacklist", {}).items():
        nb_violations += res["count_violation"]
        nb_signalements += res["count_verbatim"]

    if r.get("picat", {}).get("statut") == "violation":
        nb_violations += 10  # bloquant : force le "Refuser"

    struct = r.get("structure", {})
    nb_violations += len(struct.get("phrases_longues_sans_cesure", []))
    nb_violations += len(struct.get("coupures_dures", []))

    for cle, res in r.get("marqueurs", {}).items():
        st = res.get("statut")
        if st == "violation":
            nb_violations += 1
        elif st == "signalement":
            nb_signalements += 1

    if r.get("glossaire", {}).get("statut") == "signalement":
        nb_signalements += 1
    if r.get("hierarchie", {}).get("statut") == "violation":
        nb_violations += 1

    # WATCH + signature IA (V-6) : jamais bloquants — comptés en signalements.
    if r.get("watch", {}).get("statut") == "signalement":
        nb_signalements += 1
    if r.get("signature_ia", {}).get("statut") == "signalement":
        nb_signalements += 1

    gras = r.get("gras", {})
    if gras.get("chapo", {}).get("statut") == "violation":
        nb_violations += 1   # chapô pas en gras de bloc : règle structurelle
    nb_signalements += len(gras.get("corps", {}).get("sections_surchargees", []))

    for champ in ("seo_title", "seo_meta_description", "seo_slug"):
        st = r.get("seo_microcontenus", {}).get(champ, {}).get("statut")
        if st == "violation":
            nb_violations += 1
        elif st == "signalement":
            nb_signalements += 1

    ct = r.get("canevas_t")
    if ct:
        if ct.get("cat_D_facilite", {}).get("statut") == "violation":
            nb_violations += ct["cat_D_facilite"]["count"]
        for cle in ("unites_numerotees", "check_list", "piege_courant",
                    "criteres_completude", "ce_qu_il_faut_retenir"):
            if ct.get(cle, {}).get("statut") == "signalement":
                nb_signalements += 1

    if nb_violations == 0 and nb_signalements <= 2:
        return "Excellent (à valider manuellement)"
    elif nb_violations <= 2 and nb_signalements <= 5:
        return "Acceptable (à valider manuellement)"
    elif nb_violations <= 5:
        return "À retravailler"
    else:
        return "Refuser — publication bloquée"


def generer_rapport_markdown(r, fichier_source, pilier):
    md = []
    md.append(f"# Rapport QA GTTP — {Path(fichier_source).name}")
    md.append("")
    md.append(f"**Pilier PICAT :** {pilier}")
    md.append(f"**Fichier source :** `{fichier_source}`")
    md.append(f"**Script :** qa_gttp.py v0.5")
    md.append("")
    md.append("## Synthèse")
    md.append("")
    md.append(f"**Niveau global indicatif (passe automatisée seule) :** {synthese_niveau(r)}")
    md.append("")
    md.append("> *Ce niveau ne couvre que les critères automatisables (≈60-70 %).*")
    md.append("> *Le QA complet requiert la passe humaine : identité (famille 1),*")
    md.append("> *signature de voix V-3, exactitude métier G-2, vécu E-3 (couche 05b).*")
    md.append("")

    st = r.get("statistiques", {})
    md.append("## Statistiques")
    md.append("")
    md.append(f"- Mots : {st.get('nb_mots', 'N/A')}")
    md.append(f"- Phrases : {st.get('nb_phrases', 'N/A')}")
    md.append(f"- Paragraphes : {st.get('nb_paragraphes', 'N/A')}")
    md.append(f"- Longueur moyenne de phrase : {st.get('longueur_moyenne', 'N/A')} mots "
              f"(seuil pilier {pilier} : ≤ {r['structure']['seuil_moyenne']})")
    md.append("")

    # Méta-règle PICAT (M-1, bloquant) — affiché en premier car critique
    picat = r.get("picat", {})
    md.append("## Famille 6 — Méta-règle PICAT (M-1, bloquant)")
    md.append("")
    if picat.get("statut") == "violation":
        md.append("🔴 **VIOLATION BLOQUANTE** — glose fautive de PICAT détectée :")
        for v in picat["violations"]:
            md.append(f"- `{v['terme']}` (position {v['position']})")
    else:
        md.append("🟢 Aucune glose fautive (P≠Promotionnel, A≠Aspirationnel).")
    md.append("")

    # Règles de gras (canevas pilier I — chapô + emphase de corps)
    gras = r.get("gras", {})
    md.append("## Famille 2 — Règles de gras (chapô + emphase ≤ 1/H2)")
    md.append("")
    chapo = gras.get("chapo", {})
    if chapo.get("statut") == "ok":
        md.append("- 🟢 **Chapô** : 1er paragraphe (accroche) en gras de bloc.")
    elif chapo.get("statut") == "violation":
        md.append("- 🔴 **Chapô** : le 1er paragraphe n'est PAS en gras de bloc "
                  "(règle obligatoire du canevas).")
        if chapo.get("extrait"):
            md.append(f"  - début détecté : *{chapo['extrait']}*")
    else:
        md.append("- 🟡 **Chapô** : paragraphe d'accroche introuvable — à vérifier à l'œil.")
    corps = gras.get("corps", {})
    surcharge = corps.get("sections_surchargees", [])
    if not surcharge:
        md.append(f"- 🟢 **Corps** : ≤ 1 expression en gras par section H2 "
                  f"({corps.get('nb_sections_h2', 0)} sections analysées).")
    else:
        md.append(f"- 🟡 **Corps** : {len(surcharge)} section(s) H2 avec plus d'1 gras "
                  "(plafond anti-tic dépassé) :")
        for s in surcharge[:8]:
            md.append(f"  - « {s['titre']} » : {s['count']} expressions en gras")
    md.append("")

    # Canevas T — Mode d'emploi / Check-list (famille 6, pilier T uniquement)
    ct = r.get("canevas_t")
    if ct:
        md.append("## Famille 6 — Canevas T (Mode d'emploi / Check-list)")
        md.append("")
        def _emoji_ct(st):
            return {"violation": "🔴", "signalement": "🟡", "ok": "🟢"}.get(st, "⚪")
        u = ct.get("unites_numerotees", {})
        md.append(f"- {_emoji_ct(u.get('statut'))} **Découpage numéroté** : "
                  f"{u.get('count', 0)} unité(s) (étapes/questions ; attendu ≥ 3)")
        c = ct.get("check_list", {})
        md.append(f"- {_emoji_ct(c.get('statut'))} **Check-list à cases** : "
                  f"{c.get('count', 0)} case(s) `- [ ]` (≥ 1 attendue)")
        p = ct.get("piege_courant", {})
        md.append(f"- {_emoji_ct(p.get('statut'))} **Encadré ⚠️ Piège courant** : "
                  f"{p.get('count', 0)} (≥ 1 attendu — valeur ajoutée du pilier T)")
        cp = ct.get("criteres_completude", {})
        md.append(f"- {_emoji_ct(cp.get('statut'))} **Critères de complétude** "
                  f"(« est terminée quand… ») : {cp.get('count', 0)}")
        cr = ct.get("ce_qu_il_faut_retenir", {})
        md.append(f"- {_emoji_ct(cr.get('statut'))} **Fermeture « Ce qu'il faut retenir »** : "
                  f"{'présente' if cr.get('present') else 'absente'}")
        cd = ct.get("cat_D_facilite", {})
        if cd.get("statut") == "violation":
            md.append(f"- 🔴 **Cat. D renforcée — faux sentiment de facilité** : "
                      f"{cd.get('count')} occurrence(s) — "
                      + ", ".join(f"`{o}`" for o in cd.get("occurrences", [])[:8]))
        else:
            md.append("- 🟢 **Cat. D renforcée** : aucun « il suffit de / en un clic » hors citation.")
        md.append("")

    # Blacklist (L-1, L-2)
    md.append("## Famille 3 — Blacklist (L-1) + exception verbatim (L-2)")
    md.append("")
    blacklist = r.get("blacklist", {})
    total_viol = sum(res["count_violation"] for res in blacklist.values())
    total_verb = sum(res["count_verbatim"] for res in blacklist.values())
    md.append(f"**Violations (terme proscrit employé en propre) :** {total_viol}")
    md.append(f"**Citations verbatim (terme proscrit entre guillemets, admis) :** {total_verb}")
    md.append("")
    for cle in sorted(blacklist.keys()):
        res = blacklist[cle]
        if res["violations"]:
            md.append(f"### Catégorie {cle} — {res['libelle']}")
            md.append("")
            for v in res["violations"][:10]:
                emoji = {"violation": "🔴", "verbatim_admis": "🟢",
                         "verbatim_a_verifier": "🟡"}.get(v["statut"], "⚪")
                md.append(f"- {emoji} `{v['terme']}` (pos. {v['position']}, *{v['statut']}*)")
            md.append("")

    # Vigilance (L-3)
    vig = r.get("vigilance", [])
    if vig:
        md.append("### Section Vigilance (L-3) — termes à qualifier")
        md.append("")
        md.append(f"**Occurrences :** {len(vig)} — *à vérifier : employés avec précision ?*")
        for v in vig[:10]:
            md.append(f"- `{v['terme']}` (pos. {v['position']})")
        md.append("")

    # Glossaire (G-1)
    md.append("## Famille 4 — Densité vocabulaire métier (G-1)")
    md.append("")
    g = r.get("glossaire", {})
    emoji_g = "🟢" if g.get("statut") == "ok" else "🟡"
    md.append(f"{emoji_g} **Termes métier détectés :** {g.get('count', 0)} "
              f"({g.get('densite_pour_1000_mots', 0)}/1000 mots, "
              f"seuil pilier {pilier} : ≥ {g.get('seuil_min_pour_1000', 'N/A')})")
    if g.get("termes_detectes"):
        md.append("")
        md.append("**Détectés :** " + ", ".join(
            f"`{t}` ({n})" for t, n in sorted(g["termes_detectes"].items())))
    md.append("")

    # Structure (S-1, V-2)
    md.append("## Famille 5 — Structure & rythme (S-1, V-2)")
    md.append("")
    struct = r.get("structure", {})
    md.append(f"- Longueur max de phrase : {struct.get('longueur_max')} mots "
              f"(seuil : ≤ {struct.get('seuil_max')})")
    pl = struct.get("phrases_longues_sans_cesure", [])
    if pl:
        md.append(f"- 🟡 Phrases > seuil sans césure : {len(pl)}")
        for p in pl[:5]:
            md.append(f"  - Phrase {p['position']+1} ({p['longueur']} mots) : *{p['extrait']}*")
    cd = struct.get("coupures_dures", [])
    if cd:
        md.append(f"- 🔴 Coupures de phrase dures (S-1) : {len(cd)}")
        for c in cd[:5]:
            md.append(f"  - Ligne {c['ligne']} : …{c['extrait']}…")
    if not pl and not cd:
        md.append("- 🟢 Rythme et découpage conformes.")
    md.append("")

    # Hiérarchie (S-2)
    h = r.get("hierarchie", {})
    md.append("## Famille 5 — Hiérarchie des titres (S-2)")
    md.append("")
    md.append(f"- H1 : {h.get('nb_h1')} · H2 : {h.get('nb_h2')} · H3 : {h.get('nb_h3')} · H4+ : {h.get('nb_h4_ou_plus')}")
    for v in h.get("violations", []):
        md.append(f"- 🔴 {v}")
    md.append("")

    # Marqueurs (V-5)
    md.append("## Famille 2 — Marqueurs de voix (V-5)")
    md.append("")
    mq = r.get("marqueurs", {})
    excl = mq.get("exclamations", {})
    md.append(f"- Exclamations : {excl.get('count')} (seuil : ≤ {excl.get('seuil')}) "
              f"{'🔴' if excl.get('statut')=='violation' else '🟢'}")
    em = mq.get("em_dashes", {})
    md.append(f"- Em-dash : {em.get('count')} ({em.get('densite_pour_1000_mots')}/1000 mots) "
              f"{'🔴' if em.get('statut')=='violation' else ('🟡' if em.get('statut')=='signalement' else '🟢')}")
    emo = mq.get("emojis", {})
    md.append(f"- Émojis : {emo.get('count')} "
              f"{'🔴' if emo.get('statut')=='violation' else ('🟡' if emo.get('statut')=='signalement' else '🟢')}")
    ell = mq.get("ellipses_publicitaires", {})
    if ell.get("statut") == "signalement":
        md.append(f"- 🟡 Ellipses publicitaires possibles ({ell.get('max_phrases_courtes_consecutives')} phrases courtes consécutives)")
    md.append("")

    # Signature IA — rhétorique & accumulation (V-6)
    md.append("## Famille 2 — Signature IA : rhétorique & accumulation (V-6)")
    md.append("")
    def _e_sig(st):
        return {"violation": "🔴", "signalement": "🟡", "ok": "🟢"}.get(st, "⚪")
    sig = r.get("signature_ia", {})
    w = r.get("watch", {})
    md.append(f"- {_e_sig(sig.get('statut'))} **Rhétorique binaire / aphoristique** : "
              f"{len(sig.get('antitheses', []))} antithèse(s) « … pas …, mais/c'est … », "
              f"{len(sig.get('mais_openers', []))} ouverture(s) « Mais/Or… », "
              f"{len(sig.get('aphorismes', []))} exergue(s) aphoristique(s).")
    for a in sig.get("antitheses", [])[:4]:
        md.append(f"  - antithèse : *{a}…*")
    for a in sig.get("aphorismes", [])[:3]:
        md.append(f"  - exergue : *{a}…*")
    rep = w.get("repetes", {})
    md.append(f"- {_e_sig(w.get('statut'))} **Mots WATCH (accumulation)** : "
              f"{w.get('distincts', 0)} distinct(s), {w.get('total', 0)} occurrence(s)"
              + (" — répétés : " + ", ".join(f"{l}×{n}" for l, n in rep.items()) if rep else "")
              + ".")
    md.append("")
    md.append("> *Signalé, jamais bloquant : un motif isolé est légitime ; c'est "
              "l'accumulation qui « sonne IA ». Réduire par vraie reformulation, "
              "pas par synonyme cosmétique.*")
    md.append("")

    # E-E-A-T (E-1, E-2)
    md.append("## Famille 7 — E-E-A-T basique (E-1, E-2)")
    md.append("")
    e = r.get("eeat", {})
    md.append(f"- Dates visibles : {e.get('nb_dates')} {'🟢' if e.get('statut_dates')=='ok' else '🟡'}")
    md.append(f"- Chiffres situés (preuve / vécu) : {e.get('nb_chiffres_situes')} "
              f"{'🟢' if e.get('statut_preuve')=='ok' else '🟡'}")
    if e.get("exemples_chiffres"):
        md.append(f"  - ex. : {', '.join(e['exemples_chiffres'])}")
    md.append("")

    # Micro-contenus SEO (canevas pilier I, section 7)
    seo = r.get("seo_microcontenus", {})
    md.append("## SEO — Micro-contenus obligatoires (title, meta, slug)")
    md.append("")
    def _emoji_seo(st):
        return {"violation": "🔴", "signalement": "🟡", "ok": "🟢"}.get(st, "⚪")
    t = seo.get("seo_title", {})
    md.append(f"- {_emoji_seo(t.get('statut'))} **seo_title** : {t.get('longueur', 0)} car. "
              f"(cible {t.get('cible')}) — « {t.get('valeur') or '(absent)'} »")
    d = seo.get("seo_meta_description", {})
    md.append(f"- {_emoji_seo(d.get('statut'))} **seo_meta_description** : {d.get('longueur', 0)} car. "
              f"(cible {d.get('cible')})")
    s = seo.get("seo_slug", {})
    md.append(f"- {_emoji_seo(s.get('statut'))} **seo_slug** : « {s.get('valeur') or '(absent)'} »")
    if "motcle_dans_title" in seo:
        md.append(f"- Mot-clé dans le title : {'🟢 oui' if seo['motcle_dans_title'] else '🟡 non'} · "
                  f"dans le slug : {'🟢 oui' if seo['motcle_dans_slug'] else '🟡 non'}")
    md.append("")

    # Mot-clé
    mc = r.get("motcle", {})
    if mc.get("statut") != "non_applicable":
        md.append("## SEO — Mot-clé principal")
        md.append("")
        md.append(f"- `{mc.get('motcle')}` : {mc.get('occurrences')} occ. "
                  f"({mc.get('densite_pct')}%), H1 : {'🟢' if mc.get('presence_h1') else '🟡'}")
        md.append("")

    # Rappel passe humaine
    md.append("## Critères à passer en lecture humaine (non automatisables)")
    md.append("")
    md.append("- **Famille 1 — Identité** : B-1 (promesse), B-2 (iceberg), B-3 (centre de gravité)")
    md.append("- **Famille 2 — Voix** : V-1 (registre), V-3 (signature « du plan à l'usage »), V-4 (autorité)")
    md.append("- **Famille 4 — Glossaire** : G-2 (usage technique exact), G-3 (définition à la 1ʳᵉ occurrence)")
    md.append("- **Famille 7 — E-E-A-T** : E-3 (cas vécu daté et situé)")
    md.append("")
    md.append("---")
    md.append("")
    md.append("*Rapport généré par qa_gttp.py v0.5 — Stack éditorial GTTP, couche 05.*")

    return "\n".join(md)


# =============================================================================
# CHAÎNE PRINCIPALE
# =============================================================================

def lancer_qa(fichier_source, pilier, motcle=None):
    if pilier not in PILIERS_VALIDES:
        sys.exit(f"Erreur : pilier '{pilier}' non valide (attendus : P, I, C, T).")

    texte_brut = lire_fichier(fichier_source)
    texte_editorial = extraire_corps_editorial(texte_brut)
    frontmatter = extraire_frontmatter(texte_brut)
    # Texte brut SANS frontmatter : pour les modules qui ont besoin du Markdown
    # (titres, structure) mais que le frontmatter perturberait (un commentaire
    # YAML "# ..." serait lu comme un H1, les longues valeurs comme des phrases).
    texte_sans_fm = re.sub(r"^---\n.*?\n---\n", "", texte_brut, count=1, flags=re.DOTALL)

    phrases = decouper_phrases(texte_editorial)
    paragraphes = decouper_paragraphes(texte_editorial)
    nb_mots = compter_mots(texte_editorial)
    longueurs = [compter_mots(p) for p in phrases]
    longueur_moyenne = round(sum(longueurs) / len(longueurs), 1) if longueurs else 0

    return {
        "fichier_source": fichier_source,
        "pilier": pilier,
        "statistiques": {
            "nb_mots": nb_mots,
            "nb_phrases": len(phrases),
            "nb_paragraphes": len(paragraphes),
            "longueur_moyenne": longueur_moyenne,
        },
        "blacklist": module_blacklist(texte_editorial),
        "vigilance": module_vigilance(texte_editorial),
        "watch": module_watch(texte_editorial),
        "signature_ia": module_signature_ia(texte_editorial, texte_sans_fm),
        "picat": module_picat(texte_sans_fm),
        "gras": module_gras(texte_sans_fm),
        "structure": module_structure(texte_editorial, texte_sans_fm, pilier),
        "marqueurs": module_marqueurs(texte_editorial, pilier),
        "glossaire": module_glossaire(texte_editorial, pilier),
        "hierarchie": module_hierarchie(texte_sans_fm),
        "eeat": module_eeat(texte_editorial),
        "seo_microcontenus": module_seo_microcontenus(frontmatter, motcle),
        "motcle": module_motcle(texte_sans_fm, motcle) if motcle else {"statut": "non_applicable"},
        # Module de canevas (famille 6) : ne tourne que pour le pilier concerné.
        "canevas_t": module_canevas_T_Mode_emploi(texte_sans_fm) if pilier == "T" else None,
    }


def main():
    parser = argparse.ArgumentParser(
        description="QA éditorial GTTP — script automatisé v0.1",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("fichier", help="Fichier à analyser (.md, .txt, .html)")
    parser.add_argument("--pilier", choices=["P", "I", "C", "T"], default="I",
                        help="Pilier PICAT du contenu (défaut : I)")
    parser.add_argument("--format", choices=["md", "json", "both"], default="md",
                        help="Format de sortie (défaut : md)")
    parser.add_argument("--motcle", default=None, help="Mot-clé principal SEO (optionnel)")
    parser.add_argument("--output", default=None, help="Fichier de sortie (défaut : stdout)")
    parser.add_argument("--ci", action="store_true",
                        help="Mode CI : code de sortie 1 s'il reste une violation DURE "
                             "(blacklist L-1, méta-règle PICAT M-1) ou niveau « À retravailler ». "
                             "Les signalements 🟡 (E-E-A-T, densité, gras…) ne bloquent pas.")
    args = parser.parse_args()

    resultats = lancer_qa(args.fichier, args.pilier, args.motcle)

    if args.format in ("md", "both"):
        rapport = generer_rapport_markdown(resultats, args.fichier, args.pilier)
        if args.output:
            Path(args.output).write_text(rapport, encoding="utf-8")
            print(f"Rapport Markdown écrit : {args.output}")
        else:
            print(rapport)

    if args.format in ("json", "both"):
        rapport_json = json.dumps(resultats, ensure_ascii=False, indent=2)
        if args.output:
            json_path = Path(args.output).with_suffix(".json")
            json_path.write_text(rapport_json, encoding="utf-8")
            print(f"Rapport JSON écrit : {json_path}")
        else:
            print(rapport_json)

    if args.ci:
        blacklist_dures = sum(res.get("count_violation", 0)
                              for res in resultats.get("blacklist", {}).values())
        picat_ko = resultats.get("picat", {}).get("statut") == "violation"
        niveau = synthese_niveau(resultats)
        echec = blacklist_dures > 0 or picat_ko or niveau.startswith(("À retravailler", "Refuser"))
        print(f"[CI] {Path(args.fichier).name} — blacklist={blacklist_dures} "
              f"picat={'KO' if picat_ko else 'ok'} niveau=\"{niveau}\" "
              f"-> {'ECHEC' if echec else 'OK'}")
        sys.exit(1 if echec else 0)


if __name__ == "__main__":
    main()
