
import csv
from nlp.models import nlp
from nlp.wordset import *

semantic_types = {}

with open("nlp/semantic_types.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        semantic_types[row["code"]] = row



def get_semantic_class(code):
    info = semantic_types.get(code)

    if info is None:
        return "Unknown"
    
    return info["category"]


def get_entity_info(doc, minimum_score=0.80):
    entities = []
    linker = nlp.get_pipe("scispacy_linker")

    abbreviation_map = {
        str(abbr): str(abbr._.long_form)
        for abbr in doc._.abbreviations
    }

    print("Abbreviation Map:", abbreviation_map)

    for entity in doc.ents:
        entity_text = entity.text

        entity_lemmas = {
            token.lemma_.lower()
            for token in entity
            if not token.is_punct and not token.is_space
        }

        if (entity_lemmas and entity_lemmas.issubset(status_entity_lemmas)):
            continue

        if (entity_text.strip().lower() in note_headings):
            continue

        normalised_text = abbreviation_map.get(entity_text, entity_text)

        selected_candidate = None

        for cui, score in entity._.kb_ents:
            if score < minimum_score:
                continue

            concept = linker.kb.cui_to_entity[cui]

            allowed_codes = [code for code in concept.types if code in allowed_semantic_codes]

            if not allowed_codes:
                continue

            selected_candidate = {
                "cui": cui,
                "score": float(score),
                "concept": concept,
                "semantic_codes": allowed_codes,
            }
            
            break

        if selected_candidate is None:
            continue

        concept = selected_candidate["concept"]

        entities.append({
            "entity": entity,
            "text": entity_text,
            "tokens": list(entity),
            "normalised": normalised_text,
            "canonical": concept.canonical_name,
            "cui": selected_candidate["cui"],
            "semantic_codes": selected_candidate["semantic_codes"],
            "semantic_types": [get_semantic_class(code) for code in selected_candidate["semantic_codes"]],
            "score": selected_candidate["score"],
            "start": entity.start_char,
            "end": entity.end_char,
        })

    return entities
