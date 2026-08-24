from nlp.wordset import *

def check_negation(token):
    nodes = [token, *list(token.ancestors)]

    for node in nodes:
        if node.lemma_.lower() in negation_lemmas:
            return True

        for child in node.children:
            if (child.dep_ == "neg" or child.text.lower() in negation_words):
                return True

    return False

def get_conj_entities(token):
    entities = [token]

    for child in token.children:
        if child.dep_ == "conj":
            # entities.append(child)
            entities.extend(get_conj_entities(child))

    return entities

def build_entity_phrase(token):
    included_tokens = {token.i: token}

    for child in token.children:
        if (child.dep_ in {"amod", "compound", "nmod"} and child.lemma_.lower() not in entiy_discourse_words):
            for subtree_token in child.subtree:
                included_tokens[subtree_token.i] = subtree_token

    tokens = [included_tokens[index] for index in sorted(included_tokens)]

    return " ".join(
        item.text
        for item in tokens
        if not item.is_space and not item.is_punct and item.dep_ != "det" 
        and item.lemma_.lower() not in entiy_discourse_words
    )

def print_tokens(doc):
    for token in doc:
        print(
            f"{token.i:<15}"
            f"{token.text:<15}"
            f"POS={token.pos_:<6}"
            f"DEP={token.dep_:<12}"
            f"HEAD={token.head.text}"
        )

def classify_trigger(token):
    lemma = token.lemma_.lower()

    result = {
        "assertion": "present",
        "trend": None,
        "action": None,
    }

    if lemma in negation_lemmas:
        result["assertion"] = "absent"

    elif lemma in improvement_words:
        result["trend"] = "improving"

    elif lemma in resolution_words:
        result["assertion"] = "absent"
        result["trend"] = "resolved"

    elif lemma in worsening_words:
        result["trend"] = "worsening"

    elif lemma in stable_words:
        result["trend"] = "stable"

        child_lemmas = {child.lemma_.lower() for child in token.children}

        if "elevated" in child_lemmas:
            result["trend"] = "stable_abnormal"

        elif "improved" in child_lemmas:
            result["trend"] = "improving"

    elif lemma in new_words:
        result["trend"] = "new"

    if lemma in medication_action_words:
        result["action"] = (medication_action_words[lemma])

    return result

def build_trigger_phrase(token):
    included_tokens = [token]

    for child in token.children:
        if child.dep_ in {"advmod", "neg", "xcomp", "acomp", "attr", "oprd"}:
            included_tokens.append(child)

    included_tokens.sort(key=lambda item: item.i)

    return " ".join(item.text for item in included_tokens)

def find_umls_entity_for_token(token, linked_entities, relationship_text=None):
    candidates = []

    for linked_entity in linked_entities:
        entity_span = linked_entity["entity"]

        if entity_span.start <= token.i < entity_span.end:
            candidates.append(linked_entity)

    if not candidates:
        return None

    candidates.sort(key=lambda entity: (len(entity["entity"]), entity["score"]), reverse=True)

    best = candidates[0]

    if relationship_text is not None:
        relationship_text_lower = relationship_text.lower()
        linked_text_lower = best["text"].lower()

        if linked_text_lower not in relationship_text_lower:
            return None

        is_partial_match = (linked_text_lower != relationship_text_lower)

        if (is_partial_match and best["score"] < 0.90):
            return None

    return best


def find_umls_entity_by_text(relationship_text, linked_entities):
    search_text = relationship_text.strip().lower()

    matches = [
        linked_entity
        for linked_entity in linked_entities
        if linked_entity["text"].strip().lower() == search_text
    ]

    if not matches:
        return None

    return max(matches, key=lambda entity: entity["score"])

def semantic_codes_to_bitmask(codes):
    bitmask = 0

    for index, semantic_code in enumerate(allowed_semantic_codes):
        if semantic_code in codes:
            bitmask |= (1 << index)

    return bitmask