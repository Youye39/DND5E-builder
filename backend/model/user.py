from pydantic import BaseModel, Field
from model.character import Character

class SaveSlot(BaseModel):
    slot_id: int = Field(ge=1, le=10)
    is_empty: bool = True
    character: Character | None = None