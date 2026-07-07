#!/usr/bin/env python3
"""Runner QA pour la CI — passe la QA rédaction (qa_bm --ci) + la QA traduction
(qa_translate) sur tous les articles de content/*.md.

Code de sortie : 1 si AU MOINS un article présente une violation dure
(→ la GitHub Action échoue → merge bloqué), 0 sinon. Zéro dépendance externe.

Bundle vendoré (voir qa/README.md) : source unique = Stack-editorial-*.
"""
import glob
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
CONTENT = os.path.join(REPO, "content")

QA_BM = os.path.join(HERE, "qa_bm.py")                       # QA rédaction (--ci)
QA_TRANSLATE = os.path.join(HERE, "engine", "qa_translate.py")  # QA traduction
BRAND_TABLES = os.path.join(HERE, "brand-tables")            # tables de marque (--stack)

# lang du frontmatter -> code langue attendu par qa_translate. 'fr' = langue source
# (pas de QA traduction).
LANG_TO_QA = {"nl": "nl-BE", "en": "en-GB"}


def lire_frontmatter(chemin):
    with open(chemin, encoding="utf-8") as f:
        texte = f.read()
    m = re.match(r"^﻿?\s*---\n(.*?)\n---", texte, re.S)
    fm = {}
    if m:
        for ligne in m.group(1).split("\n"):
            mm = re.match(r"^([a-zA-Z_]+):\s*(.*)$", ligne)
            if mm:
                fm[mm.group(1)] = mm.group(2).strip()
    return fm


def lancer(cmd):
    res = subprocess.run(cmd, capture_output=True, text=True)
    sortie = (res.stdout + res.stderr).strip()
    derniere = sortie.splitlines()[-1] if sortie else ""
    return res.returncode, derniere


def main():
    fichiers = sorted(glob.glob(os.path.join(CONTENT, "*.md")))
    if not fichiers:
        print("Aucun article dans content/ — rien à contrôler.")
        return 0

    echecs = []
    for chemin in fichiers:
        fm = lire_frontmatter(chemin)
        nom = os.path.basename(chemin)
        lang = fm.get("lang", "")
        pilier = fm.get("pilier", "I")
        if pilier not in ("P", "I", "C", "T"):
            pilier = "I"

        # 1) QA rédaction (toutes langues) — qa_bm --ci
        code, msg = lancer([sys.executable, QA_BM, "--pilier", pilier, "--ci", chemin])
        print(f"[rédaction {pilier}] {nom} -> {'OK' if code == 0 else 'ÉCHEC'}")
        if code != 0:
            echecs.append((nom, "rédaction", msg))

        # 2) QA traduction (nl / en seulement) — qa_translate
        qlang = LANG_TO_QA.get(lang)
        if qlang:
            code, msg = lancer([sys.executable, QA_TRANSLATE,
                                "--stack", BRAND_TABLES, "--lang", qlang, chemin])
            print(f"[traduction {qlang}] {nom} -> {'OK' if code == 0 else 'ÉCHEC'}")
            if code != 0:
                echecs.append((nom, f"traduction {qlang}", msg))

    print()
    if echecs:
        print(f"❌ QA CI : {len(echecs)} échec(s) — merge à bloquer :")
        for nom, genre, msg in echecs:
            print(f"   - {nom} [{genre}] {msg}")
        return 1
    print(f"✅ QA CI : {len(fichiers)} article(s) contrôlé(s), aucune violation dure.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
