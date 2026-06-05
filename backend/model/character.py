from pydantic import BaseModel, ConfigDict, Field, computed_field

from constants.skills import SKILL_ATTRIBUTES

class BasicInfo(BaseModel):
    model_config = ConfigDict(validate_assignment=True)
    id: int
    name: str
    class_: str
    subclass: str
    level: int = Field(default=1, ge=1, le=20)
    background: str
    player: str
    race: str
    alignment: str
    xp: int = Field(default=0, ge=0)
    inspiration: bool = False

    @computed_field
    @property
    def proficiency_bonus(self) -> int:
        return (self.level + 7) // 4



class Attributes(BaseModel):
    model_config = ConfigDict(validate_assignment=True)
    str_value: int = Field(default=10, ge=1, le=30)
    dex_value: int = Field(default=10, ge=1, le=30)
    con_value: int = Field(default=10, ge=1, le=30)
    int_value: int = Field(default=10, ge=1, le=30)
    wis_value: int = Field(default=10, ge=1, le=30)
    cha_value: int = Field(default=10, ge=1, le=30)

    @computed_field
    @property              
    def str_adj(self) -> int:
        return (self.str_value - 10) // 2

    @computed_field
    @property
    def dex_adj(self) -> int:
        return (self.dex_value - 10) // 2

    @computed_field
    @property
    def con_adj(self) -> int:
        return (self.con_value - 10) // 2

    @computed_field
    @property
    def int_adj(self) -> int:
        return (self.int_value - 10) // 2

    @computed_field
    @property
    def wis_adj(self) -> int:
        return (self.wis_value - 10) // 2

    @computed_field
    @property
    def cha_adj(self) -> int:
        return (self.cha_value - 10) // 2

class SkillStatus(BaseModel):
    proficient: bool = False
    expertise: bool = False

class Skills(BaseModel):
    model_config = ConfigDict(validate_assignment=True)
    acrobatics: SkillStatus = SkillStatus()
    animal_handling: SkillStatus = SkillStatus()
    arcana: SkillStatus = SkillStatus()
    athletics: SkillStatus = SkillStatus()
    deception: SkillStatus = SkillStatus()
    history: SkillStatus = SkillStatus()
    insight: SkillStatus = SkillStatus()
    intimidation: SkillStatus = SkillStatus()
    investigation: SkillStatus = SkillStatus()
    medicine: SkillStatus = SkillStatus()
    nature: SkillStatus = SkillStatus()
    perception: SkillStatus = SkillStatus()
    performance: SkillStatus = SkillStatus()
    persuasion: SkillStatus = SkillStatus()
    religion: SkillStatus = SkillStatus()
    sleight_of_hand: SkillStatus = SkillStatus()
    stealth: SkillStatus = SkillStatus()
    survival: SkillStatus = SkillStatus()

    def get_bonus(self, skill_name: str, attribute: Attributes, bonus: int) -> int:
        attr = SKILL_ATTRIBUTES[skill_name]
        adj = getattr(attribute, f"{attr}_adj")
        status = getattr(self, skill_name)
        if status.expertise:
            return adj + (bonus * 2)
        elif status.proficient:
            return adj + bonus
        else:
            return adj
        
class Personality(BaseModel):
    characteristic: str
    ideal: str
    bond: str
    flaw: str
    avatar_url: str = ""
    age: int 
    height: str
    weight: str
    eyes: str
    skin: str
    hair: str
    story: str

class Character(BaseModel):
    basic_info: BasicInfo
    attributes: Attributes
    skills: Skills
    personality: Personality
