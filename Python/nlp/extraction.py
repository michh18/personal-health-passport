from wordset import *
from helper_functions import *
from linking import get_entity_info, find_umls_entity_for_token, find_umls_entity_by_text

def extract_no_evidence_relationships(doc):
    relationships = []

    for evidence in doc:
        if evidence.lemma_.lower() != "evidence":
            continue

        has_no = any(
            child.text.lower() == "no"
            for child in evidence.children
        )

        if not has_no:
            continue

        for child in evidence.children:
            if child.dep_ in {
                "nmod",
                "pobj",
            }:
                relationships.append({
                    "_token": child,
                    "entity": build_entity_phrase(child),
                    "trigger": "no evidence",
                    "assertion": "absent",
                    "trend": None,
                    "action": None,
                })

    return relationships

def extract_clinical_relationships(doc):
    trigger_lemmas = (
        improvement_words
        | resolution_words
        | worsening_words
        | stable_words
        | new_words
        | existence_words
        | negation_lemmas
        | set(medication_action_words)
        | set(dose_action_words)
    )

    relationships = []
    seen = set()

    for trigger in doc:
        lemma = trigger.lemma_.lower()

        if lemma not in trigger_lemmas:
            continue

        if trigger.dep_ in {"xcomp", "acomp", "attr", "oprd"}:
            for ancestor in trigger.ancestors:
                subjects = [
                    child
                    for child in ancestor.children
                    if child.dep_ in {"nsubj", "nsubjpass"} and child.pos_ in {"NOUN", "PROPN"}
                ]

                if subjects:
                    for subject in subjects:
                        argument_tokens.extend(get_conj_entities(subject))

                    break

        context = classify_trigger(trigger)
        argument_tokens = []

        if lemma in negation_lemmas:
            allowed_dependencies = {"dobj", "obj", "attr", "conj"}

        elif lemma in medication_action_words:
            allowed_dependencies = {"dobj", "obj", "attr", "conj", "nsubjpass", "nmod", "pobj"}
        
        elif lemma in existence_words:
            allowed_dependencies = {"dobj", "obj", "attr", "conj", "nmod"}

        else:
            allowed_dependencies = {"dobj", "obj", "conj", "nsubj", "nsubjpass"}

        for child in trigger.children:
            if (child.dep_ in allowed_dependencies and child.pos_ in {"NOUN", "PROPN"}):
                argument_tokens.extend(get_conj_entities(child))

        if trigger.dep_ in {"xcomp", "acomp", "attr", "oprd"}:
            governing_verb = trigger.head

            for child in governing_verb.children:
                if child.dep_ in {"nsubj", "nsubjpass"}:
                    argument_tokens.extend(get_conj_entities(child))

        if (not argument_tokens and trigger.dep_ == "conj"):
            governing_trigger = trigger.head

            for child in governing_trigger.children:
                if child.dep_ in {"nsubj", "nsubjpass", "dobj", "obj"}:
                    argument_tokens.extend(get_conj_entities(child))

        argument_tokens = list({token.i: token for token in argument_tokens}.values())

        for argument in argument_tokens:
            entity_phrase = build_entity_phrase(argument)

            assertion = context["assertion"]

            if check_negation(argument):
                assertion = "absent"

            action = context["action"]
            trend = context["trend"]

            entity_words = {word.lower() for word in entity_phrase.split()}

            if lemma in dose_action_words:
                if "dose" in entity_words:
                    action = dose_action_words[lemma]
                    trend = None
                else:
                    action = None

            result = {
                "_token": argument,
                "entity": entity_phrase,
                "trigger": build_trigger_phrase(trigger),
                "assertion": assertion,
                "trend": trend,
                "action": action,
            }

            result_key = (
                result["entity"].lower(),
                result["trigger"].lower(),
                result["assertion"],
                result["trend"],
                result["action"],
            )

            if result_key not in seen:
                relationships.append(result)
                seen.add(result_key)
                
            for result in extract_no_evidence_relationships(doc):
                result_key = (
                    result["entity"].lower(),
                    result["trigger"].lower(),
                    result["assertion"],
                    result["trend"],
                    result["action"],
                )

                if result_key not in seen:
                    relationships.append(result)
                    seen.add(result_key)

    return relationships
        
def extract_linked_relationships(doc):
    relationships = extract_clinical_relationships(doc)
    linked_entities = get_entity_info(doc)

    results = []

    for relationship in relationships:
        token = relationship.get("_token")

        linked = find_umls_entity_for_token(token, linked_entities, relationship["entity"])

        if linked is None:
            linked = find_umls_entity_by_text(relationship["entity"], linked_entities)

        result = {
            key: value 
            for key, value in relationship.items() 
            if key != "_token"
        }

        result["cui"] = (linked["cui"] if linked else None)
        result["canonical"] = (linked["canonical"] if linked else None)
        result["semantic_codes"] = (linked["semantic_codes"] if linked else [])

        results.append(result)

    return results
