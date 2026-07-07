#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
qa_translate.py — Contrôle qualité d'une traduction éditoriale (moteur mutualisé).

Rôle : prendre un texte DÉJÀ TRADUIT (ex. vers l'EN-GB) et vérifier
automatiquement qu'il respecte :
  1. la blacklist transposée de la marque   -> table-02.<langue>.md  (§2 « à éviter »)
  2. les termes de vigilance de la marque    -> table-02.<langue>.md  (§3 jargon hype)
  3. les marqueurs de LLM propres à la langue -> langues/<langue>.md   (§1)
  4. les mots WATCH (accumulation/répétition) -> langues/<langue>.md   (§1bis, non bloquant)
  5. les calques FR->EN contigus              -> langues/<langue>.md   (§7, avertissement)
  6. l'orthographe britannique                -> langues/<langue>.md   (§3 US->GB)
  7. le registre (excès d'exclamations)
  8. la couverture du glossaire               -> table-03.<langue>.md  (info)
  9. le français résiduel (info, heuristique)

100 % local, sans IA, sans dépendance externe : uniquement la bibliothèque
standard de Python 3. À lancer ainsi :

    python3 qa_translate.py --stack <chemin>/traduction --lang en-GB texte_traduit.md

Sortie : un rapport lisible + un code de sortie (0 = aucune violation dure,
1 = au moins une violation dure). Voir CONTRAT.md §4 et moteur/protocole-traduction.md.
"""

import argparse
import os
import re
import sys

# Seuil de répétition d'un mot WATCH (§1bis) au-delà duquel on lève un
# avertissement de répétition. En deçà, l'accumulation reste signalée en INFO.
SEUIL_WATCH = 3

# ---------------------------------------------------------------------------
# Petites briques de lecture du Markdown (pas de dépendance externe)
# ---------------------------------------------------------------------------

def lire_sections(chemin):
    """Lit un fichier .md et renvoie une liste de sections.

    Chaque section = (titre, lignes_de_tableau) où lignes_de_tableau est la
    liste des lignes de tableau Markdown (commençant par « | ») rencontrées
    sous ce titre, hors lignes de séparation « |---|---| ».
    """
    sections = []
    titre_courant = ""
    lignes_tableau = []
    with open(chemin, encoding="utf-8") as f:
        for ligne in f:
            ligne = ligne.rstrip("\n")
            if ligne.startswith("#"):
                # Nouveau titre : on clôt la section précédente.
                sections.append((titre_courant, lignes_tableau))
                titre_courant = ligne.lstrip("#").strip()
                lignes_tableau = []
            elif ligne.lstrip().startswith("|"):
                # Ligne de tableau. On ignore les séparateurs « |---|---| ».
                sans_pipe = ligne.replace("|", "").replace("-", "").replace(":", "").strip()
                if sans_pipe:
                    lignes_tableau.append(ligne)
    sections.append((titre_courant, lignes_tableau))
    return sections


def cellules(ligne_tableau):
    """Découpe une ligne de tableau Markdown en cellules nettoyées."""
    brut = ligne_tableau.strip().strip("|")
    parts = [c.strip() for c in brut.split("|")]
    # On retire le gras Markdown ** ** pour faciliter les comparaisons.
    parts = [p.replace("**", "").strip() for p in parts]
    return parts


def trouver_section(sections, *mots_cles):
    """Renvoie les lignes de tableau de la 1re section dont le titre contient
    l'un des mots-clés (insensible à la casse)."""
    for titre, lignes in sections:
        t = titre.lower()
        if any(mc.lower() in t for mc in mots_cles):
            return lignes
    return []


# ---------------------------------------------------------------------------
# Extraction des expressions interdites depuis les cellules
# ---------------------------------------------------------------------------

_GUILLEMETS = re.compile(r"[«\"]\s*(.+?)\s*[»\"]")


def expressions_depuis_cellule(cellule):
    """Extrait les expressions littérales d'une cellule « à éviter ».

    On ne retient que ce qui est entre guillemets (« ... » ou \"...\"), car
    les cellules sans guillemets sont des consignes méta (« même excès en EN »)
    et non des expressions à chercher mot pour mot. Les variantes séparées par
    « / » sont éclatées (ex. « game changer / game-changing » -> 2 entrées).
    """
    exprs = []
    for bloc in _GUILLEMETS.findall(cellule):
        for variante in re.split(r"\s*/\s*", bloc):
            v = variante.strip()
            # On enlève une éventuelle parenthèse de commentaire en fin.
            v = re.sub(r"\s*\([^)]*\)\s*$", "", v).strip()
            # On écarte les gabarits avec X/Y (ex. « whether you're X or Y »).
            if re.search(r"\b[XY]\b", v):
                continue
            if len(v) >= 3:
                exprs.append(v)
    return exprs


def nettoyer_marqueur(cellule):
    """Nettoie un marqueur LLM (col. 1 de langues §1) pour la recherche."""
    v = cellule
    v = re.sub(r"\([^)]*\)", "", v)   # retire les parenthèses « (into) »
    v = v.replace("…", " ").replace("...", " ")
    v = re.sub(r"\s+", " ", v).strip()
    return v


# ---------------------------------------------------------------------------
# Recherche d'une expression dans le texte traduit
# ---------------------------------------------------------------------------

def normaliser_typo(s):
    """Remplace apostrophes et guillemets « courbes » (typographiques) par
    leurs équivalents droits, pour que la recherche et la détection de verbatim
    fonctionnent quel que soit le clavier qui a produit le texte."""
    for courbe in ("’", "‘", "ʼ", "′"):  # ’ ‘ ʼ ′
        s = s.replace(courbe, "'")
    for courbe in ("“", "”", "„", "″"):  # “ ” „ ″
        s = s.replace(courbe, '"')
    return s


def construire_motif(expr):
    """Construit un motif de recherche tolérant pour une expression :
    - tiret et espace interchangeables (« game changer » == « game-changer ») ;
    - terminaisons fléchies sur le dernier mot (« delve » trouve « delves »,
      « delving » ; « optimise » trouve « optimising ») ;
    - insensible à la casse, avec frontières de mot."""
    mots = [m for m in re.split(r"[\s\-]+", expr.strip()) if m]
    if not mots:
        return None
    parties = [re.escape(m) for m in mots]
    # Le dernier mot tolère un « e » final muet optionnel + une terminaison.
    if mots[-1].lower().endswith("e"):
        parties[-1] = re.escape(mots[-1][:-1]) + "e?"
    parties[-1] += r"(?:s|es|d|ed|ing)?"
    motif = r"(?<!\w)" + r"[\s\-]+".join(parties) + r"(?!\w)"
    return re.compile(motif, re.IGNORECASE)


def occurrences(expr, lignes_texte):
    """Renvoie la liste des (numero_ligne, est_entre_guillemets) où expr
    apparaît, avec frontières de mot, insensible à la casse, variantes tolérées."""
    motif = construire_motif(expr)
    if motif is None:
        return []
    trouve = []
    for i, ligne in enumerate(lignes_texte, start=1):
        for m in motif.finditer(ligne):
            # CONTRAT §3 : un terme cité entre guillemets peut être un verbatim
            # client légitime -> on le signale mais sans le compter en violation dure.
            avant = ligne[:m.start()]
            entre_guillemets = (avant.count("«") > avant.count("»")) or \
                               (avant.count('"') % 2 == 1)
            trouve.append((i, entre_guillemets))
    return trouve


# ---------------------------------------------------------------------------
# Programme principal
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="QA d'une traduction éditoriale (blacklist cible, marqueurs LLM, "
                    "orthographe GB, glossaire). 100 % local, sans IA.")
    parser.add_argument("texte", help="Fichier .md du texte TRADUIT à contrôler.")
    parser.add_argument("--stack", required=True,
                        help="Dossier traduction/ de la marque (contient manifest + tables).")
    parser.add_argument("--lang", default="en-GB",
                        help="Langue cible (défaut : en-GB).")
    args = parser.parse_args()

    # --- Localisation des fichiers ------------------------------------------
    ici = os.path.dirname(os.path.abspath(__file__))
    f_langue = os.path.join(ici, "..", "langues", f"{args.lang}.md")
    f_table02 = os.path.join(args.stack, f"table-02.{args.lang}.md")
    f_table03 = os.path.join(args.stack, f"table-03.{args.lang}.md")

    for chemin, nom in [(args.texte, "texte traduit"),
                        (f_langue, f"langues/{args.lang}.md"),
                        (f_table02, f"table-02.{args.lang}.md"),
                        (f_table03, f"table-03.{args.lang}.md")]:
        if not os.path.exists(chemin):
            print(f"ERREUR : introuvable ({nom}) : {chemin}", file=sys.stderr)
            return 2

    with open(args.texte, encoding="utf-8") as f:
        lignes_texte = [normaliser_typo(l.rstrip("\n")) for l in f]

    # --- Chargement des règles ----------------------------------------------
    sec_langue = lire_sections(f_langue)
    sec_t02 = lire_sections(f_table02)
    sec_t03 = lire_sections(f_table03)

    # 1) Blacklist § « à éviter » (table-02 §2 TRANSPOSÉE) : col. 2 « à éviter ».
    blacklist = []
    for lg in trouver_section(sec_t02, "§2"):
        cols = cellules(lg)
        if len(cols) < 2 or cols[0].lower().startswith("fr proscrit"):
            continue  # ligne d'en-tête ou ligne incomplète
        for e in expressions_depuis_cellule(cols[1]):
            blacklist.append(e)
    blacklist = sorted(set(blacklist), key=str.lower)

    # 2) Vigilance (table-02 §3) : jargon hype à éviter (col. 2 mentionne « à éviter »/« jargon »).
    vigilance = []
    for lg in trouver_section(sec_t02, "§3"):
        cols = cellules(lg)
        if not cols or cols[0].lower().startswith("terme"):
            continue
        if len(cols) >= 2 and ("à éviter" in cols[1].lower() or "jargon" in cols[1].lower()):
            for variante in re.split(r"\s*/\s*", cols[0]):
                v = variante.strip()
                if len(v) >= 3:
                    vigilance.append(v)
    vigilance = sorted(set(vigilance), key=str.lower)

    # 3) Marqueurs LLM (langues §1) : col. 1.
    marqueurs = []
    for lg in trouver_section(sec_langue, "Marqueurs de LLM"):
        cols = cellules(lg)
        if not cols or cols[0].lower().startswith("marqueur"):
            continue
        m = nettoyer_marqueur(cols[0])
        if len(m) >= 3:
            marqueurs.append(m)
    marqueurs = sorted(set(marqueurs), key=str.lower)

    # 3bis) Mots WATCH (langues §1bis) : col. 1. Non bloquants : on compte.
    watch = []
    for lg in trouver_section(sec_langue, "WATCH"):
        cols = cellules(lg)
        if not cols or cols[0].lower().startswith("mot"):
            continue
        m = nettoyer_marqueur(cols[0])
        if len(m) >= 2:
            watch.append(m)
    watch = sorted(set(watch), key=str.lower)

    # 3ter) Calques FR->EN contigus (langues §7) : col. 1. Avertissement.
    calques = []
    for lg in trouver_section(sec_langue, "Calques"):
        cols = cellules(lg)
        if not cols or cols[0].lower().startswith("calque"):
            continue
        m = nettoyer_marqueur(cols[0])
        if len(m) >= 3:
            calques.append(m)
    calques = sorted(set(calques), key=str.lower)

    # 4) Orthographe US -> GB (langues §3) : col. 1 = US, col. 2 = GB.
    orthographe = []
    for lg in trouver_section(sec_langue, "Orthographe américaine"):
        cols = cellules(lg)
        if len(cols) < 2 or cols[0].lower().startswith("américain"):
            continue
        us = re.sub(r"\s*\([^)]*\)\s*", "", cols[0]).strip()
        gb = re.sub(r"\s*\([^)]*\)\s*", "", cols[1]).strip()
        if us:
            orthographe.append((us, gb))

    # 5) Glossaire (table-03) : col. 2 = Terme FR, col. 3 = Cas, col. 4 = Rendu EN.
    glossaire = []  # (terme_fr, cas, rendu_en)
    for titre, lignes in sec_t03:
        if "Catégorie" not in titre:
            continue
        for lg in lignes:
            cols = cellules(lg)
            if len(cols) < 4 or cols[0].lower() == "id":
                continue
            glossaire.append((cols[1], cols[2].lower(), cols[3]))

    # --- Garde-fou : aucune règle chargée = titres de table modifiés --------
    # Le parsing repose sur des titres de section (§2, §3, « Catégorie… »,
    # « Marqueurs de LLM »). Si une table régénérée change un titre, une liste
    # devient vide : sans ce garde-fou, le QA dirait « 0 violation » à tort.
    manquants = []
    if not blacklist:
        manquants.append("blacklist (table-02 §2)")
    if not marqueurs:
        manquants.append("marqueurs LLM (langues §1)")
    if not glossaire:
        manquants.append("glossaire (table-03, titres « Catégorie… »)")
    if manquants:
        print("ERREUR : aucune règle chargée pour : " + ", ".join(manquants),
              file=sys.stderr)
        print("        Un titre de section a probablement changé dans une table.",
              file=sys.stderr)
        print("        Vérifier les titres §2 / §3 / « Catégorie… » / « Marqueurs de LLM ».",
              file=sys.stderr)
        return 2

    # --- Exécution des contrôles --------------------------------------------
    violations = []   # dur (code de sortie 1)
    avertissements = []
    infos = []

    def signaler(expr, suggestion, source, occ, niveau):
        for (num, cite) in occ:
            if cite:
                avertissements.append(
                    (num, f"« {expr} » présent mais entre guillemets — verbatim client ? "
                          f"à vérifier ({source})"))
            elif niveau == "violation":
                violations.append((num, f"« {expr} » à proscrire — {suggestion} [{source}]"))
            else:
                avertissements.append((num, f"« {expr} » — {suggestion} [{source}]"))

    # 1. Blacklist cible (violation dure).
    for e in blacklist:
        occ = occurrences(e, lignes_texte)
        if occ:
            signaler(e, "préférer le réel (voir table-02 §2)", "table-02 §2", occ, "violation")

    # 2. Vigilance (avertissement).
    for e in vigilance:
        occ = occurrences(e, lignes_texte)
        if occ:
            signaler(e, "jargon à n'employer que justifié (table-02 §3)", "table-02 §3", occ, "avert")

    # 3. Marqueurs LLM (violation dure).
    for e in marqueurs:
        occ = occurrences(e, lignes_texte)
        if occ:
            signaler(e, "tic de LLM anglais — reformuler (langues §1)", "langues §1", occ, "violation")

    # 3bis. Mots WATCH (§1bis) : jamais bloquant. On compte les occurrences hors
    # guillemets ; on avertit sur la répétition (>= SEUIL_WATCH) et on résume
    # l'accumulation en INFO.
    watch_counts = []
    total_watch = 0
    for e in watch:
        occ = [o for o in occurrences(e, lignes_texte) if not o[1]]
        n = len(occ)
        if n:
            total_watch += n
            watch_counts.append((e, n, occ[0][0]))
            if n >= SEUIL_WATCH:
                avertissements.append(
                    (occ[0][0], f"« {e} » apparaît {n}× — WATCH : surveiller la "
                                f"répétition (langues §1bis)"))
    if watch_counts:
        apercu = ", ".join(f"{e}×{n}" for (e, n, _) in
                           sorted(watch_counts, key=lambda x: -x[1]))
        infos.append((0, f"Mots WATCH présents : {len(watch_counts)} distincts, "
                         f"{total_watch} occurrence(s) ({apercu}) — accumulation "
                         f"à surveiller [langues §1bis]"))

    # 3ter. Calques FR->EN contigus (§7) : avertissement.
    for e in calques:
        occ = occurrences(e, lignes_texte)
        if occ:
            signaler(e, "calque du français — reformuler dans la langue cible (langues §7)",
                     "langues §7", occ, "avert")

    # 4. Orthographe US -> GB (violation dure).
    for (us, gb) in orthographe:
        occ = occurrences(us, lignes_texte)
        if occ:
            for (num, cite) in occ:
                violations.append((num, f"« {us} » (orthographe US) -> écrire « {gb} » [langues §3]"))

    # 5. Registre : excès d'exclamations.
    total_excl = sum(l.count("!") for l in lignes_texte)
    if total_excl > 1:
        avertissements.append((0, f"{total_excl} points d'exclamation au total "
                                  f"(règle : ≤ 1 ; idéalement 0 en piliers I/T) [langues §4]"))

    # 6. Couverture glossaire (info) + fuite de FR sur les termes « universel ».
    rendus_reconnus = 0
    for (terme_fr, cas, rendu_en) in glossaire:
        # le rendu attendu apparaît-il ? (information de couverture)
        cle = re.sub(r"\s*\([^)]*\)\s*", " ", rendu_en).strip()
        cle = re.split(r"\s*/\s*", cle)[0].strip()
        if cle and occurrences(cle, lignes_texte):
            rendus_reconnus += 1
        # un terme FR « universel » qui reste tel quel = probablement non traduit.
        if cas == "universel":
            fr_simple = re.sub(r"\s*\([^)]*\)\s*", " ", terme_fr).strip()
            occ = occurrences(fr_simple, lignes_texte)
            for (num, cite) in occ:
                if not cite:
                    avertissements.append(
                        (num, f"« {fr_simple} » (terme FR universel) semble non traduit "
                              f"-> rendu EN attendu : « {cle} » [table-03]"))
    infos.append((0, f"Couverture glossaire : {rendus_reconnus}/{len(glossaire)} rendus EN reconnus dans le texte."))

    # 7. Français résiduel (info, heuristique douce).
    mots_fr = re.compile(r"(?<!\w)(le|la|les|des|une|dans|pour|avec|nous|vous|qui|que|"
                         r"est|sont|leur|cette|notre|votre|plus|sans|chez)(?!\w)", re.IGNORECASE)
    lignes_fr = []
    for i, ligne in enumerate(lignes_texte, start=1):
        # on ignore le contenu entre guillemets (gloses belges, verbatims)
        sans_cit = re.sub(r"«.*?»", "", ligne)
        sans_cit = re.sub(r"\([^)]*\)", "", sans_cit)
        if mots_fr.search(sans_cit) or re.search(r"[àâäéèêëîïôöùûç]", sans_cit):
            lignes_fr.append(i)
    if lignes_fr:
        apercu = ", ".join(str(n) for n in lignes_fr[:12])
        infos.append((0, f"Français résiduel possible aux lignes : {apercu}"
                         f"{' …' if len(lignes_fr) > 12 else ''} (à vérifier — les gloses BE sont normales)."))

    # --- Rapport -------------------------------------------------------------
    def bloc(titre, items):
        print(f"\n=== {titre} ({len(items)}) ===")
        if not items:
            print("  (rien)")
            return
        for num, msg in sorted(items, key=lambda x: x[0]):
            prefixe = f"  L{num:>3} : " if num else "  ——— : "
            print(prefixe + msg)

    print("#" * 70)
    print(f"# Rapport QA traduction — {os.path.basename(args.texte)}  (cible : {args.lang})")
    print(f"# Marque (stack) : {args.stack}")
    print("#" * 70)
    bloc("VIOLATIONS (à corriger)", violations)
    bloc("AVERTISSEMENTS (à vérifier)", avertissements)
    bloc("INFOS", infos)

    print("\n" + "-" * 70)
    print(f"Bilan : {len(violations)} violation(s), {len(avertissements)} avertissement(s).")
    if violations:
        print("Résultat : ÉCHEC — corriger les violations puis relancer.")
        return 1
    print("Résultat : OK — aucune violation dure. Vérifier les avertissements à la main.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
