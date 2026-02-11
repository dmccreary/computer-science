#!/usr/bin/env python3
"""Add TaxonomyID to learning-graph.csv based on concept ID ranges."""
import csv

RANGES = [
    (1, 20, "FOUND"),
    (21, 50, "PYBASIC"),
    (51, 65, "BOOL"),
    (66, 90, "CTRL"),
    (91, 115, "STR"),
    (116, 142, "FUNC"),
    (143, 150, "REC"),
    (151, 230, "DATA"),
    (231, 275, "OOP"),
    (276, 290, "FILEIO"),
    (291, 305, "ERR"),
    (306, 325, "TEST"),
    (326, 360, "ALGO"),
    (361, 380, "SENG"),
    (381, 400, "ADVPY"),
]

def get_taxonomy(concept_id):
    for start, end, tax in RANGES:
        if start <= concept_id <= end:
            return tax
    return "MISC"

rows = []
with open("learning-graph.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        cid = int(row["ConceptID"])
        rows.append({
            "ConceptID": row["ConceptID"],
            "ConceptLabel": row["ConceptLabel"],
            "Dependencies": row["Dependencies"],
            "TaxonomyID": get_taxonomy(cid),
        })

with open("learning-graph.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["ConceptID", "ConceptLabel", "Dependencies", "TaxonomyID"])
    writer.writeheader()
    writer.writerows(rows)

# Print distribution
from collections import Counter
dist = Counter(r["TaxonomyID"] for r in rows)
print(f"Total concepts: {len(rows)}")
for tax, count in sorted(dist.items(), key=lambda x: -x[1]):
    print(f"  {tax:8s}: {count:3d} ({count/len(rows)*100:.1f}%)")
