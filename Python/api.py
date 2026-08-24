from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel

from nlp.models import nlp as NLP
from nlp.extraction import extract_linked_relationships


app = FastAPI()


class ClinicalTextRequest(BaseModel):
    text: str


class ClinicalRelationship(BaseModel):
    entity: Optional[str] = None
    trigger: Optional[str] = None
    assertion: Optional[str] = None
    trend: Optional[str] = None
    action: Optional[str] = None
    cui: Optional[str] = None
    canonical: Optional[str] = None
    semanticCodes: Optional[int] = 0


class ClinicalTextResponse(BaseModel):
    text: str
    entities: list[ClinicalRelationship]




@app.post("/clinical-text", response_model=ClinicalTextResponse)
def process_clinical_text(request: ClinicalTextRequest):

    doc = NLP(request.text)

    relationships = extract_linked_relationships(doc)

    print(doc.text)

    for relationship in relationships:
        print(relationship)

    return ClinicalTextResponse(
        text=request.text,
        entities=relationships
    )               