import re
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig


analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

DATE_OF_BIRTH_PATTERN = re.compile(
    r"(?P<label>"
    r"(?:date\s+of\s+birth|d\.?\s*o\.?\s*b\.?)"
    r"\s*:?\s*"
    r")"
    r"(?P<date>"
    r"\d{1,2}"
    r"(?:st|nd|rd|th)?"
    r"(?:[./-]|\s+)"
    r"(?:"
    r"\d{1,2}|"
    r"Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|"
    r"May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|"
    r"Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?"
    r")"
    r"(?:[./-]|\s+)"
    r"\d{2,4}"
    r")",
    re.IGNORECASE,
)

def deidentify_presidio_entities(text: str) -> str:
    if not text or not text.strip():
        return text

    anonymised_lines = []

    for line in text.splitlines(keepends=True):
        content = line.rstrip("\r\n")
        line_ending = line[len(content):]

        if not content.strip():
            anonymised_lines.append(line)
            continue

        detected_entities = analyzer.analyze(
            text=content,
            entities=[
                "PERSON",
                "UK_NHS",
            ],
            language="en",
        )

        result = anonymizer.anonymize(
            text=content,
            analyzer_results=detected_entities,
            operators={
                "PERSON": OperatorConfig(
                    "replace",
                    {
                        "new_value": "[PERSON]",
                    },
                ),
                "UK_NHS": OperatorConfig(
                    "replace",
                    {
                        "new_value": "[NHS_NUMBER]",
                    },
                ),
            },
        )

        anonymised_lines.append(result.text + line_ending)

    return "".join(anonymised_lines)

def deidentify_date_of_birth(text: str) -> str:
    if not text or not text.strip():
        return text

    return DATE_OF_BIRTH_PATTERN.sub(
        lambda match: (
            f"{match.group('label')}[DATE_OF_BIRTH]"
        ),
        text,
    )

def deidentify_text(text: str) -> str:
    text = deidentify_presidio_entities(text)
    text = deidentify_date_of_birth(text)

    return text