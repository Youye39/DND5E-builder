import { useState, useCallback, useRef } from 'react';
import AttackComponent from './WeaponComponent';
import SectionContainer from "../../shared/components/SectionContainer";
import { WeaponDialog } from "../weapons/WeaponDialog";
import { HitTooltip, DamageTooltip } from "../weapons/WeaponTip";
import { PropertiesTooltip } from "../../shared/dialogs/PropertiesTooltip";
import ScrollArea from "../../shared/components/ScrollArea";
import type { WeaponData } from "../../../data/weaponState";
import { DEFAULT_WEAPON } from "../../../data/weaponState";
import { useCharacter } from "../../shared/storage/CharacterContext";

interface AttackPanelProps {
  className?: string;
}

function weaponToDisplay(w: WeaponData): { name: string; attackBonus: string; damage: string } {
  const bonus = w.attackAttr === "custom"
    ? w.attackBonus
    : (w.extraAttackBonus || "");
  const damageParts: string[] = [];
  if (w.damageDice) damageParts.push(w.damageDice);
  if (w.damageMod) damageParts.push(w.damageMod);
  const damageStr = damageParts.length > 0 ? damageParts.join("+") + w.damageType : "";
  return { name: w.name, attackBonus: bonus, damage: damageStr };
}

type HoverColumn = "name" | "attack" | "damage";

interface HoverState {
  index: number;
  column: HoverColumn;
  left: number;
  top: number;
}

export default function AttackPanel({ className }: AttackPanelProps) {
  const { character, updateCharacter } = useCharacter();
  const weapons = character?.weapons?.length ? character.weapons : [{ ...DEFAULT_WEAPON }];
  const setWeapons = (w: WeaponData[]) => updateCharacter({ weapons: w });
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideLocked = useRef(false);

  const handleSave = (index: number, data: WeaponData) => {
    const next = [...weapons];
    if (weapons[index]?.name && !data.name) { next.splice(index, 1); return next; }
    next[index] = data;
    if (!weapons[index]?.name && data.name) next.push({ ...DEFAULT_WEAPON });
    setWeapons(next);
    setOpenIndex(null);
  };

  const scheduleHide = useCallback(() => {
    if (hideLocked.current) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHover(null), 200);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
  }, []);

  const handleColumnEnter = useCallback((i: number, column: HoverColumn, e: React.MouseEvent) => {
    cancelHide();
    const rect = e.currentTarget.getBoundingClientRect();
    setHover({ index: i, column, left: rect.left, top: rect.top + rect.height / 2 });
  }, [cancelHide]);

  const handleChargeChange = useCallback((propertyId: string, chargeText: string) => {
    if (!hover) return;
    const next = [...weapons];
    const weapon = { ...next[hover.index] };
    weapon.extraProperties = weapon.extraProperties.map((ep) =>
      ep.id === propertyId ? { ...ep, chargeText } : ep
    );
    next[hover.index] = weapon;
    setWeapons(next);
  }, [hover, weapons, setWeapons]);

  const handleFocusLock = useCallback(() => { hideLocked.current = true; }, []);
  const handleFocusUnlock = useCallback(() => { hideLocked.current = false; }, []);

  const current = hover ? weapons[hover.index] : null;

  return (
    <>
      <SectionContainer title="攻击" className={`${className || ""} w-[358px] h-[304px]`}>
        <div className="absolute top-[7px] left-[13px] right-[14px] flex text-[10px] text-sheet-text-secondary font-serif-regular gap-[5px]">
          <span className="w-[130px]">武器</span>
          <span className="w-[61px]">攻击加值</span>
          <span className="w-[130px]">伤害/类型</span>
        </div>

        <ScrollArea className="absolute top-[23px] left-[13px] right-[3px] bottom-[33px]">
          <div className="flex flex-col gap-[8px]">
            {weapons.map((w, i) => {
              const { name, attackBonus, damage } = weaponToDisplay(w);
              return (
                <AttackComponent
                  key={i}
                  variant={w.name ? 'filled' : 'toFill'}
                  name={name}
                  attackBonus={attackBonus}
                  damage={damage}
                  onClick={() => setOpenIndex(i)}
                  onNameEnter={(e) => handleColumnEnter(i, "name", e)}
                  onAttackEnter={(e) => handleColumnEnter(i, "attack", e)}
                  onDamageEnter={(e) => handleColumnEnter(i, "damage", e)}
                  onMouseLeave={scheduleHide}
                />
              );
            })}
          </div>
        </ScrollArea>
      </SectionContainer>

      {/* Tooltips — 仅已填写武器显示, tooltip 内移入可保持显示 */}
      {hover && current && current.name && hover.column === "name" && current.extraProperties.length > 0 && (
        <PropertiesTooltip
          weapon={current}
          mouseY={hover.top}
          cardLeft={hover.left}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          onChargeChange={handleChargeChange}
          onFocusLock={handleFocusLock}
          onFocusUnlock={handleFocusUnlock}
        />
      )}
      {hover && current && current.name && hover.column === "attack" && (
        <HitTooltip
          weapon={current}
          mouseY={hover.top}
          cardLeft={hover.left}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        />
      )}
      {hover && current && current.name && hover.column === "damage" && current.damageDice && (
        <DamageTooltip
          weapon={current}
          mouseY={hover.top}
          cardLeft={hover.left}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        />
      )}

      {openIndex !== null && (
        <WeaponDialog
          open={openIndex !== null}
          initialData={weapons[openIndex]}
          slotIndex={openIndex}
          onSave={handleSave}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
