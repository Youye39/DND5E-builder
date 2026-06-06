import { useState } from "react";
import svgPaths from "../assets/dnd.ts";
import AttributeComponent from "./components/AttributeComponent.tsx";
import PersonalityTraitComponent from "./components/PersonalityTraitComponent.tsx";
import ProficiencyBonusComponent from "./components/ProficiencyBonusComponent.tsx";
import SavingThrowPanel from "./components/SavingThrowSection/SavingThrowPanel.tsx";
import SkillPanel from "./components/SkillSection/SkillPanel.tsx";
import AttackPanel from "./components/AttackSection/AttackPanel.tsx";
import ProficiencyPanel from "./components/ProficiencyPanel.tsx";
import EquipmentPanel from "./components/EquipmentPanel.tsx";
import TraitsPanel from "./components/TraitsPanel.tsx";
import DeathSaveComponent from "./components/DeathSaveComponent.tsx";
import CoinComponent from "./components/CoinComponent.tsx";
import PassivePerception from "./components/PassivePerception.tsx";
import LevelDisplay from "./components/LevelDisplay.tsx";
import CharacterName from "./components/CharacterName.tsx";
import BasicInfo from "./components/BasicInfo.tsx";
import CombatStatBox from "./components/CombatStatBox.tsx";
import HeaderBrand from "../shared/components/logo";

// ============================================================================
// Logo 和图标组件
// ============================================================================

function ShortRestClock() {
  return (
    <div className="absolute left-[12px] size-[21px] top-[4px]" data-name="short-rest-icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="short-rest-icon">
          <path d={svgPaths.p248c1e80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function LongRestClock() {
  return (
    <div className="absolute left-[12px] size-[21px] top-[4px]" data-name="long-rest-icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="long-rest-icon">
          <path d={svgPaths.p27c46d80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 头部区域
// ============================================================================


function BasicInfoSection({ level, onLevelChange, characterName, onCharacterNameChange }: { level?: number | ""; onLevelChange?: (lvl: number | "") => void; characterName?: string; onCharacterNameChange?: (name: string) => void }) {
  return (
    <div className="absolute bg-black h-[179px] left-[55px] overflow-clip rounded-tl-[5px] rounded-tr-[5px] shadow-[0px_0px_2px_0px_black] top-[51px] w-[1114px]" data-name="basic-info">
      <div className="absolute contents left-[29px] top-[29px]">
        <HeaderBrand className="absolute contents left-[29px] top-[97px]"/>
        <LevelDisplay level={level} onLevelChange={onLevelChange} />
        <BasicInfo />
        <CharacterName value={characterName} onChange={onCharacterNameChange} />
      </div>
    </div>
  );
}

// ============================================================================
// 战斗统计区
// ============================================================================

const calculateModifier = (attrValue: number): string => {
  const modifier = Math.floor((attrValue - 10) / 2);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

function CombatStatsRow({ attributes }: { attributes?: Record<string, number> }) {
  return (
    <div className="absolute contents">
      <div className="absolute left-[14px] top-[15px]">
        <CombatStatBox label="护甲等级" value="15" />
      </div>
      <div className="absolute left-[129px] top-[15px]">
        <CombatStatBox label="先攻" value={calculateModifier(attributes?.dex_value ?? 10)} />
      </div>
      <div className="absolute left-[244px] top-[15px]">
        <CombatStatBox label="速度" value="30" />
      </div>
    </div>
  );
}

// ============================================================================
// 血量和临时血量区
// ============================================================================

function TempHPDisplay() {
  return (
    <div className="absolute bg-white h-[103px] left-[14px] rounded-[2px] top-[268px] w-[330px]" data-name="temp-hp">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] absolute bottom-[16px] flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] left-0 right-0 text-[12px] text-black text-center translate-y-1/2" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">临时生命值</p>
        </div>
        <div className="absolute bg-sheet-content-bg h-[62px] left-[9px] top-[10px] w-[312px]" />
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-regular font-normal h-[60px] justify-center leading-[0] left-[165px] text-[36px] text-black text-center top-[41px] w-[312px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]"></p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
    </div>
  );
}

function HPDisplay() {
  return (
    <div className="absolute bg-white bottom-[234px] h-[124px] right-[14px] rounded-[2px] w-[330px]" data-name="hp">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] absolute bottom-[16px] flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] left-[165px] right-0 text-[12px] text-black text-center translate-y-1/2" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">生命值上限</p>
        </div>
        <div className="[word-break:break-word] absolute bottom-[16px] flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] left-0 right-[165px] text-[12px] text-black text-center translate-y-1/2" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">当前生命值</p>
        </div>
        <div className="absolute bg-sheet-content-bg h-[83px] left-[9px] top-[10px] w-[141px]" />
        <div className="absolute bg-[#efefef] h-[83px] left-[180px] top-[10px] w-[141px]" />
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-regular font-normal h-[60px] justify-center leading-[0] left-[79px] text-[48px] text-black text-center top-[50px] w-[82px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">8</p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-regular font-normal h-[60px] justify-center leading-[0] left-[250px] text-[48px] text-black text-center top-[50px] w-[82px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">8</p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-regular font-normal h-[60px] justify-center leading-[0] left-[165px] text-[48px] text-black text-center top-[50px] w-[20px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">/</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
    </div>
  );
}

function HealthSection() {
  return (
    <div className="absolute contents left-[14px] top-[133px]">
      <TempHPDisplay />
      <HPDisplay />
    </div>
  );
}

// ============================================================================
// 休息和生命骰区
// ============================================================================

function RestIcon({ type }: { type: "short" | "long" }) {
  const Icon = type === "short" ? ShortRestClock : LongRestClock;
  const label = type === "short" ? "短休" : "长休";
  return (
    <div className="bg-black h-[42px] rounded-[2px] w-[45px]" data-name={`${type}-rest`}>
      <div className="overflow-visible relative rounded-[inherit] size-full">
        <div className="relative h-full w-full cursor-pointer transition-all duration-200 hover:scale-110 active:scale-100">
          <Icon />
          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-medium-cjk font-medium h-[8px] justify-center leading-[0] left-1/2 text-[10px] text-center text-white top-[calc(50%+10px)] w-[21px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
            <p className="leading-[normal]">{label}</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_-1px_0px_0px_black,0px_1px_0px_0px_black]" />
    </div>
  );
}

function HitDiceDisplay() {
  return (
    <div className="absolute bg-white h-[90px] left-[62px] rounded-[2px] top-[386px] w-[149px]" data-name="hit-dice">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute contents right-[9px] top-[10px]">
          <div className="absolute bg-sheet-content-bg h-[56px] overflow-clip right-[9px] top-[10px] w-[131px]">
            <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-regular font-normal h-[56px] justify-center leading-[0] left-[65.5px] text-[24px] text-black text-center top-[28px] w-[131px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
              <p className="leading-[normal]">1d6</p>
            </div>
          </div>
          <div className="[word-break:break-word] absolute bottom-[12px] flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] right-[74.5px] text-[10px] text-black text-center translate-x-1/2 translate-y-1/2 w-[131px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
            <p className="leading-[normal]">生命骰</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[-4px_0px_0px_0px_black,0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
    </div>
  );
}

function DeathSaveDisplay() {
  return (
    <div className="absolute bg-white h-[90px] left-[226px] rounded-[2px] top-[386px] w-[118px]" data-name="death-save">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[24px] left-[calc(50%-0.5px)] overflow-clip top-[calc(50%+33px)] w-[117px]">
          <div className="[word-break:break-word] absolute bottom-[12px] flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] left-0 right-0 text-[10px] text-black text-center translate-y-1/2" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
            <p className="leading-[normal]">死亡豁免</p>
          </div>
        </div>
        <DeathSaveComponent
          className="-translate-x-1/2 -translate-y-1/2 absolute h-[14px] left-1/2 top-[calc(50%-18px)] w-[80px]"
          label="成功"
        />
        <DeathSaveComponent
          className="-translate-x-1/2 -translate-y-1/2 absolute h-[14px] left-1/2 top-[calc(50%+4px)] w-[80px]"
          label="失败"
        />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
    </div>
  );
}

function RestsAndDeathSection() {
  return (
    <div className="absolute contents">
      <div className="absolute contents" data-name="rest">
        <div className="absolute left-[14px] top-[386px]">
          <RestIcon type="short" />
        </div>
        <div className="absolute left-[14px] top-[434px]">
          <RestIcon type="long" />
        </div>
      </div>
      <HitDiceDisplay />
      <DeathSaveDisplay />
    </div>
  );
}

// ============================================================================
// 战斗面板容器
// ============================================================================

function CombatSection({ attributes }: { attributes?: Record<string, number> }) {
  return (
    <div className="absolute bg-sheet-panel-bg h-[491px] left-[433px] overflow-clip shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] top-[254px] w-[358px]" data-name="combat">
      <CombatStatsRow attributes={attributes} />
      <HealthSection />
      <RestsAndDeathSection />
    </div>
  );
}

// ============================================================================
// 右侧面板：个性特征
// ============================================================================

function PersonalityPanel() {
  return (
    <div className="absolute bg-sheet-panel-bg h-[491px] left-[811px] overflow-clip shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] top-[254px] w-[358px]" data-name="personality">
      <PersonalityTraitComponent
        className="absolute bg-white h-[107px] left-[14px] rounded-[2px] top-[15px] w-[330px]"
        label="个性特点"
        initialValue=""
      />
      <PersonalityTraitComponent
        className="absolute bg-white h-[107px] left-[14px] rounded-[2px] top-[133px] w-[330px]"
        label="理想"
        initialValue=""
      />
      <PersonalityTraitComponent
        className="absolute bg-white h-[107px] left-[14px] rounded-[2px] top-[251px] w-[330px]"
        label="牵绊"
        initialValue=""
      />
      <PersonalityTraitComponent
        className="absolute bg-white h-[107px] left-[14px] rounded-[2px] top-[369px] w-[330px]"
        label="缺点"
        initialValue=""
      />
    </div>
  );
}

// ============================================================================
// 下方面板：装备和金币
// ============================================================================

function CoinsGrid() {
  return (
    <div className="absolute contents left-[448px] top-[1083px]" data-name="coins">
      <CoinComponent
        className="absolute bg-white h-[58px] left-[448px] rounded-[2px] top-[1083px] w-[56px]"
        label="CP"
        initialValue=""
      />
      <CoinComponent
        className="absolute bg-white h-[58px] left-[516px] rounded-[2px] top-[1083px] w-[56px]"
        label="SP"
        initialValue=""
      />
      <CoinComponent
        className="absolute bg-white h-[58px] left-[584px] rounded-[2px] top-[1083px] w-[56px]"
        label="EP"
        initialValue=""
      />
      <CoinComponent
        className="absolute bg-white h-[58px] left-[652px] rounded-[2px] top-[1083px] w-[56px]"
        label="GP"
        initialValue=""
      />
      <CoinComponent
        className="absolute bg-white h-[58px] left-[720px] rounded-[2px] top-[1083px] w-[56px]"
        label="PP"
        initialValue=""
      />
    </div>
  );
}

function EquipmentAndCoinsSection() {
  return (
    <div className="absolute contents left-[433px] top-[1083px]" data-name="equipment-and-coins">
      <EquipmentPanel className="absolute left-[433px] top-[1095px]" />
      <CoinsGrid />
    </div>
  );
}

// ============================================================================
// 属性面板
// ============================================================================

function AttributesPanel({
  attributes,
  onAttributeChange,
}: {
  attributes?: Record<string, number>;
  onAttributeChange?: (field: string, value: number) => void;
}) {
  const finalAttributes = attributes || {
    str_value: 10,
    dex_value: 10,
    con_value: 10,
    int_value: 10,
    wis_value: 10,
    cha_value: 10,
  };

  return (
    <div className="absolute bg-sheet-panel-bg h-[903px] left-[55px] overflow-clip shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] top-[254px] w-[121px]" data-name="attributes">
      <div className="absolute contents left-[12px] top-[29px]">
        <AttributeComponent 
          className="absolute h-[125px] left-[12px] top-[29px] w-[97px]" 
          label="力量" 
          initialValue={finalAttributes.str_value || 10}
          onValueChange={(val) => onAttributeChange?.('str_value', val)}
        />
        <AttributeComponent 
          className="absolute h-[125px] left-[12px] top-[173px] w-[97px]" 
          label="敏捷" 
          initialValue={finalAttributes.dex_value || 10}
          onValueChange={(val) => onAttributeChange?.('dex_value', val)}
        />
        <AttributeComponent 
          className="absolute h-[125px] left-[12px] top-[317px] w-[97px]" 
          label="体质" 
          initialValue={finalAttributes.con_value || 10}
          onValueChange={(val) => onAttributeChange?.('con_value', val)}
        />
        <AttributeComponent 
          className="absolute h-[125px] left-[12px] top-[461px] w-[97px]" 
          label="智力" 
          initialValue={finalAttributes.int_value || 10}
          onValueChange={(val) => onAttributeChange?.('int_value', val)}
        />
        <AttributeComponent 
          className="absolute h-[125px] left-[12px] top-[605px] w-[97px]" 
          label="感知" 
          initialValue={finalAttributes.wis_value || 10}
          onValueChange={(val) => onAttributeChange?.('wis_value', val)}
        />
        <AttributeComponent 
          className="absolute h-[125px] left-[12px] top-[749px] w-[97px]" 
          label="魅力" 
          initialValue={finalAttributes.cha_value || 10}
          onValueChange={(val) => onAttributeChange?.('cha_value', val)}
        />
      </div>
    </div>
  );
}

// ============================================================================
// 主要内容区
// ============================================================================

function SkillsPanel({
  attributes,
  onPerceptionModifierChange,
  proficiencyBonus,
}: {
  attributes?: Record<string, number>;
  onPerceptionModifierChange?: (modifier: number) => void;
  proficiencyBonus?: number;
}) {
  const finalAttributes = attributes
    ? {
        str_value: attributes.str_value || 10,
        dex_value: attributes.dex_value || 10,
        con_value: attributes.con_value || 10,
        int_value: attributes.int_value || 10,
        wis_value: attributes.wis_value || 10,
        cha_value: attributes.cha_value || 10,
      }
    : undefined;

  return(
    <SkillPanel
      className="absolute left-[190px] top-[613px]"
      attributes={finalAttributes}
      proficiencyBonus={proficiencyBonus ?? 2}
      onPerceptionModifierChange={onPerceptionModifierChange}
    />
  );
}

function CharacterCardContent({
  attributes,
  onAttributeChange,
  perceptionModifier,
  onPerceptionModifierChange,
  level,
  onLevelChange,
  proficiencyBonus,
  onProficiencyBonusChange,
  characterName,
  onCharacterNameChange,
}: {
  attributes?: Record<string, number>;
  onAttributeChange?: (field: string, value: number) => void;
  perceptionModifier?: number;
  onPerceptionModifierChange?: (modifier: number) => void;
  level?: number | "";
  onLevelChange?: (lvl: number | "") => void;
  proficiencyBonus?: number;
  onProficiencyBonusChange?: (value: number) => void;
  characterName?: string;
  onCharacterNameChange?: (name: string) => void;
}) {
  return (
    <div className="absolute bg-white h-[1584px] left-0 overflow-clip top-[75px] w-[1224px]" data-name="character-card">
      <BasicInfoSection level={level} onLevelChange={onLevelChange} characterName={characterName} onCharacterNameChange={onCharacterNameChange} />
      <TraitsPanel className="absolute left-[811px] top-[762px]" />
      <PersonalityPanel />
      <EquipmentAndCoinsSection />
      <AttackPanel className="absolute left-[433px] top-[762px]" />
      <CombatSection attributes={attributes} />
      <ProficiencyPanel className="absolute left-[55px] top-[1244px]" />
      <SkillsPanel attributes={attributes} onPerceptionModifierChange={onPerceptionModifierChange} proficiencyBonus={proficiencyBonus} />
      <SavingThrowPanel className="absolute left-[190px] top-[383px]" attributes={attributes} proficiencyBonus={proficiencyBonus} />
      <AttributesPanel attributes={attributes} onAttributeChange={onAttributeChange} />
      <div className="absolute h-[44px] left-[56px] rounded-[2px] top-[1178px] w-[358px]" data-name="passive-perception">
        <PassivePerception perceptionModifier={perceptionModifier ?? Math.floor(((attributes?.wis_value || 10) - 10) / 2)} />
      </div>
      <ProficiencyBonusComponent
        className="absolute h-[44px] left-[190px] rounded-[2px] top-[318px] w-[223px]"
        label="熟练加值"
        level={level}
        showDice={false}
        showInput={true}
        onValueChange={onProficiencyBonusChange}
      />
      <ProficiencyBonusComponent
        className="absolute h-[44px] left-[190px] rounded-[2px] top-[255px] w-[223px]"
        label="激励"
        initialValue={0}
        showDice={true}
        diceClickable={true}
        showInput={false}
      />
    </div>
  );
}

// ============================================================================
// 主要导出组件
// ============================================================================

interface CharacterSheetProps {
  characterName?: string;
  onCharacterNameChange?: (name: string) => void;
}

export default function CharacterSheet({ characterName: externalName, onCharacterNameChange: externalOnChange }: CharacterSheetProps = {}) {
  const [attributes, setAttributes] = useState({
    str_value: 10,
    dex_value: 10,
    con_value: 10,
    int_value: 10,
    wis_value: 10,
    cha_value: 10,
  });
  const [perceptionModifier, setPerceptionModifier] = useState(0);
  const [level, setLevel] = useState<number | "">(1);
  const [proficiencyBonus, setProficiencyBonus] = useState(2);
  const [internalName, setInternalName] = useState("");

  const characterName = externalName ?? internalName;
  const setCharacterName = externalOnChange ?? setInternalName;

  const handleAttributeChange = (field: string, value: number) => {
    setAttributes((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="relative size-full">
      <CharacterCardContent
        attributes={attributes}
        onAttributeChange={handleAttributeChange}
        perceptionModifier={perceptionModifier}
        onPerceptionModifierChange={setPerceptionModifier}
        level={level}
        onLevelChange={setLevel}
        proficiencyBonus={proficiencyBonus}
        onProficiencyBonusChange={setProficiencyBonus}
        characterName={characterName}
        onCharacterNameChange={setCharacterName}
      />
    </div>
  );
}
