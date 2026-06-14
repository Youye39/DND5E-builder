import type { ReactNode } from "react";

interface SectionContainerProps {
  title: string;
  className?: string;
  children: ReactNode;
}

export default function SectionContainer({ title, className = "", children }: SectionContainerProps) {
  return (
    <div className={`absolute bg-white rounded-[2px] ${className}`}>
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute bg-black bottom-0 h-[24px] overflow-clip w-full" data-name="边栏">
          <div
            className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-bold-cjk font-bold justify-center leading-[0] left-[100px] right-[101px] text-[10px] text-center text-white top-[12px]"
            style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
          >
            <p className="leading-[normal]">{title}</p>
          </div>
        </div>
        {children}
      </div>
      <div
        aria-hidden
        className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]"
      />
    </div>
  );
}
