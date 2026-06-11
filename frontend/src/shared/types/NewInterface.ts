// 物品、武器的特性接口，但我觉得特性不一定需要单独存储，它们可以直接跟在物品/武器下面而且一般不会重复，虽然有概率会有很多个，也有概率有0个
interface Feature {
  id: string;
  name: string;
  note?: string;        // 使用次数
  description?: string; // 描述（武器一般没有这一条）
}

// 物品、武器都有可能改变一些调整值，这个接口用于描述这种改变
interface Adjustment {
  target: "ac" | "dc" | "spellAttack" | "attack" | "hp" | "speed" | string;
  value: number; // 正负皆可
  source: string; // 来源（物品名/特性名）
}

// 物品
interface Item {
  id: string;
  type: "weapon" | "armor" | "consumable" | "generic"; //我不确定这一条是否需要存在，因为物品的类型实际并没有太多意义
  name: string;
  description?: string;
  features?: Feature[];
  adjustments?: Adjustment[];
}

// 武器，不继承description，而且我觉得这个设计不一定有现有设计好，酌情考虑一下
interface Weapon extends Item {
  type: "weapon";
  damageDice: string;        // 例如 "1d8"
  damageType: string;        // 例如 "挥砍"
  attackAttr: "str" | "dex" | "con" | "int" | "wis" | "cha"; // 把六个属性都放上去比较好
  attackBonus?: number;      // 额外命中
  extraDamages?: { id: string; dice: string; type: string }[];  //可能会有很多个
}

// 法术有名字和描述，且同样可以作为攻击栏的来源
interface Spell {
  id: string;
  name: string;
  description: string;
  damageDice?: string;
  damageType?: string;
  attackBonus?: number;
}

// 攻击栏可以选择武器或法术，此外还有一些额外的计算，目前这样是不够的
interface AttackEntry {
  id: string;
  type: "weapon" | "spell";
  refId: string; // 指向 Weapon.id 或 Spell.id
}
