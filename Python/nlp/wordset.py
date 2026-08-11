allowed_semantic_codes = {
    # Disorders, findings and symptoms
    "T019", "T020", "T033", "T037",
    "T046", "T047", "T048", "T049",
    "T184", "T190", "T191",

    # Laboratory or test results
    "T034",
    
    # Clinical attributes/functions
    "T032", "T039", "T040", "T042", "T201",

    # Medication
    "T121", "T195", "T200",
    
    # Procedures
    "T059", "T060", "T061"
}

negation_lemmas = {
    "deny",
    "exclude"
}

negation_words = {
    "no",
    "not",
    "without",
    "neither"
}

improvement_words = {
    "improve",
    "decrease",
    "recover",
    "remit",
    "respond"
}

resolution_words = {
    "resolve",
    "subside"
}

worsening_words = {
    "worse",
    "worsen",
    "deteriorate",
    "decline",
    "progress",
    "exacerbate",
    "increase",
    "rise",
    "relapse"
}

stable_words = {
    "stable",
    "remain",
    "unchanged",
    "control",
    "persist"
}

new_words = {
    "develop",
    "arise",
    "emerge"
}

existence_words = {
    "have",
    "diagnose"
}

medication_action_words = {
    "start": "started",
    "continue": "continued",
    "stop": "stopped",
    "discontinue": "stopped",
    "hold": "held"
}

dose_action_words = {
    "reduce": "dose_reduced",
    "increase": "dose_increased"
}

status_entity_lemmas = (
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

note_headings = {
    "history",
    "assessment",
    "impression",
    "plan",
}

entiy_discourse_words = {
    "overall",
    "generally",
    "clinically"
}