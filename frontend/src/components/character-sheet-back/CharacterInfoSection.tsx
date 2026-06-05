import SectionContainer from "../common/SectionContainer";
import EditableInfoField from "./EditableInfoField";
import EditableScrollArea from "../common/EditableScrollArea";
import EmblemSection from "./EmblemSection";

interface CharacterInfoData {
  name: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  eyeColor: string;
  skinColor: string;
  hairColor: string;
  appearance: string;
  emblem: string;
  organization: string;
}

interface CharacterInfoSectionProps {
  data: CharacterInfoData;
  onChange: (field: keyof CharacterInfoData, value: string) => void;
}

function NameField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="absolute contents left-[14px] top-[calc(50%-160px)]" data-name="姓名">
      <div className="-translate-y-1/2 absolute bg-[#efefef] h-[55px] left-[14px] overflow-clip top-[calc(50%-150.5px)] w-[344px]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Noto_Serif:Regular',sans-serif] font-normal h-[55px] justify-center leading-[0] left-[10px] text-[24px] text-black top-[27.5px] w-[334px] bg-transparent outline-none"
          style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
        />
      </div>
      <div
        className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Noto_Serif:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] left-[17px] text-[#595959] text-[14px] top-[calc(50%-189px)] w-[341px]"
        style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
      >
        <p className="leading-[normal]">姓名</p>
      </div>
    </div>
  );
}

function AppearanceDescField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="absolute h-[128px] left-[14px] top-[252px] w-[651px]" data-name="形象">
      <p
        className="[word-break:break-word] absolute font-['Noto_Serif:Regular',sans-serif] font-normal h-[17px] leading-[normal] left-[3px] text-[#595959] text-[12px] top-0 w-[648px]"
        style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
      >
        形象
      </p>
      <EditableScrollArea
        value={value}
        onChange={onChange}
        className="absolute bg-[#efefef] h-[111px] left-0 top-[17px] w-[651px]"
        innerClassName="pl-[10px] pt-[6px] pb-[6px]"
      />
    </div>
  );
}

export type { CharacterInfoData };

export default function CharacterInfoSection({ data, onChange }: CharacterInfoSectionProps) {
  return (
    <SectionContainer title="角色信息" className="h-[418px] left-[491px] top-[151px] w-[679px]">
      <NameField value={data.name} onChange={(v) => onChange("name", v)} />
      <div className="absolute contents left-[14px] top-[90px]" data-name="基本信息">
        <EditableInfoField
          label="性别"
          value={data.gender}
          onChange={(v) => onChange("gender", v)}
          className="left-[14px] top-[90px]"
        />
        <EditableInfoField
          label="年龄"
          value={data.age}
          onChange={(v) => onChange("age", v)}
          className="left-[14px] top-[144px]"
        />
        <EditableInfoField
          label="瞳色"
          value={data.eyeColor}
          onChange={(v) => onChange("eyeColor", v)}
          className="left-[14px] top-[198px]"
        />
        <EditableInfoField
          label="身高"
          value={data.height}
          onChange={(v) => onChange("height", v)}
          className="left-[235px] top-[144px]"
        />
        <EditableInfoField
          label="肤色"
          value={data.skinColor}
          onChange={(v) => onChange("skinColor", v)}
          className="left-[235px] top-[198px]"
        />
        <EditableInfoField
          label="体重"
          value={data.weight}
          onChange={(v) => onChange("weight", v)}
          className="left-[456px] top-[144px]"
        />
        <EditableInfoField
          label="发色"
          value={data.hairColor}
          onChange={(v) => onChange("hairColor", v)}
          className="left-[456px] top-[198px]"
        />
      </div>
      <AppearanceDescField value={data.appearance} onChange={(v) => onChange("appearance", v)} />
      <EmblemSection
        emblem={data.emblem}
        organization={data.organization}
        onEmblemChange={(v) => onChange("emblem", v)}
        onOrganizationChange={(v) => onChange("organization", v)}
      />
    </SectionContainer>
  );
}
