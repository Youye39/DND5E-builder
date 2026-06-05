import { useRef, useState } from "react";

export default function AppearanceSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  return (
    <div
      className="absolute bg-[#f6f6f6] h-[433px] left-[55px] overflow-clip shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] top-[136px] w-[415px]"
      data-name="角色外貌"
    >
      <div
        className="absolute bg-white h-[403px] right-[14px] rounded-[2px] top-[15px] w-[387px]"
        data-name="角色外貌"
      >
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <div
            className="absolute right-[9px] size-[369px] top-[10px] cursor-pointer overflow-hidden"
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="角色外貌"
                className="size-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[#efefef]" />
            )}
            {isHovered && (
              <div className="absolute inset-0 bg-[#b3b3b3]/20 flex items-center justify-center transition-colors">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    d="M24 10v28M10 24h28"
                    stroke="#b3b3b3"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            className="[word-break:break-word] absolute bottom-[12px] flex flex-col font-['Noto_Serif:Medium',sans-serif] font-medium justify-center leading-[0] left-[100px] right-[101px] text-[10px] text-black text-center translate-y-1/2"
            style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
          >
            <p className="leading-[normal]">角色外貌</p>
          </div>
        </div>
        <div
          aria-hidden
          className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]"
        />
      </div>
    </div>
  );
}
