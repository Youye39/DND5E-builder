export interface WeaponPreset {
  id: string;
  label: string;
  damageDice: string;
  damageType: string;
  tags: string[];
  attackAttr: "str" | "dex";
}

export interface WeaponTag {
  id: string;
  label: string;
  description: string;
}
