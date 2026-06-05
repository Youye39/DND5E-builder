import { useRef, useState } from "react";

interface EmblemSectionProps {
  emblem: string;
  organization: string;
  onEmblemChange: (value: string) => void;
  onOrganizationChange: (value: string) => void;
}

export default function EmblemSection({
  emblem,
  organization,
  onEmblemChange,
  onOrganizationChange,
}: EmblemSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEmblemHovered, setIsEmblemHovered] = useState(false);
  const [emblemImage, setEmblemImage] = useState<string | null>(emblem || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEmblemImage(url);
    onEmblemChange(url);
  };

  const hasOrgInput = organization.trim().length > 0;
  const orgTextColor = hasOrgInput ? "text-[#595959]" : "text-[#e7e7e7]";

  return (
    <div className="absolute contents left-[555px] top-[14px]" data-name="徽记">
      {/* 信仰/组织/家族 — editable field */}
      <div
        className="-translate-x-1/2 absolute bottom-[408px] left-[610px] translate-y-full w-[110px] h-[17px]"
      >
        <input
          type="text"
          value={organization}
          onChange={(e) => onOrganizationChange(e.target.value)}
          placeholder="信仰/组织/家族"
          className={`w-full h-full bg-transparent outline-none border-0 p-0 text-center font-['Noto_Serif:Regular',sans-serif] text-[12px] leading-[normal] ${orgTextColor}`}
          style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
        />
      </div>

      {/* 徽记 — clickable emblem area with image upload */}
      <div
        className="absolute border border-[#efefef] border-solid left-[555px] overflow-clip size-[110px] top-[31px] cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={() => setIsEmblemHovered(true)}
        onMouseLeave={() => setIsEmblemHovered(false)}
      >
        {/* Content container with 2px padding */}
        <div className="absolute inset-[2px] overflow-hidden">
          {emblemImage ? (
            <img src={emblemImage} alt="徽记" className="size-full object-cover" />
          ) : (
            <div className="size-full bg-white" />
          )}

          {/* "徽记" text — hidden when image is uploaded */}
          {!emblemImage && (
            <p
              className="absolute inset-0 flex items-center justify-center font-['Noto_Serif:Regular',sans-serif] font-normal text-[#efefef] text-[12px]"
              style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
            >
              徽记
            </p>
          )}
        </div>

        {/* Hover overlay with plus sign */}
        {isEmblemHovered && (
          <div className="absolute inset-0 bg-[#b3b3b3]/20 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 6v20M6 16h20"
                stroke="#b3b3b3"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
