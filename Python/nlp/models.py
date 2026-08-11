import spacy

nlp = spacy.load("en_core_sci_sm")
nlp.add_pipe("abbreviation_detector")
nlp.add_pipe("scispacy_linker",
    config={
        "linker_name": "umls",
        "resolve_abbreviations": True,
        "threshold": 0.80,
        "max_entities_per_mention": 5,
    },
)