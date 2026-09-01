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

def deidentify_names(text: str) -> str:
    if not text or not text.strip():
        return text

    anonymised_lines = []

    for line in text.splitlines(keepends=True):
        content = line.rstrip("\r\n")
        line_ending = line[len(content):]

        if not content.strip():
            anonymised_lines.append(line)
            continue

        detected_names = analyzer.analyze(
            text=content,
            entities=["PERSON"],
            language="en",
        )

        result = anonymizer.anonymize(
            text=content,
            analyzer_results=detected_names,
            operators={
                "PERSON": OperatorConfig(
                    "replace",
                    {
                        "new_value": "[PERSON]",
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
    text = deidentify_names(text)
    text = deidentify_date_of_birth(text)

    return text


if __name__ == "__main__":
    clinic_text = """
    Rheumatology Outpatient Clinic

    Patient: John Smith
    DOB: 15/3/1985
    NHS number: 123 456 7890

    Dear Mr Smith,

    It was a pleasure to review you in the rheumatology clinic today regarding your ongoing joint pain and morning stiffness.

    You explained that the pain in your hands has worsened over the past three months. Your knee pain remains stable, while your shoulder pain has improved since your previous appointment.

    On examination, there was mild swelling of the joints in both hands. There was no evidence of active inflammation in your knees.

    Please continue taking hydroxychloroquine 200 mg twice daily. We will arrange repeat blood tests and review you again in three months.

    Yours sincerely,

    Dr Sarah Jones
    Consultant Rheumatologist
    """

    anonymised_text = deidentify_text(clinic_text)

    print(anonymised_text)