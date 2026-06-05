import HeaderBrand from "../common/logo.tsx";

export default function HeaderSection() {
  return (
    <div
      className="absolute bg-black h-[61px] left-[56px] overflow-visible rounded-tl-[5px] rounded-tr-[5px] shadow-[0px_0px_2px_0px_black] top-[51px] w-[1114px]"
      data-name="抬头"
    >
      <HeaderBrand className="absolute contents left-[29px] top-[8px]" />
    </div>
  );
}
