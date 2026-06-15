import BackgroundStorySection from "../features/back-info/BackgroundStorySection";
import InventorySection from "../features/back-info/InventorySection";
import AdventureLogSection from "../features/back-info/AdventureLogSection";
import HeaderSection from "../features/back-info/HeaderSection";
import AppearanceSection from "../features/back-info/AppearanceSection";
import DateDisplay from "../features/back-info/DateDisplay";
import CharacterInfoSection, { type CharacterInfoData } from "../features/back-info/CharacterInfoSection";
import { useCharacter } from "../shared/storage/CharacterContext";

export default function CharacterBackSide() {
  const { character, updateCharacter } = useCharacter();

  if (!character) return null;

  const { characterInfo, backstory, inventory, adventureLog, date } = character;

  const handleCharacterInfoChange = (field: keyof CharacterInfoData, value: string) => {
    const updated = { ...characterInfo, [field]: value };
    updateCharacter({ characterInfo: updated });
  };

  return (
    <div className="absolute bg-white h-[1584px] left-0 overflow-clip top-[75px] w-[1224px]" data-name="角色卡背面">
      <BackgroundStorySection value={backstory} onChange={(v) => updateCharacter({ backstory: v })} />
      <InventorySection value={inventory} onChange={(v) => updateCharacter({ inventory: v })} />
      <AdventureLogSection value={adventureLog} onChange={(v) => updateCharacter({ adventureLog: v })} />
      <HeaderSection />
      <AppearanceSection
        imageId={characterInfo.appearanceImageId}
        onImageChange={(id) => updateCharacter({ characterInfo: { ...characterInfo, appearanceImageId: id } })}
      />
      <DateDisplay value={date} onChange={(v) => updateCharacter({ date: v })} />
      <CharacterInfoSection data={characterInfo} onChange={handleCharacterInfoChange} />
    </div>
  );
}
