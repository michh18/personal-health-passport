from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig


analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()


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


if __name__ == "__main__":
    clinic_text = """
    Rheumatology Outpatient Clinic

    Patient: John Smith
    Date of birth: 15 March 1985
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

    anonymised_text = deidentify_names(clinic_text)

    print(anonymised_text)