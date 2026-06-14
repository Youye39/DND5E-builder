import EditableScrollArea from "../../shared/components/EditableScrollArea";

interface PersonalityTraitComponentProps {
  className?: string;
  label: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function PersonalityTraitComponent({
  className,
  label,
  value = "",
  onValueChange
}: PersonalityTraitComponentProps) {
  const handleChange = (newValue: string) => {
    onValueChange?.(newValue);
  };

  return (
    <div className={className || "bg-white h-[107px] relative rounded-[2px] w-[330px]"} data-name="个性特点">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <EditableScrollArea
          value={value}
          onChange={handleChange}
          className="!absolute bottom-[24px] left-[9px] h-[73px] w-[312px] pl-[5px]"
          innerClassName="!font-serif-regular-cjk !text-[16px]"
          placeholder=""
        />
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] left-[100px] right-[101px] text-[10px] text-black text-center top-[95px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">{label}</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
    </div>
  );
}
