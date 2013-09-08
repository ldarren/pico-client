Object.freeze(G_OBJECT_TYPE = {
    EMPTY: 0,
    HERO: 1,
    NPC: 2,
    CREEP: 3,
    CHEST: 4,
    ENV: 5,
    HEALTH: 6,
    KEY: 7,
    POTION: 8,
    SCROLL: 9,
    WEAPON: 10,
    AMMO: 11,
    ARMOR: 12,
    JEWEL: 13,
    MATERIAL: 14,
    MONEY: 15,
    SPELL: 16,
    EFFECT: 17,
});

Object.freeze(G_TILE_TYPE = {
    EMPTY: 0,
    SHOW: 2+4+8+16,
    HIDE: 1,
    CREEP: 2,
    CHEST: 4,
    EXIT: 8,
    ENTRANCE: 16,
    OBSTACLES: 2+4,
});

Object.freeze(G_HERO_CLASS = {
    ROGUE: 1,
    MONK: 2,
    BARBARIAN: 4,
    DRUID: 8,
    HUNTER: 16,
    PALADIN: 32,
    WIZARD: 64,
    WARLOCK: 128,
    RANGER: 17,
    HEALER: 34,
    TANKER: 42,
    MELEE: 46,
    SPELLCASTER: 192,
    DPS: 220,
    ALL: 255
});

Object.freeze(G_FLOOR = {
    UNCLEAR: 8,
    PYRAMID: 9,
    CLEAR: 10,
    BROKEN: 11,
    LOCKED: 12,
    STAIR_DOWN: 13,
    STAIR_UP: 14,
    PITFALL: 15,
    TELEPORT: 16,
    CHECKPOINT: 17,
    STONE: 18,
    WALL: 19,
    BROKEN_WALL: 20,
    WOODEN_GATE: 21,
    DARWEN_GATE: 22,
    LOCKED_GATE: 23,
    PILLARS: 24,
    PILLAR_DOOR: 25,
    PRISON: 26,
    TRAP: 27,
    TILES: 28,
    WATER: 29,
    SAND: 30,
    SPACE: 31
});

Object.freeze(G_QUALITY = {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
});

Object.freeze(G_ICON = {
    CHEST: 32,
    CHEST_EMPTY: 33,
    KEY_CHEST: 34,
    KEY_TREASURE: 35,
    KEY_GATE: 36,
    KEY_DUNGEON: 37,
    KEY_MYSTIC: 38,
    KEY_SKELETON: 39,
    ANTIDOT: 40,
    FIRE_WATER: 41,
    HOLY_WATER: 42,
    MEDICINE: 43,
    LUCK_POTION: 44,
    SMALL_HP: 45,
    MEDIUM_HP: 46,
    LARGE_HP: 47,
    MANUSCRIPT: 48,
    IDENTITY_SCROLL: 49,
    TELEPORT_SCROLL: 50,
    MAP: 51,
    TOME_KNOWLEDGE: 52,
    TOME_WISDOM: 53,
    TOME_DIVINITY: 54,
    TOME_NECROMACY: 55,
    DAGGER: 56,
    SCIMITAR: 57,
    GLADIUS: 58,
    XIPHOS: 59,
    CUTLASS: 60,
    CLAYMORE: 61,
    ESPADON: 62,
    FLAMEBERGE: 63,
    HATCHET: 64,
    CLEAVER: 65,
    TOMAHAWK: 66,
    TABARZIN: 67,
    DOUBLE_HATCHET: 68,
    DOUBLE_AXE: 69,
    BATTLE_AXE: 70,
    LABRYS: 71,
    SHURIKEN: 72,
    FUUMA_SHURIKEN: 73,
    DART: 74,
    RECURVE_BOW: 75,
    LONG_BOW: 76,
    REFLEX_BOW: 77,
    CROSS_BOW: 78,
    CHUKONU: 79,
    GRENADES: 80,
    FIRE_BOMB: 81,
    THUNDER_CRASH_BOMB: 82,
    HUNTER_ARROWS: 83,
    BROADHEAD_ARROWS: 84,
    WARSHIP_ARROWS: 85,
    HUNTER_BOLTS: 86,
    MILITARY_BOLTS: 87,
    ROBE: 88,
    LEATHER_ARMOR: 89,
    SCALE_ARMOR: 90,
    CUIRASS: 91,
    PLATE_MAIL: 92,
    LIGHT_PLATE: 93,
    FIELD_PLATE: 94,
    FULL_PLATE: 95,
    HOOD: 96,
    SALLET: 97,
    SPANGEN: 98,
    CORINTHIAN: 99,
    GREAT_HELM: 100,
    VIKING_HELM: 101,
    WINGED_HELM: 102,
    BARBUTE: 103,
    BUCKLER: 104,
    PARMA: 105,
    RONDACHE: 106,
    HEATER: 107,
    KITE: 108,
    PAVISE: 109,
    SCUTUM: 110,
    HERALDRY: 111,
    ORB: 112,
    MACE: 113,
    WAND: 114,
    STAFF: 115,
    AQUILA: 116,
    CADUCEUS: 117,
    SCEPTER: 118,
    SKULL_WAND: 119,
    COINS: 120,
    COIN_STACK: 121,
    PEARLS: 122,
    DIAMOND: 123,
    RING1: 124,
    RING2: 125,
    AMULET1: 126,
    AMULET2: 127,
    SKULLS: 128,
    SKULL: 129,
    SKELETON: 130,
    TOMB: 131,
    ALTAR: 132,
    SHRINE: 133,
    SOUL_STONE: 134,
    HEALTH_GLOBE: 135,
});

// icon, difficulty, cooldown, currCooldown, stat1, stat2, statn
Object.freeze(G_SPELL = {
    POISON:     [128, 5, 3, 0],
    PENTAGRAM:  [136, 5, 3, 0],    // protection, 4 elements
    ANKH:       [137, 5, 3, 0],    // revive, eternal life
    ALL_SEEING: [138, 0, 3, 0],    // spiritual sight, inner vision, higher knowledge, insight into occult mysteries
    CREATON:    [139, 5, 3, 0],    // creation, alchemic creation
    CHAOS:      [140, 5, 3, 0],    // all direction
    EVOLVE:     [141, 5, 3, 0],    // mankind, evolve
});
Object.freeze(G_GRADE = {
    NONE: 0,
    COMMON: 1,
    CHARMED: 2,
    ENCHANTED: 4,
    LEGENDARY: 8,
    G12: 3,
    G22: 12,
    G13: 1,
    G23: 6,
    G33: 8,
    ALL: 15,
});
// id, rate, luck factor, grade
Object.freeze(G_GRADE_RATE = [
    [G_GRADE.LEGENDARY,    1,      G_QUALITY.HIGH,     G_GRADE.ALL], // legend, 2 enchants, 2 charms
    [G_GRADE.ENCHANTED,    5,      G_QUALITY.HIGH,     G_GRADE.ALL], // enchanted, 1 enchant, 1 charms
    [G_GRADE.CHARMED,      20,     G_QUALITY.MEDIUM,   G_GRADE.ALL], // charmed, 1 charm
    [G_GRADE.COMMON,       100,    G_QUALITY.LOW,      G_GRADE.ALL], // common
]);
// id, drop rate, luck factor, grade, enchant1, enchant2, charm1, charm2
Object.freeze(G_LEGENDARY = [
    [0, 10, G_QUALITY.HIGH,     G_GRADE.G13,    0, 1, 0, 1],
    [1, 10, G_QUALITY.MEDIUM,   G_GRADE.G13,    2, 3, 2, 3],
]);
// id, drop rate, luck factor, grade, class
Object.freeze(G_ENCHANT = [
    [0,     10, G_QUALITY.LOW,      G_HERO_CLASS.ROGUE,                     G_GRADE.ALL],
    [1,     10, G_QUALITY.LOW,      G_HERO_CLASS.MONK,                      G_GRADE.ALL],
    [2,     10, G_QUALITY.LOW,      G_HERO_CLASS.BARBARIAN,                 G_GRADE.ALL],
    [3,     10, G_QUALITY.LOW,      G_HERO_CLASS.DRUID,                     G_GRADE.ALL],
    [4,     10, G_QUALITY.LOW,      G_HERO_CLASS.HUNTER,                    G_GRADE.ALL],
    [5,     10, G_QUALITY.LOW,      G_HERO_CLASS.PALADIN,                   G_GRADE.ALL],
    [6,     10, G_QUALITY.LOW,      G_HERO_CLASS.WIZARD,                    G_GRADE.ALL],
    [7,     10, G_QUALITY.LOW,      G_HERO_CLASS.WARLOCK,                   G_GRADE.ALL],
    [8,     10, G_QUALITY.MEDIUM,   G_HERO_CLASS.RANGER,                    G_GRADE.ALL],
    [9,     10, G_QUALITY.MEDIUM,   G_HERO_CLASS.HEALER,                    G_GRADE.ALL],
    [10,    10, G_QUALITY.MEDIUM,   G_HERO_CLASS.TANKER,                    G_GRADE.ALL],
    [11,    10, G_QUALITY.MEDIUM,   G_HERO_CLASS.MELEE,                     G_GRADE.ALL],
    [12,    10, G_QUALITY.MEDIUM,   G_HERO_CLASS.SPELLCASTER,               G_GRADE.ALL],
    [13,    10, G_QUALITY.MEDIUM,   G_HERO_CLASS.DPS,                       G_GRADE.ALL],
    [14,    10, G_QUALITY.MEDIUM,   G_HERO_CLASS.MONK + G_HERO_CLASS.ROGUE, G_GRADE.ALL],
    [15,    10, G_QUALITY.HIGH,     G_HERO_CLASS.ALL,                       G_GRADE.ALL],
]);
// drop rate
Object.freeze(G_CHARM = [
    [0, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [1, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [2, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [3, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [4, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [5, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [6, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [7, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [8, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [9, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [10, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [11, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [12, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [13, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [14, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [15, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [16, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [16, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [17, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [18, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [19, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [20, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [21, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [22, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [23, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [24, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [25, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [26, 10, G_QUALITY.LOW, G_GRADE.ALL],
    [27, 10, G_QUALITY.LOW, G_GRADE.ALL],
]);
Object.freeze(G_ITEM_RATE = [
    [G_OBJECT_TYPE.MONEY,   10, G_QUALITY.HIGH,     G_GRADE.ALL], // money
    [G_OBJECT_TYPE.POTION,  80, G_QUALITY.LOW,      G_GRADE.ALL], // potion
    [G_OBJECT_TYPE.SCROLL,  25, G_QUALITY.MEDIUM,   G_GRADE.ALL], // scroll
    [G_OBJECT_TYPE.WEAPON,  40, G_QUALITY.MEDIUM,   G_GRADE.ALL], // weapon
    [G_OBJECT_TYPE.AMMO,    60, G_QUALITY.LOW,      G_GRADE.ALL], // ammo 
    [G_OBJECT_TYPE.ARMOR,   40, G_QUALITY.MEDIUM,   G_GRADE.ALL], // armor
    [G_OBJECT_TYPE.JEWEL,   1,  G_QUALITY.HIGH,     G_GRADE.ALL], // jewel 
    [G_OBJECT_TYPE.MATERIAL,1,  G_QUALITY.MEDIUM,   G_GRADE.ALL], // material
]);
Object.freeze(G_MONEY_TYPE = {
    GOLD: 1,
    SKULL: 2,
});
// icons, drop rate, min count, max count
Object.freeze(G_MONEY = [
    [G_ICON.COINS,      100,    G_QUALITY.MEDIUM,   G_GRADE.G12, 1, 5],
    [G_ICON.COIN_STACK, 1,      G_QUALITY.HIGH,     G_GRADE.G22, 6, 100],
    [G_ICON.SKULL,      0,      G_QUALITY.HIGH,     G_GRADE.G33, 1, 1],
    [G_ICON.SKULLS,     0,      G_QUALITY.HIGH,     G_GRADE.G33, 2, 10]
]);
Object.freeze(G_POTION_TYPE = {
    ANTIDOT: 1,
    BEAR: 2,
    HOLY: 3,
    MEDICINE: 4,
    LUCK: 5,
    HP: 6
});
// icon, drop rate
Object.freeze(G_POTION = [
    [G_ICON.ANTIDOT,        10, G_QUALITY.LOW,      G_GRADE.G12],
    [G_ICON.FIRE_WATER,     50, G_QUALITY.LOW,      G_GRADE.G12],
    [G_ICON.HOLY_WATER,     10, G_QUALITY.LOW,      G_GRADE.G12],
    [G_ICON.MEDICINE,       10, G_QUALITY.LOW,      G_GRADE.G12],
    [G_ICON.LUCK_POTION,    1,  G_QUALITY.LOW,      G_GRADE.G12],
    [G_ICON.SMALL_HP,       50, G_QUALITY.LOW,      G_GRADE.G13],
    [G_ICON.MEDIUM_HP,      10, G_QUALITY.MEDIUM,   G_GRADE.G23],
    [G_ICON.LARGE_HP,       1,  G_QUALITY.HIGH,     G_GRADE.G33],
]);
Object.freeze(G_SCROLL_TYPE = {
    MANUSCRIPT: 1,
    IDENTITY: 2,
    TELEPORT: 3,
    MAP: 4,
});
// icon, drop rate, quality, scroll type
Object.freeze(G_SCROLL = [
    [G_ICON.IDENTITY_SCROLL,    100,G_QUALITY.LOW,  G_GRADE.G12,   G_SCROLL_TYPE.IDENTITY],
    [G_ICON.TELEPORT_SCROLL,    50, G_QUALITY.LOW,  G_GRADE.G12,     G_SCROLL_TYPE.TELEPORT],
    [G_ICON.MAP,                10, G_QUALITY.LOW,  G_GRADE.G12,     G_SCROLL_TYPE.MAP],
    [G_ICON.MANUSCRIPT,         5,  G_QUALITY.HIGH, G_GRADE.G22,      G_SCROLL_TYPE.MANUSCRIPT, G_SPELL.POISON],
    [G_ICON.MANUSCRIPT,         5,  G_QUALITY.HIGH, G_GRADE.G22,      G_SCROLL_TYPE.MANUSCRIPT, G_SPELL.PENTAGRAM],
    [G_ICON.MANUSCRIPT,         5,  G_QUALITY.HIGH, G_GRADE.G22,      G_SCROLL_TYPE.MANUSCRIPT, G_SPELL.ANKH],
    [G_ICON.MANUSCRIPT,         1,  G_QUALITY.HIGH, G_GRADE.G33,      G_SCROLL_TYPE.MANUSCRIPT, G_SPELL.ALL_SEEING],
    [G_ICON.MANUSCRIPT,         5,  G_QUALITY.HIGH, G_GRADE.G22,      G_SCROLL_TYPE.MANUSCRIPT, G_SPELL.CREATON],
    [G_ICON.MANUSCRIPT,         5,  G_QUALITY.HIGH, G_GRADE.G22,      G_SCROLL_TYPE.MANUSCRIPT, G_SPELL.CHAOS],
    [G_ICON.MANUSCRIPT,         5,  G_QUALITY.HIGH, G_GRADE.G22,      G_SCROLL_TYPE.MANUSCRIPT, G_SPELL.EVOLVE],
]);
Object.freeze(G_WEAPON_TYPE = {
    SWORD: 1,
    AXE: 2,
    THROW: 3,
    BOW: 4,
    CROSSBOW: 5,
    SCEPTER: 6,
});
Object.freeze(G_WEAPON = [
    [G_ICON.DAGGER,             80, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.SCIMITAR,           70, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.GLADIUS,            60, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.XIPHOS,             50, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.CUTLASS,            40, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.CLAYMORE,           30, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.ESPADON,            20, G_QUALITY.HIGH,  G_GRADE.ALL],
    [G_ICON.FLAMEBERGE,         10, G_QUALITY.HIGH,  G_GRADE.ALL],
    [G_ICON.HATCHET,            80, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.CLEAVER,            70, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.TOMAHAWK,           60, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.TABARZIN,           50, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.DOUBLE_HATCHET,     40, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.DOUBLE_AXE,         30, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.BATTLE_AXE,         20, G_QUALITY.HIGH,  G_GRADE.ALL],
    [G_ICON.LABRYS,             10, G_QUALITY.HIGH,  G_GRADE.ALL],
    [G_ICON.SHURIKEN,           50, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.FUUMA_SHURIKEN,     10, G_QUALITY.HIGH,  G_GRADE.ALL],
    [G_ICON.DART,               80, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.GRENADES,           30, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.FIRE_BOMB,          20, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.THUNDER_CRASH_BOMB, 10, G_QUALITY.HIGH,  G_GRADE.ALL],
    [G_ICON.RECURVE_BOW,        50, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.LONG_BOW,           30, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.REFLEX_BOW,         10, G_QUALITY.HIGH,  G_GRADE.ALL],
    [G_ICON.CROSS_BOW,          50, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.CHUKONU,            10, G_QUALITY.HIGH,  G_GRADE.ALL],
    [G_ICON.ORB,                80, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.MACE,               70, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.WAND,               60, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.STAFF,              50, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.AQUILA,             40, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.CADUCEUS,           30, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.SCEPTER,            20, G_QUALITY.HIGH,  G_GRADE.ALL],
    [G_ICON.SKULL_WAND,         10, G_QUALITY.HIGH,  G_GRADE.ALL],
]);
Object.freeze(G_AMMO_TYPE = {
    ARROW: 1,
    BOLT: 2,
});
Object.freeze(G_AMMO = [
    [G_ICON.HUNTER_ARROWS,      80, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.BROADHEAD_ARROWS,   40, G_QUALITY.MEDIUM, G_GRADE.ALL],
    [G_ICON.WARSHIP_ARROWS,     10, G_QUALITY.HIGH, G_GRADE.ALL],
    [G_ICON.HUNTER_BOLTS,       50, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.MILITARY_BOLTS,     10, G_QUALITY.HIGH, G_GRADE.ALL],
]);
Object.freeze(G_ARMOR_TYPE = {
    HELM: 1,
    ARMOR: 2,
    SHEILD: 3,
});

Object.freeze(G_ARMOR = [
    [G_ICON.ROBE,           80, G_QUALITY.LOW, G_GRADE.ALL], 
    [G_ICON.LEATHER_ARMOR,  70, G_QUALITY.LOW, G_GRADE.ALL],
    [G_ICON.SCALE_ARMOR,    60, G_QUALITY.MEDIUM, G_GRADE.ALL],
    [G_ICON.CUIRASS,        50, G_QUALITY.MEDIUM, G_GRADE.ALL],
    [G_ICON.PLATE_MAIL,     40, G_QUALITY.MEDIUM, G_GRADE.ALL],
    [G_ICON.LIGHT_PLATE,    30, G_QUALITY.MEDIUM, G_GRADE.ALL],
    [G_ICON.FIELD_PLATE,    20, G_QUALITY.HIGH, G_GRADE.ALL],
    [G_ICON.FULL_PLATE,     10, G_QUALITY.HIGH, G_GRADE.ALL],
    [G_ICON.HOOD,           80, G_QUALITY.LOW, G_GRADE.ALL],
    [G_ICON.SALLET,         70, G_QUALITY.LOW, G_GRADE.ALL],
    [G_ICON.SPANGEN,        60, G_QUALITY.LOW, G_GRADE.ALL],
    [G_ICON.CORINTHIAN,     50, G_QUALITY.MEDIUM, G_GRADE.ALL],
    [G_ICON.GREAT_HELM,     40, G_QUALITY.MEDIUM, G_GRADE.ALL],
    [G_ICON.VIKING_HELM,    30, G_QUALITY.MEDIUM, G_GRADE.ALL],
    [G_ICON.WINGED_HELM,    20, G_QUALITY.HIGH, G_GRADE.ALL],
    [G_ICON.BARBUTE,        10, G_QUALITY.HIGH, G_GRADE.ALL],
    [G_ICON.BUCKLER,        80, G_QUALITY.LOW, G_GRADE.ALL],
    [G_ICON.PARMA,          70, G_QUALITY.LOW, G_GRADE.ALL],
    [G_ICON.RONDACHE,       60, G_QUALITY.LOW, G_GRADE.ALL],
    [G_ICON.HEATER,         50, G_QUALITY.MEDIUM, G_GRADE.ALL],
    [G_ICON.KITE,           40, G_QUALITY.MEDIUM, G_GRADE.ALL],
    [G_ICON.PAVISE,         30, G_QUALITY.MEDIUM, G_GRADE.ALL],
    [G_ICON.SCUTUM,         20, G_QUALITY.HIGH, G_GRADE.ALL],
    [G_ICON.HERALDRY,       10, G_QUALITY.HIGH, G_GRADE.ALL],
]);
Object.freeze(G_JEWEL_TYPE = {
    RING: 1,
    AMULET: 2,
});
Object.freeze(G_JEWEL = [
    [G_ICON.RING1,      50, G_QUALITY.LOW,  G_GRADE.G12],
    [G_ICON.RING2,      10, G_QUALITY.HIGH, G_GRADE.G22],
    [G_ICON.AMULET1,    50, G_QUALITY.LOW,  G_GRADE.G12],
    [G_ICON.AMULET2,    10, G_QUALITY.HIGH, G_GRADE.G22],
]);
Object.freeze(G_MATERIAL_TYPE = {
    PEARL: 1,
    GEM: 2,
    BONE: 3,
    SOUL: 4,
});
Object.freeze(G_MATERIAL = [
    [G_ICON.PEARLS,         40, G_QUALITY.MEDIUM, G_GRADE.G12],
    [G_ICON.DIAMOND,        20, G_QUALITY.HIGH, G_GRADE.G22],
    [G_ICON.SKELETON,       50, G_QUALITY.MEDIUM, G_GRADE.G12],
    [G_ICON.SOUL_STONES,    5, G_QUALITY.HIGH, G_GRADE.G22],
]);
Object.freeze(G_ITEM_TYPE = {
    15: G_MONEY,
    8: G_POTION,
    9: G_SCROLL,
    10: G_WEAPON,
    11: G_AMMO, 
    12: G_ARMOR,
    13: G_JEWEL, 
    14: G_MATERIAL,
});

Object.freeze(G_HERO = {
    ROGUE: 144,
    MONK: 145,
    BARBARIAN: 146,
    DRUID: 147,
    HUNTER: 148,
    PALADIN: 149,
    WIZARD: 150,
    WARLOCK: 151
});

Object.freeze(G_NPC = {
    FARMER: 613,
});

Object.freeze(G_CREEP = {
    RAT: 152,
    SPIDERS: 153,
    KOMODO: 154,
    SPIDER_CHAMPION: 155,
    TOAD: 156,
    SCARAB: 157,
    CENTIPEDE: 158,
    SERPENT: 159,
    FUNGI: 160,
    Hare: 161,
    BAT: 162,
    BAT_CHAMPION: 163,
    SNAKE: 164,
    WOLF: 165,
    WILD_BOAR: 166,
    BEAR: 167,
    SLIME: 168,
    SLIME_CHAMPION: 169,
    SCORPION: 170,
    Kraken: 171,
    VAMPIRE: 172,
    MUMMY: 173,
    WRAITH: 174,
    BEHOLDER: 175,
    GOBLIN: 176,
    ZOMBIE: 177,
    SKELETON: 178,
    ORC: 179,
    CYCLOPS: 180,
    WEREWOLF: 181,
    WEREBEAR: 182,
    DEVIL: 183,
});

Object.freeze(G_CREEP_TEAM = {
    'vampire': [G_CREEP.BAT, 5, G_CREEP.BAT_CHAMPION, 2, G_CREEP.VAMPIRE, 1],
    'veggie': [G_CREEP.SLIME, 1, G_CREEP.SLIME_CHAMPION, 1, G_CREEP.FUNGI, 1],
    'undead': [G_CREEP.SKELETON, 2, G_CREEP.MUMMY, 2, G_CREEP.ZOMBIE, 2, G_CREEP.WRAITH, 1],
});

// hp, will, dex, luck, [atk, ratk, matk], [def, mdef], [veg, insect, beast, undead, demon]
Object.freeze(G_HERO_STAT = [
    [144,   G_OBJECT_TYPE.HERO, 2, 0, 1, 1,       0.1, 0.2, 0,    0.1, 0,    1,1,1,1,1],     //rogue
    [145,   G_OBJECT_TYPE.HERO, 3, 0, 0.1, 0,     0.2, 0.1, 0.1,  0.2, 0.1,  1,1,1,1.2,1.2], //monk
    [146,   G_OBJECT_TYPE.HERO, 4, 0, 0.2, 0.1,   0.3, 0.1, 0,    0.3, 0,    1,1,1,1,1],     //Barbarian
    [147,   G_OBJECT_TYPE.HERO, 3, 0, 0.2, 0.1,   0.2, 0.1, 0.1,  0.2, 0.1,  1,1,1,1,1],     //Druid
    [148,   G_OBJECT_TYPE.HERO, 2, 0, 0.2, 0.1,   0.2, 0.4, 0.1,  0.2, 0.1,  1,1,1.5,1,1],   //Hunter
    [149,   G_OBJECT_TYPE.HERO, 3, 0, 0, 0,       0.2, 0.1, 0.1,  0.4, 0.1,  1,1,1,1.5,1],   //Paladin
    [150,   G_OBJECT_TYPE.HERO, 1, 0, 0, 0.1,     0.1, 0.1, 0.3,  0.1, 0.4,  1,1,1,1,1],     //Wizard
    [151,   G_OBJECT_TYPE.HERO, 1, 0, 0, 0,       0.1, 0.1, 0.4,  0.1, 0.3,  1,1,1,1,1],     //Warlock
]);

Object.freeze(G_CREEP_TYPE = {
    PLANT: 1,
    INSECT: 2,
    BEAST: 3,
    UNDEAD: 4,
    DEMON: 5
});

Object.freeze(G_CREEP_STAT = [
    [152, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0], //Rat
    [153, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.INSECT,   1,  0.1, 0, 0,     0.1, 0], //'Spiders',
    [154, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0], //'Komodo Monitor',
    [155, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.INSECT,   2,  0.1, 0, 0,     0.1, 0], //'Spider Champion',
    [156, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0], //'Toad',
    [157, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.INSECT,   1,  0.1, 0, 0,     0.1, 0], //'Scarab',
    [158, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.INSECT,   1,  0.1, 0, 0,     0.1, 0], //'Centipede',
    [159, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    2,  0.1, 0, 0,     0.1, 0], //'Serpent',
    [160, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.PLANT,    2,  0, 0, 0,       0, 0],   //'Fungi',
    [161, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0], //'Hare',
    [162, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0], //'Bat',
    [163, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    2,  0.2, 0, 0,     0.1, 0], //'Bat Champion',
    [164, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.2, 0, 0,     0.1, 0], //'Snake',
    [165, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    2,  0.2, 0, 0,     0.1, 0], //'Wolf',
    [166, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    2,  0.2, 0, 0,     0.1, 0], //'Wild Boar',
    [167, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    3,  0.2, 0, 0,     0.1, 0], //'Bear',
    [168, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    1,  0.1, 0, 0,     0.1, 0], //'Slime',
    [169, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    2,  0.2, 0, 0,     0.1, 0], //'Slime Champion',
    [170, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.INSECT,   1,  0.1, 0, 0,     0.1, 0], //'Scorpion',
    [171, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    4,  0.6, 0, 0,     0.1, 0], //'Kraken',
    [172, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.UNDEAD,   3,  0.3, 0, 0,     0.1, 0], //'Vampire',
    [173, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.UNDEAD,   2,  0.1, 0, 0,     0.1, 0], //'Mummy',
    [174, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.UNDEAD,   2,  0.3, 0, 0,     0.1, 0], //'Wraith',
    [175, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    4,  0.5, 0, 0,     0.1, 0], //'Beholder',
    [176, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    1,  0.1, 0, 0,     0.1, 0], //'Goblin',
    [177, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.UNDEAD,   2,  0.1, 0, 0,     0.1, 0], //'Zombie',
    [178, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.UNDEAD,   2,  0.1, 0, 0,     0.1, 0], //'Undead',
    [179, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    3,  0.3, 0, 0,     0.1, 0], //'Orc',
    [180, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    3,  1, 0, 0,       0.1, 0], //'Cyclops',
    [181, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    3,  0.7, 0, 0,     0.1, 0], //'Werewolf',
    [182, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    6,  0.5, 0, 0,     0.1, 0], //'Werebear',
    [183, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    7,  2, 1, 2,       1, 1],   //'Devil'
]);

Object.freeze(G_TOWN_MAP = {
    heroPos: 27,
    map:[
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, G_TILE_TYPE.EXIT, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ],
    terrain:[
        24, 24, 24, 25, 24, 24, 24, 24,
        10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, G_FLOOR.TELEPORT, 10, 10, 10, 10,
        10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 10, 10, 10, G_FLOOR.STAIR_DOWN, 10,
        10, 10, 10, 10, 10, 10, 10, 10,
    ],
    objects:[
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, [G_HERO.PALADIN, G_OBJECT_TYPE.NPC], 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        [G_ICON.SHRINE, G_OBJECT_TYPE.ENV], 0, 0, 0, 0, 0, 0, [G_ICON.ALTAR, G_OBJECT_TYPE.ENV],
        [G_HERO.MONK, G_OBJECT_TYPE.NPC], 0, 0, 0, 0, 0, 0, [G_HERO.WIZARD, G_OBJECT_TYPE.NPC],
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ],
});

Object.freeze(G_MAP_PARAMS = [
    [8, 8, 0, 0], // level 0 is a town
    [8, 8, 5, 2], // width, height, creeps, chests
    [10, 8, 7, 4],
    [12, 8, 10, 6],
    [14, 8, 13, 8],
    [16, 8, 15, 10],
    [16, 10, 17, 12],
    [16, 12, 20, 14],
    [16, 14, 23, 16],
    [16, 16, 25, 18],
    [18, 16, 27, 20],
    [20, 16, 30, 22],
    [22, 16, 33, 24],
    [24, 16, 35, 26],
    [24, 18, 40, 28],
    [24, 20, 45, 30],
    [24, 22, 50, 32],
    [24, 24, 60, 34],
    [26, 24, 70, 36],
    [28, 24, 80, 38],
    [30, 24, 90, 40],
    [32, 24, 100, 42],
    [32, 26, 110, 44],
    [32, 28, 130, 46],
    [32, 30, 150, 48],
    [32, 32, 170, 50],
    [32, 32, 200, 52],
]);

Object.freeze(G_WIN_ID = {
    PLAYER: 'uiPlayer',
    SKILLS: 'uiSkills',
    BAG: 'uiBag',
    INFO: 'uiInfo',
    POPUP: 'uiPopup',
    DIALOG: 'uiDialog',
});

Object.freeze(G_SHADE = [0, 1, 2, 3, 4, 5, 6, 7 ]);
Object.freeze(G_HINT_COLOR = ['BLACK', 'RED', 'YELLOW', 'ORANGE', 'BLUE', 'PURPLE', '#aec440', 'WHITE' ]);
Object.freeze(G_COLOR_TONE = ['#d7e894','#aec440','#527f39','#204631']);

Object.freeze(G_UI = {
    SLOT: 15,
    PATK: 190,
    MDEF: 191,
    PDEF: 192,
    LUCK: 193,
    GOLD: 195,
    SKULL: 196,
    FLAG: 202,
    LEVEL: 216,
    HP: 237,
    HP_EMPTY: 242,
    RATK: 568,
    DEX: 613,
    WILL: 670,
    MATK: 671,
});

Object.freeze(G_NUMERIC = {
    SMALL_LIGHT: 247,
    SMALL_DARK: 275,
    LARGE_LIGHT: 227,
    LARGE_DARK: 257
});

Object.freeze(G_THEME = {
    THEME1:{
        BRANCHES:{ TOP:286, RIGHT:320, BOTTOM:383, LEFT:349 },
        BORDERS:{ TOP:287, RIGHT:352, BOTTOM:382, LEFT:317 },
        ACTIVE:{ TOP_LEFT:285, TOP_RIGHT:288, BOTTOM_RIGHT:384, BOTTOM_LEFT:381 },
        INACTIVE:{ TOP_LEFT:318, TOP_RIGHT:319, BOTTOM_RIGHT:351, BOTTOM_LEFT:350 }
    },
    THEME2:{
        BRANCHES:{ TOP:290, RIGHT:324, BOTTOM:387, LEFT:353 },
        BORDERS:{ TOP:291, RIGHT:356, BOTTOM:386, LEFT:321 },
        ACTIVE:{ TOP_LEFT:289, TOP_RIGHT:292, BOTTOM_RIGHT:388, BOTTOM_LEFT:385 },
        INACTIVE:{ TOP_LEFT:322, TOP_RIGHT:323, BOTTOM_RIGHT:355, BOTTOM_LEFT:354 }
    },
    THEME3:{
        BRANCHES:{ TOP:294, RIGHT:328, BOTTOM:391, LEFT:357 },
        BORDERS:{ TOP:295, RIGHT:360, BOTTOM:390, LEFT:325 },
        ACTIVE:{ TOP_LEFT:293, TOP_RIGHT:296, BOTTOM_RIGHT:392, BOTTOM_LEFT:389 },
        INACTIVE:{ TOP_LEFT:326, TOP_RIGHT:327, BOTTOM_RIGHT:359, BOTTOM_LEFT:358 }
    },
    THEME4:{
        BRANCHES:{ TOP:298, RIGHT:364, BOTTOM:395, LEFT:361 },
        BORDERS:{ TOP:299, RIGHT:332, BOTTOM:394, LEFT:329 },
        ACTIVE:{ TOP_LEFT:297, TOP_RIGHT:300, BOTTOM_RIGHT:396, BOTTOM_LEFT:393 },
        INACTIVE:{ TOP_LEFT:330, TOP_RIGHT:331, BOTTOM_RIGHT:363, BOTTOM_LEFT:362 }
    },
    THEME5:{
        BRANCHES:{ TOP:302, RIGHT:336, BOTTOM:399, LEFT:365 },
        BORDERS:{ TOP:303, RIGHT:368, BOTTOM:398, LEFT:333 },
        ACTIVE:{ TOP_LEFT:301, TOP_RIGHT:304, BOTTOM_RIGHT:400, BOTTOM_LEFT:397 },
        INACTIVE:{ TOP_LEFT:334, TOP_RIGHT:335, BOTTOM_RIGHT:367, BOTTOM_LEFT:366 }
    },
    THEME6:{
        BRANCHES:{ TOP:306, RIGHT:340, BOTTOM:403, LEFT:369 },
        BORDERS:{ TOP:307, RIGHT:372, BOTTOM:402, LEFT:337 },
        ACTIVE:{ TOP_LEFT:305, TOP_RIGHT:308, BOTTOM_RIGHT:404, BOTTOM_LEFT:401 },
        INACTIVE:{ TOP_LEFT:338, TOP_RIGHT:339, BOTTOM_RIGHT:371, BOTTOM_LEFT:370 }
    },
    THEME7:{
        BRANCHES:{ TOP:310, RIGHT:344, BOTTOM:407, LEFT:373 },
        BORDERS:{ TOP:311, RIGHT:376, BOTTOM:406, LEFT:341 },
        ACTIVE:{ TOP_LEFT:309, TOP_RIGHT:312, BOTTOM_RIGHT:408, BOTTOM_LEFT:405 },
        INACTIVE:{ TOP_LEFT:342, TOP_RIGHT:343, BOTTOM_RIGHT:375, BOTTOM_LEFT:374 }
    },
    THEME8:{
        BRANCHES:{ TOP:314, RIGHT:348, BOTTOM:411, LEFT:377 },
        BORDERS:{ TOP:315, RIGHT:380, BOTTOM:410, LEFT:345 },
        ACTIVE:{ TOP_LEFT:313, TOP_RIGHT:316, BOTTOM_RIGHT:412, BOTTOM_LEFT:409 },
        INACTIVE:{ TOP_LEFT:346, TOP_RIGHT:347, BOTTOM_RIGHT:379, BOTTOM_LEFT:378 }
    },
});
