from fastapi import FastAPI
from model.character import Character, BasicInfo, Attributes, Skills, SkillStatus, Personality
from model.user import SaveSlot

app = FastAPI()

# 测试数据：奈瓦拉
FAKE_CHARACTER = Character(
    basic_info=BasicInfo(
        id=1,
        name="奈瓦拉 溪木",
        class_="畸变心智术士",
        subclass="畸变心智",
        level=1,
        background="公会工匠",
        player="由页",
        race="半木精灵",
        alignment="混乱善良",
        xp=0,
        inspiration=False
    ),
    attributes=Attributes(
        str_value=8,
        dex_value=14,
        con_value=14,
        int_value=12,
        wis_value=12,
        cha_value=19
    ),
    skills=Skills(
        acrobatics=SkillStatus(proficient=True),
        deception=SkillStatus(proficient=True),
        insight=SkillStatus(proficient=True),
        persuasion=SkillStatus(proficient=True),
    ),
    personality=Personality(
        characteristic="我总是想搞清楚事物如何运作，人们为何奔波。",
        ideal="自由。任何人都有选择营生方式的自由。（混乱）",
        bond="我要向那个破坏我工坊、毁掉我生活的邪恶势力复仇。",
        flaw="我会为了获得某些珍贵无价之物做任何事。",
        avatar_url="",
        age=26,
        height="5'5\"",
        weight="128",
        eyes="青",
        skin="淡黄",
        hair="赤铜",
        story="..."
    )
)

@app.get("/characters/{char_id}")
def get_character(char_id: int):
    return FAKE_CHARACTER.model_dump()

@app.post("/characters")
def create_character(saveslot: SaveSlot):
    if (not saveslot.is_empty) or (saveslot.character is not None):
        return {"error": "保存槽已被占用"}
    else:
        slot_id = saveslot.slot_id
    char = Character(
        basic_info=BasicInfo(id=slot_id, name="", class_="", subclass="", background="", player="", race="", alignment=""),
        attributes=Attributes(),
        skills=Skills(),
        personality=Personality(characteristic="", ideal="", bond="", flaw="", age=0, height="", weight="", eyes="", skin="", hair="", story="")
    )
    return char.model_dump()

@app.put("/characters/{char_id}")
def update_character(char_id: int, char: Character):
    """更新角色（现在只是返回传入的数据）"""
    return char.model_dump()