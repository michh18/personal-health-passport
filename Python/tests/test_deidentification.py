from nlp.deidentification import deidentify_text

def test_deidentify_patient_details():
    text = """
    Patient: John Smith
    DOB: 15/3/1985
    NHS number: 943 476 5919
    """

    result = deidentify_text(text)

    assert "John Smith" not in result
    assert "15/3/1985" not in result
    assert "943 476 5919" not in result

    assert "[PERSON]" in result
    assert "[DATE_OF_BIRTH]" in result
    assert "[NHS_NUMBER]" in result