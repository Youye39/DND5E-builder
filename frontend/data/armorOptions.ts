export interface ArmorOption {
  id: string;
  name: string;
  typeLabel: string;
  formula: string;
  strReq: number | null;
  stealthDisadv: boolean;
  calcAC: (dex: number, con: number, wis: number) => number;
}

export const ARMOR_OPTIONS: ArmorOption[] = [
  { id: "unarmored",       name: "无护甲",         typeLabel: "无护甲", formula: "10 + 敏捷调整值",              strReq: null, stealthDisadv: false, calcAC: (dex)          => 10 + dex },
  { id: "padded",          name: "皮甲",           typeLabel: "轻甲",   formula: "11 + 敏捷调整值",              strReq: null, stealthDisadv: true,  calcAC: (dex)          => 11 + dex },
  { id: "leather",         name: "皮革甲",         typeLabel: "轻甲",   formula: "11 + 敏捷调整值",              strReq: null, stealthDisadv: false, calcAC: (dex)          => 11 + dex },
  { id: "studded_leather", name: "缝皮甲",         typeLabel: "轻甲",   formula: "12 + 敏捷调整值",              strReq: null, stealthDisadv: false, calcAC: (dex)          => 12 + dex },
  { id: "hide",            name: "兽皮甲",         typeLabel: "中甲",   formula: "12 + 敏捷调整值（最多+2）",    strReq: null, stealthDisadv: false, calcAC: (dex)          => 12 + Math.min(dex, 2) },
  { id: "chain_shirt",     name: "链甲衫",         typeLabel: "中甲",   formula: "13 + 敏捷调整值（最多+2）",    strReq: null, stealthDisadv: false, calcAC: (dex)          => 13 + Math.min(dex, 2) },
  { id: "scale_mail",      name: "鳞甲",           typeLabel: "中甲",   formula: "14 + 敏捷调整值（最多+2）",    strReq: null, stealthDisadv: true,  calcAC: (dex)          => 14 + Math.min(dex, 2) },
  { id: "breastplate",     name: "胸甲",           typeLabel: "中甲",   formula: "14 + 敏捷调整值（最多+2）",    strReq: null, stealthDisadv: false, calcAC: (dex)          => 14 + Math.min(dex, 2) },
  { id: "half_plate",      name: "半身甲",         typeLabel: "中甲",   formula: "15 + 敏捷调整值（最多+2）",    strReq: null, stealthDisadv: true,  calcAC: (dex)          => 15 + Math.min(dex, 2) },
  { id: "ring_mail",       name: "环甲",           typeLabel: "重甲",   formula: "14",                          strReq: null, stealthDisadv: true,  calcAC: ()             => 14 },
  { id: "chain_mail",      name: "锁甲",           typeLabel: "重甲",   formula: "16",                          strReq: 13,   stealthDisadv: true,  calcAC: ()             => 16 },
  { id: "splint",          name: "板条甲",         typeLabel: "重甲",   formula: "17",                          strReq: 15,   stealthDisadv: true,  calcAC: ()             => 17 },
  { id: "plate",           name: "全身甲",         typeLabel: "重甲",   formula: "18",                          strReq: 15,   stealthDisadv: true,  calcAC: ()             => 18 },
  { id: "mage_armor",      name: "法师护甲",       typeLabel: "特殊",   formula: "13 + 敏捷调整值",              strReq: null, stealthDisadv: false, calcAC: (dex)          => 13 + dex },
  { id: "barb_unarmored",  name: "野蛮人天生护甲", typeLabel: "特殊",   formula: "10 + 敏捷调整值 + 体质调整值", strReq: null, stealthDisadv: false, calcAC: (dex, con)     => 10 + dex + con },
  { id: "monk_unarmored",  name: "武僧天生护甲",   typeLabel: "特殊",   formula: "10 + 敏捷调整值 + 感知调整值", strReq: null, stealthDisadv: false, calcAC: (dex, _c, wis) => 10 + dex + wis },
];
