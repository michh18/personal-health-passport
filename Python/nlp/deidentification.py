from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig


analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()


def deidentify_names(text: str) -> str:
    if not text or not text.strip():
        return text

    detected_names = analyzer.analyze(
        text=text,
        entities=["PERSON"],
        language="en",
    )

    result = anonymizer.anonymize(
        text=text,
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

    return result.text


if __name__ == "__main__":
    clinic_text = """
    John Smith attended the rheumatology clinic today.
    He was reviewed by Dr Sarah Jones.
    """

    anonymised_text = deidentify_names(clinic_text)

    print(anonymised_text)