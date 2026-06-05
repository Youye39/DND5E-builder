import { useState, useRef } from "react";
import BackgroundStorySection from "./character-sheet-back/BackgroundStorySection";
import InventorySection from "./character-sheet-back/InventorySection";
import AdventureLogSection from "./character-sheet-back/AdventureLogSection";
import HeaderSection from "./character-sheet-back/HeaderSection";
import AppearanceSection from "./character-sheet-back/AppearanceSection";
import DateDisplay from "./character-sheet-back/DateDisplay";
import CharacterInfoSection, { type CharacterInfoData } from "./character-sheet-back/CharacterInfoSection";

interface CharacterBackSideProps {
  characterName?: string;
  onCharacterNameChange?: (name: string) => void;
}

function createInitialCharacterInfo(name: string): CharacterInfoData {
  return {
    name,
    gender: "",
    age: "",
    height: "",
    weight: "",
    eyeColor: "",
    skinColor: "",
    hairColor: "",
    appearance: "",
    emblem: "",
    organization: "",
  };
}

export default function CharacterBackSide({ characterName = "", onCharacterNameChange }: CharacterBackSideProps = {}) {
  const [characterInfo, setCharacterInfo] = useState<CharacterInfoData>(() => createInitialCharacterInfo(characterName));
  const [backstory, setBackstory] = useState("");
  const [inventory, setInventory] = useState("");
  const [adventureLog, setAdventureLog] = useState("");
  const [date, setDate] = useState("1501 DR");

  // Sync external characterName into characterInfo.name when it changes from outside
  const prevNameRef = useRef(characterName);
  if (prevNameRef.current !== characterName) {
    prevNameRef.current = characterName;
    setCharacterInfo((prev) => ({ ...prev, name: characterName }));
  }

  const handleCharacterInfoChange = (field: keyof CharacterInfoData, value: string) => {
    setCharacterInfo((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "name") {
        onCharacterNameChange?.(value);
      }
      return updated;
    });
  };

  return (
    <div className="absolute bg-white h-[1584px] left-0 overflow-clip top-[75px] w-[1224px]" data-name="角色卡背面">
      <BackgroundStorySection value={backstory} onChange={setBackstory} />
      <InventorySection value={inventory} onChange={setInventory} />
      <AdventureLogSection value={adventureLog} onChange={setAdventureLog} />
      <HeaderSection />
      <AppearanceSection />
      <DateDisplay value={date} onChange={setDate} />
      <CharacterInfoSection data={characterInfo} onChange={handleCharacterInfoChange} />
    </div>
  );
}
