export type Language = 'zh' | 'en';

export const translations: Record<Language, Record<string, string>> = {
  zh: {
    // ===== 通用 =====
    'app.name': 'D&D Builder',

    // ===================== App.tsx =====================
    'page.first': '第一页',
    'page.second': '第二页',
    'page.third': '第三页',

    // ===================== BottomToolbar =====================
    'toolbar.export': '导出文件',
    'toolbar.buildGuide': '车卡指引',
    'toolbar.archive': '存档管理',
    'toolbar.customItems': '自定义项管理',

    // ===================== ArchiveDialog =====================
    'archive.title': '存档管理',
    'archive.empty': '暂无存档',
    'archive.current': '当前',
    'archive.confirmDelete': '确认删除',
    'archive.cancel': '取消',
    'archive.duplicate': '复制',
    'archive.export': '导出',
    'archive.delete': '删除',
    'archive.newCharacter': '新建角色',
    'archive.importFailed': '导入失败：文件格式不正确，请选择有效的 D&D Builder 存档文件。',
    'archive.defaultName': '角色 {n}',
    'archive.import': '导入',

    // ===================== GuideDialog =====================
    'guide.title': '车卡指引',
    'guide.comingSoon': '功能开发中，敬请期待',
    'guide.feedback': '反馈/建议 → QQ:1226247814',
    'guide.prev': '上一步',
    'guide.next': '下一步',

    // ===================== CustomItemDialog =====================
    'custom.title': '自定义项管理',
    'custom.custom': '自定义',
    'custom.restore': '恢复默认',
    'custom.saved': '已保存',
    'custom.save': '保存',
    'custom.selectFile': '请从左侧选择文件',
    'custom.jsonError': 'JSON 格式错误，请检查后重试。',

    // ===================== ExportPdfDialog =====================
    'export.title': '导出',
    'export.saveLocally': '保存当前存档到本地',
    'export.owlbear': '导出为 Owlbear JSON',
    'export.fvtt': '导出为 Foundry VTT JSON',
    'export.archive': '导出为 D&D Builder 存档',
    'export.html': '导出为 HTML',
    'export.pdf': '导出为 PDF',
    'export.exporting': '导出中',
    'export.containerNotReady': '容器未就绪',
    'export.htmlFailed': 'HTML 导出失败：',
    'export.unknownError': '未知错误',
    'export.pageFront': '角色卡',
    'export.pageBack': '角色卡（背面）',
    'export.pageSpell': '法术书',

    // ===================== PageFront (Combat Stats) =====================
    'combat.armorClass': '护甲等级',
    'combat.initiative': '先攻',
    'combat.speed': '速度',
    'combat.selectArmor': '选择护甲',
    'combat.clear': '清空',
    'combat.save': '保存',
    'combat.shield': '盾牌',
    'combat.custom': '自定义',
    'combat.addCustom': '+ 自定义',
    'combat.customFormula': '自定义公式',
    'combat.attachment': '附加项',

    // ===================== HP =====================
    'hp.maxHP': '生命值上限',
    'hp.currentHP': '当前生命值',
    'hp.tempHP': '临时生命值',

    // ===================== Rest =====================
    'rest.short': '短休',
    'rest.long': '长休',
    'rest.hitDice': '生命骰',

    // ===================== BasicInfo =====================
    'info.class': '职业',
    'info.race': '种族',
    'info.background': '背景',
    'info.alignment': '阵营',
    'info.playerName': '玩家名',
    'info.exp': '经验值',
    'info.characterName': '角色姓名',

    // ===================== Attributes =====================
    'attr.str': '力量',
    'attr.dex': '敏捷',
    'attr.con': '体质',
    'attr.int': '智力',
    'attr.wis': '感知',
    'attr.cha': '魅力',
    'ability.int': '智力',
    'ability.wis': '感知',
    'ability.cha': '魅力',
    'attr.strFull': '力量',
    'attr.dexFull': '敏捷',
    'attr.conFull': '体质',
    'attr.intFull': '智力',
    'attr.wisFull': '感知',
    'attr.chaFull': '魅力',
    'attr.strMod': '力量调整值',
    'attr.dexMod': '敏捷调整值',
    'attr.conMod': '体质调整值',
    'attr.intMod': '智力调整值',
    'attr.wisMod': '感知调整值',
    'attr.chaMod': '魅力调整值',
    'attr.custom': '自定义',

    // ===================== Proficiencies =====================
    'prof.panelTitle': '其他熟练项和语言',
    'prof.armor': '护甲',
    'prof.weapon': '武器',
    'prof.tools': '工具',
    'prof.language': '语言',
    'prof.none': '无',
    'prof.armorTitle': '护甲熟练',
    'prof.weaponTitle': '武器熟练',
    'prof.toolsTitle': '工具熟练',
    'prof.languageTitle': '语言',

    // ===================== Equipment =====================
    'equipment.title': '装备',
    'equipment.inputItem': '输入物品',
    'equipment.addItem': '添加物品',
    'equipment.moveToInventory': '移至库存',
    'equipment.delete': '删除',

    // ===================== Item Dialog =====================
    'item.edit': '编辑物品',
    'item.delete': '删除',
    'item.save': '保存',
    'item.name': '名称',
    'item.itemName': '物品名称',
    'item.presets': '预设',
    'item.description': '描述',
    'item.itemDescription': '物品描述（可选）',
    'item.weaponAttack': '武器攻击与伤害',
    'item.attack': '攻击',
    'item.attribute': '属性',
    'item.proficient': '熟练',
    'item.extraBonus': '额外加值',
    'item.damage': '伤害',
    'item.baseDamage': '基础伤害',
    'item.extraDamage': '额外伤害',
    'item.addExtraDamage': '+ 额外伤害',
    'item.features': '特性',
    'item.addFeature': '+ 添加特性',
    'item.saveAsWeapon': '保存为攻击武器',
    'item.featureName': '特性名称',
    'item.usage': '次数',
    'item.featureDescription': '特性描述',
    'item.addTag': '+ 标签',
    'item.newItem': '新物品',
    'item.none': '无',
    'item.cancel': '取消',

    // ===================== Attack Panel =====================
    'attack.title': '攻击',
    'attack.weapon': '武器/法术',
    'attack.bonus': '攻击加值',
    'attack.damage': '伤害/类型',
    'attack.selectSource': '选择攻击来源',
    'attack.newWeapon': '新武器',
    'attack.fromEquipment': '从装备中选择',
    'attack.fromSpell': '从法术中选择',
    'attack.selectSpell': '选择法术',
    'attack.selectEquipment': '选择装备',
    'attack.cancel': '取消',
    'attack.none': '无',
    'attack.delete': '删除',

    // ===================== Spells =====================
    'spell.spellcastingAbility': '施法属性',
    'spell.saveDC': '法术豁免 DC',
    'spell.attackBonus': '法术攻击加值',
    'spell.class': '施法职业',
    'spell.slots': '法术位',
    'spell.editSlots': '编辑法术位',
    'spell.reset': '重置',
    'spell.save': '保存',
    'spell.level': '第 {lvl} 环',
    'spell.cantrip': '戏法',
    'spell.spell': '法术',
    'spell.cantrips': '戏法',
    'spell.spells': '法术',
    'spell.cantripsKnown': '已知戏法',
    'spell.spellsKnown': '已知法术',
    'spell.spellsPrepared': '已准备法术',
    'spell.addSpell': '添加法术',
    'spell.delete': '删除',
    'spell.ritual': '仪式',
    'spell.concentration': '专注',
    'spell.concentrating': '专注中',
    'spell.newSpell': '新法术',
    'spell.editCantrip': '编辑戏法',
    'spell.editSpell': '编辑法术',
    'spell.spellName': '法术名称',
    'spell.school': '学派',
    'spell.description': '描述',
    'spell.spellDescription': '法术描述',
    'spell.innate': '天生施法',
    'spell.innateAbility': '使用属性',
    'spell.saveDCField': '法术豁免 DC',
    'spell.attackBonusField': '法术攻击加值',
    'spell.usage': '使用次数',
    'spell.damageSpell': '伤害法术',
    'spell.saveAsDamage': '保存为伤害法术',
    'spell.display': '显示',
    'spell.attackBonusOption': '攻击加值',
    'spell.saveDCOption': '豁免 DC',
    'spell.blank': '空',
    'spell.damageDice': '伤害骰',
    'spell.damageType': '伤害类型',
    'spell.extraBonus': '额外加值',
    'spell.source': '来源',
    'spell.addExtraBonus': '+ 添加额外加值',

    // ===================== School of Magic =====================
    'school.abjuration': '防护学派',
    'school.conjuration': '咒法学派',
    'school.divination': '预言学派',
    'school.enchantment': '附魔学派',
    'school.evocation': '塑能学派',
    'school.illusion': '幻术学派',
    'school.necromancy': '死灵学派',
    'school.transmutation': '变化学派',

    // ===================== Death Save =====================
    'deathSave.title': '死亡豁免',
    'deathSave.success': '成功',
    'deathSave.failure': '失败',
    'deathSave.successAbbr': '成功',
    'deathSave.failureAbbr': '失败',

    // ===================== Coins =====================
    'coins.title': '钱币',

    // ===================== Personality =====================
    'personality.traits': '个性特点',
    'personality.ideal': '理想',
    'personality.bond': '牵绊',
    'personality.flaw': '缺点',

    // ===================== Proficiency =====================
    'proficiency.bonus': '熟练加值',
    'proficiency.inspiration': '激励',

    // ===================== Passive Perception =====================
    'passivePerception': '被动察觉',

    // ===================== Saving Throws =====================
    'savingThrow.title': '豁免',
    'savingThrow.custom': '（自定义）',

    // ===================== Skills =====================
    'skill.title': '技能',
    'skill.acrobatics': '体操',
    'skill.animalHandling': '驯兽',
    'skill.arcana': '奥秘',
    'skill.athletics': '运动',
    'skill.deception': '欺瞒',
    'skill.history': '历史',
    'skill.insight': '洞悉',
    'skill.intimidation': '威吓',
    'skill.investigation': '调查',
    'skill.medicine': '医药',
    'skill.nature': '自然',
    'skill.perception': '察觉',
    'skill.performance': '表演',
    'skill.persuasion': '游说',
    'skill.religion': '宗教',
    'skill.sleightOfHand': '巧手',
    'skill.stealth': '隐匿',
    'skill.survival': '求生',
    'skill.custom': '（自定义）',
    'skill.attrFormat': '（{attr}）',

    // ===================== Weapon Tip =====================
    'weaponTip.attack': '攻击',
    'weaponTip.attribute': '属性',
    'weaponTip.proficient': '熟练',
    'weaponTip.yes': '是',
    'weaponTip.no': '否',
    'weaponTip.extraBonus': '额外加值',
    'weaponTip.damage': '伤害',
    'weaponTip.base': '基础',
    'weaponTip.extra': '额外',

    // ===================== Trait Dialog =====================
    'traitDialog.title': '编辑特质',
    'traitDialog.delete': '删除',
    'traitDialog.save': '保存',
    'traitDialog.name': '名称',
    'traitDialog.usage': '使用次数',
    'traitDialog.optional': '（可选）',
    'traitDialog.desc': '特性描述',
    'traitDialog.options': '特质选项',
    'traitDialog.addOption': '+ 添加特质选项',
    'traitDialog.newTrait': '新特质',
    'traitDialog.optionName': '选项名称',
    'traitDialog.usageCount': '次数',
    'traitDialog.addTag': '+ 标签',
    'traitDialog.optionDesc': '选项描述',
    'traitDialog.customTag': '自定义',
    // ===================== MultiSelect Dialog =====================
    'multiSelect.clear': '清空',
    'multiSelect.save': '保存',
    'multiSelect.selectAll': '全选',

    // ===================== Item Defaults =====================
    'item.newItemDefault': '新物品',
    'char.defaultName': '新角色',
   
    // ===================== Character Info (PageBack) =====================
    'charInfo.title': '角色信息',
    'charInfo.name': '姓名',
    'charInfo.gender': '性别',
    'charInfo.age': '年龄',
    'charInfo.height': '身高',
    'charInfo.weight': '体重',
    'charInfo.eyeColor': '瞳色',
    'charInfo.skinColor': '肤色',
    'charInfo.hairColor': '发色',
    'charInfo.appearance': '角色外貌',
    'charInfo.emblem': '徽记',
    'charInfo.orgPlaceholder': '信仰/组织/家族',
    'backstory.title': '角色背景故事',
    'inventory.title': '库存与财宝',

    // ===================== Mobile Warning =====================
    'mobile.title': '提示',
    'mobile.message': '为了获得更好的体验，请使用电脑或平板打开。',
    'mobile.dismiss': '我知道了',

    // ===================== Adventure Log =====================
    'adventureLog.title': '冒险日志',

    // ===================== Function Button =====================
    'functionButton': '功能按钮',

    // ===================== Traits Panel =====================
    'traits.title': '特性和特质',
    'traits.inputPlaceholder': '输入特性',
    'traits.addPlaceholder': '添加特性',

    // ===================== Language Switch =====================
    'lang.switchToEn': 'EN',
    'lang.switchToZh': '中文',
  },
  en: {
    // ===== 通用 =====
    'app.name': 'D&D5e Builder',

    // ===================== App.tsx =====================
    'page.first': 'Page 1',
    'page.second': 'Page 2',
    'page.third': 'Page 3',

    // ===================== BottomToolbar =====================
    'toolbar.export': 'Export',
    'toolbar.buildGuide': 'Build Guide',
    'toolbar.archive': 'Archive',
    'toolbar.customItems': 'Custom List',

    // ===================== ArchiveDialog =====================
    'archive.title': 'Archive',
    'archive.empty': 'No saves yet',
    'archive.current': 'Current',
    'archive.confirmDelete': 'Confirm Delete',
    'archive.cancel': 'Cancel',
    'archive.duplicate': 'Duplicate',
    'archive.export': 'Export',
    'archive.delete': 'Delete',
    'archive.newCharacter': 'New Character',
    'archive.importFailed': 'Import failed: invalid file format. Please select a valid D&D Builder save file.',
    'archive.defaultName': 'Character {n}',
    'archive.import': 'Import',

    // ===================== GuideDialog =====================
    'guide.title': 'Build Guide',
    'guide.comingSoon': 'Feature in development, stay tuned',
    'guide.feedback': 'Feedback/Suggestions → QQ:1226247814',
    'guide.prev': 'Previous',
    'guide.next': 'Next',

    // ===================== CustomItemDialog =====================
    'custom.title': 'Custom Items',
    'custom.custom': 'Custom',
    'custom.restore': 'Restore Default',
    'custom.saved': 'Saved',
    'custom.save': 'Save',
    'custom.selectFile': 'Select a file from the left',
    'custom.jsonError': 'JSON format error, please check and retry.',

    // ===================== ExportPdfDialog =====================
    'export.title': 'Export',
    'export.saveLocally': 'Save current archive to local',
    'export.owlbear': 'Export as Owlbear JSON',
    'export.fvtt': 'Export as Foundry VTT JSON',
    'export.archive': 'Export as D&D Builder Archive',
    'export.html': 'Export as HTML',
    'export.pdf': 'Export as PDF',
    'export.exporting': 'Exporting...',
    'export.containerNotReady': 'Container not ready',
    'export.htmlFailed': 'HTML export failed: ',
    'export.unknownError': 'unknown error',
    'export.pageFront': 'Character Sheet',
    'export.pageBack': 'Character Sheet (Back)',
    'export.pageSpell': 'Spellbook',

    // ===================== PageFront (Combat Stats) =====================
    'combat.armorClass': 'Armor Class',
    'combat.initiative': 'Initiative',
    'combat.speed': 'Speed',
    'combat.selectArmor': 'Select Armor',
    'combat.clear': 'Clear',
    'combat.save': 'Save',
    'combat.shield': 'Shield',
    'combat.custom': 'Custom',
    'combat.addCustom': '+ Custom',
    'combat.customFormula': 'Custom Formula',
    'combat.attachment': 'Attachment',

    // ===================== HP =====================
    'hp.maxHP': 'Max HP',
    'hp.currentHP': 'Current HP',
    'hp.tempHP': 'Temp HP',

    // ===================== Rest =====================
    'rest.short': 'Sh',
    'rest.long': 'Lg',
    'rest.hitDice': 'Hit Dice',

    // ===================== BasicInfo =====================
    'info.class': 'Class',
    'info.race': 'Race',
    'info.background': 'Background',
    'info.alignment': 'Alignment',
    'info.playerName': 'Player Name',
    'info.exp': 'Experience',
    'info.characterName': 'Character Name',

    // ===================== Attributes =====================
    'attr.str': 'STR',
    'attr.dex': 'DEX',
    'attr.con': 'CON',
    'attr.int': 'INT',
    'attr.wis': 'WIS',
    'attr.cha': 'CHA',
    'ability.int': 'INT',
    'ability.wis': 'WIS',
    'ability.cha': 'CHA',
    'attr.strFull': 'Strength',
    'attr.dexFull': 'Dexterity',
    'attr.conFull': 'Constitution',
    'attr.intFull': 'Intelligence',
    'attr.wisFull': 'Wisdom',
    'attr.chaFull': 'Charisma',
    'attr.strMod': 'Strength Modifier',
    'attr.dexMod': 'Dexterity Modifier',
    'attr.conMod': 'Constitution Modifier',
    'attr.intMod': 'Intelligence Modifier',
    'attr.wisMod': 'Wisdom Modifier',
    'attr.chaMod': 'Charisma Modifier',
    'attr.custom': 'Custom',

    // ===================== Proficiencies =====================
    'prof.panelTitle': 'Proficiencies',
    'prof.armor': 'Armor',
    'prof.weapon': 'Weapon',
    'prof.tools': 'Tools',
    'prof.language': 'Language',
    'prof.none': 'None',
    'prof.armorTitle': 'Armor Proficiencies',
    'prof.weaponTitle': 'Weapon Proficiencies',
    'prof.toolsTitle': 'Tool Proficiencies',
    'prof.languageTitle': 'Language Proficiencies',

    // ===================== Equipment =====================
    'equipment.title': 'Equipment',
    'equipment.inputItem': 'Input item',
    'equipment.addItem': 'Add Item',
    'equipment.moveToInventory': 'Move to Inventory',
    'equipment.delete': 'Delete',

    // ===================== Item Dialog =====================
    'item.edit': 'Edit Item',
    'item.delete': 'Delete',
    'item.save': 'Save',
    'item.name': 'Name',
    'item.itemName': 'Item Name',
    'item.presets': 'Presets',
    'item.description': 'Description',
    'item.itemDescription': 'Item description (optional)',
    'item.weaponAttack': 'Weapon Attack & Damage',
    'item.attack': 'Attack',
    'item.attribute': 'Attribute',
    'item.proficient': 'Proficient',
    'item.extraBonus': 'Extra Bonus',
    'item.damage': 'Damage',
    'item.baseDamage': 'Base Damage',
    'item.extraDamage': 'Extra Damage',
    'item.addExtraDamage': '+ Extra Damage',
    'item.features': 'Features',
    'item.addFeature': '+ Add Feature',
    'item.saveAsWeapon': 'Save as Attack Weapon',
    'item.featureName': 'Feature Name',
    'item.usage': 'Uses',
    'item.featureDescription': 'Feature description',
    'item.addTag': '+ Tag',
    'item.noMoreTags': 'No more tags',
    'item.newItem': 'New Item',
    'item.selectAttackType': 'Select Attack Type',
    'item.none': 'None',
    'item.cancel': 'Cancel',

    // ===================== Attack Panel =====================
    'attack.title': 'Attacks',
    'attack.weapon': 'Weapon/Spell',
    'attack.bonus': 'Modifier',
    'attack.damage': 'Damage/Type',
    'attack.selectSource': 'Select Attack Source',
    'attack.newWeapon': 'New Weapon',
    'attack.fromEquipment': 'From Equipment',
    'attack.fromSpell': 'From Spell',
    'attack.selectSpell': 'Select Spell',
    'attack.selectEquipment': 'Select Equipment',
    'attack.cancel': 'Cancel',
    'attack.none': 'None',
    'attack.delete': 'Delete',

    // ===================== Spells =====================
    'spell.spellcastingAbility': 'Spellcasting Ability',
    'spell.saveDC': 'Spell Save DC',
    'spell.attackBonus': 'Spell Attack Bonus',
    'spell.class': 'Spellcasting Class',
    'spell.slots': 'Spell Slots',
    'spell.editSlots': 'Edit Spell Slots',
    'spell.reset': 'Reset',
    'spell.save': 'Save',
    'spell.level': 'Level {lvl}',
    'spell.cantrip': 'Cantrip',
    'spell.spell': 'Spell',
    'spell.cantrips': 'Cantrips',
    'spell.spells': 'Spells',
    'spell.cantripsKnown': 'Cantrips Known',
    'spell.spellsKnown': 'Spells Known',
    'spell.spellsPrepared': 'Spells Prepared',
    'spell.addSpell': 'Add Spell',
    'spell.delete': 'Delete',
    'spell.ritual': 'Ritual',
    'spell.concentration': 'Concentration',
    'spell.concentrating': 'Concentrating',
    'spell.newSpell': 'New Spell',
    'spell.editCantrip': 'Edit Cantrip',
    'spell.editSpell': 'Edit Spell',
    'spell.spellName': 'Spell Name',
    'spell.school': 'School',
    'spell.description': 'Description',
    'spell.spellDescription': 'Spell description',
    'spell.innate': 'Innate Spellcasting',
    'spell.innateAbility': 'Ability',
    'spell.saveDCField': 'Spell Save DC',
    'spell.attackBonusField': 'Spell Attack Bonus',
    'spell.usage': 'Uses',
    'spell.damageSpell': 'Damage Spell',
    'spell.saveAsDamage': 'Save as Damage Spell',
    'spell.display': 'Display',
    'spell.attackBonusOption': 'Attack Bonus',
    'spell.saveDCOption': 'Save DC',
    'spell.blank': 'Blank',
    'spell.damageDice': 'Damage Dice',
    'spell.damageType': 'Damage Type',
    'spell.extraBonus': 'Extra Bonus',
    'spell.source': 'Source',
    'spell.addExtraBonus': '+ Add Extra Bonus',

    // ===================== School of Magic =====================
    'school.abjuration': 'Abjuration',
    'school.conjuration': 'Conjuration',
    'school.divination': 'Divination',
    'school.enchantment': 'Enchantment',
    'school.evocation': 'Evocation',
    'school.illusion': 'Illusion',
    'school.necromancy': 'Necromancy',
    'school.transmutation': 'Transmutation',

    // ===================== Death Save =====================
    'deathSave.title': 'Death Saves',
    'deathSave.success': 'Success',
    'deathSave.failure': 'Failure',
    'deathSave.successAbbr': 'Suc',
    'deathSave.failureAbbr': 'Fail',

    // ===================== Coins =====================
    'coins.title': 'Coins',

    // ===================== Personality =====================
    'personality.traits': 'Personality Traits',
    'personality.ideal': 'Ideals',
    'personality.bond': 'Bonds',
    'personality.flaw': 'Flaws',

    // ===================== Proficiency =====================
    'proficiency.bonus': 'Proficiency Bonus',
    'proficiency.inspiration': 'Inspiration',

    // ===================== Passive Perception =====================
    'passivePerception': 'Passive Perception',

    // ===================== Saving Throws =====================
    'savingThrow.title': 'Saving Throws',
    'savingThrow.custom': '(Custom)',

    // ===================== Skills =====================
    'skill.title': 'Skills',
    'skill.acrobatics': 'Acrobatics',
    'skill.animalHandling': 'Animal Handling',
    'skill.arcana': 'Arcana',
    'skill.athletics': 'Athletics',
    'skill.deception': 'Deception',
    'skill.history': 'History',
    'skill.insight': 'Insight',
    'skill.intimidation': 'Intimidation',
    'skill.investigation': 'Investigation',
    'skill.medicine': 'Medicine',
    'skill.nature': 'Nature',
    'skill.perception': 'Perception',
    'skill.performance': 'Performance',
    'skill.persuasion': 'Persuasion',
    'skill.religion': 'Religion',
    'skill.sleightOfHand': 'Sleight of Hand',
    'skill.stealth': 'Stealth',
    'skill.survival': 'Survival',
    'skill.abbr.acrobatics': 'Acr',
    'skill.abbr.animalHandling': 'Ani',
    'skill.abbr.arcana': 'Arc',
    'skill.abbr.athletics': 'Ath',
    'skill.abbr.deception': 'Dec',
    'skill.abbr.history': 'His',
    'skill.abbr.insight': 'Ins',
    'skill.abbr.intimidation': 'Itm',
    'skill.abbr.investigation': 'Inv',
    'skill.abbr.medicine': 'Med',
    'skill.abbr.nature': 'Nat',
    'skill.abbr.perception': 'Prc',
    'skill.abbr.performance': 'Prf',
    'skill.abbr.persuasion': 'Per',
    'skill.abbr.religion': 'Rel',
    'skill.abbr.sleightOfHand': 'Slt',
    'skill.abbr.stealth': 'Ste',
    'skill.abbr.survival': 'Sur',
    'skill.custom': '(Custom)',
    'skill.attrFormat': '（{attr}）',

    // ===================== Weapon Tip =====================
    'weaponTip.attack': 'Attack',
    'weaponTip.attribute': 'Ability',
    'weaponTip.proficient': 'Proficient',
    'weaponTip.yes': 'Yes',
    'weaponTip.no': 'No',
    'weaponTip.extraBonus': 'Extra Bonus',
    'weaponTip.damage': 'Damage',
    'weaponTip.base': 'Base',
    'weaponTip.extra': 'Extra',

    // ===================== Trait Dialog =====================
    'traitDialog.title': 'Edit Trait',
    'traitDialog.delete': 'Delete',
    'traitDialog.save': 'Save',
    'traitDialog.name': 'Name',
    'traitDialog.usage': 'Uses',
    'traitDialog.optional': '(optional)',
    'traitDialog.desc': 'Trait Description',
    'traitDialog.options': 'Trait Options',
    'traitDialog.addOption': '+ Add Trait Option',
    'traitDialog.newTrait': 'New Trait',
    'traitDialog.optionName': 'Option Name',
    'traitDialog.usageCount': 'Uses',
    'traitDialog.addTag': '+ Tag',
    'traitDialog.optionDesc': 'Option Description',
    'traitDialog.customTag': 'Custom',
    // ===================== MultiSelect Dialog =====================
    'multiSelect.clear': 'Clear',
    'multiSelect.save': 'Save',
    'multiSelect.selectAll': 'Select All',

    // ===================== Item Defaults =====================
    'item.newItemDefault': 'New Item',
    'char.defaultName': 'New Character',
    // ===================== Weapon Tags (extra) =====================
    // ===================== Tools =====================

    // ===================== Character Info (PageBack) =====================
    'charInfo.title': 'Character Info',
    'charInfo.name': 'Name',
    'charInfo.gender': 'Gender',
    'charInfo.age': 'Age',
    'charInfo.height': 'Height',
    'charInfo.weight': 'Weight',
    'charInfo.eyeColor': 'Eye Color',
    'charInfo.skinColor': 'Skin Color',
    'charInfo.hairColor': 'Hair Color',
    'charInfo.appearance': 'Appearance',
    'charInfo.emblem': 'Emblem',
    'charInfo.orgPlaceholder': 'Faith/Organization/Family',
    'backstory.title': 'Backstory',
    'inventory.title': 'Inventory & Treasure',

    // ===================== Mobile Warning =====================
    'mobile.title': 'Notice',
    'mobile.message': 'For the best experience, please use a computer or tablet.',
    'mobile.dismiss': 'Got it',

    // ===================== Adventure Log =====================
    'adventureLog.title': 'Adventure Log',

    // ===================== Function Button =====================
    'functionButton': 'Function Button',

    // ===================== Traits Panel =====================
    'traits.title': 'Traits & Features',
    'traits.inputPlaceholder': 'Enter trait',
    'traits.addPlaceholder': 'Add trait',

    // ===================== Language Switch =====================
    'lang.switchToEn': 'EN',
    'lang.switchToZh': '中文',
  },
};

/** 获取翻译值，支持 `{n}` 模板替换 */
export function translate(key: string, lang: Language, vars?: Record<string, string | number>): string {
  let text = translations[lang]?.[key] ?? translations['zh'][key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}
