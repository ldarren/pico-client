DROP_ID=0, DROP_RATE=1, DROP_QUALITY=2, DROP_GRADE=3,
OBJECT_ICON=0, OBJECT_NAME=1, OBJECT_LEVEL=2, OBJECT_GRADE=3, OBJECT_TYPE=4, OBJECT_SUB_TYPE=5,
OBJECT_HP=6, OBJECT_WILL=7, OBJECT_DEX=8, OBJECT_LUCK=9,
OBJECT_ATK=10, OBJECT_RATK=11, OBJECT_MATK=12, OBJECT_DEF=13, OBJECT_MDEF=14,
OBJECT_VEG=15, OBJECT_INSECT=16, OBJECT_BEAST=17, OBJECT_UNDEAD=18, OBJECT_DEMON=19, OBJECT_SPELLS=20,
CHARMED_HP=4, CHARMED_WILL=5, CHARMED_DEX=6, CHARMED_LUCK=7,
CHARMED_ATK=8, CHARMED_RATK=9, CHARMED_MATK=10, CHARMED_DEF=11, CHARMED_MDEF=12,
CHARMED_VEG=13, CHARMED_INSECT=14, CHARMED_BEAST=15, CHARMED_UNDEAD=16, CHARMED_DEMON=17,
CREEP_HP=6, CREEP_ATK=7, CREEP_RATK=8, CREEP_MATK=9, CREEP_DEF=10, CREEP_MDEF=11, CREEP_EFFECT=12, CREEP_ITEM=13,
WEAPON_HANDED=21, CHEST_ITEM=7, TOMB_BODY=7, AMMO_SIZE=20,
ENCHANTED_CLASS=4, ENCHANTED_SPELL=5, SPELL_DIFFICULTY=6, SPELL_RELOAD=7, SPELL_COOLDOWN=8, SPELL_ELEMENT=9, SPELL_STRENGTH=10,
HERO_HELM=0,HERO_ARMOR=1,HERO_MAIN=2,HERO_OFF=3,HERO_RINGL=4,HERO_RINGR=5,HERO_AMULET=6,HERO_QUIVER=7,HERO_GOLD=8,HERO_SKULL=9,
HERO_ENEMY=10,HERO_PORTAL=11,HERO_WAYPOINT=12,HERO_BAG_CAP=13,HERO_TOME_CAP=14;

function G_CREATE_OBJECT(id, name){
    var obj = G_OBJECT[id].slice();
    obj[OBJECT_NAME] = name || G_OBJECT_NAME[id];
    return obj;
}

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

Object.freeze(G_ELEMENT = {
    NONE: 0,
    FIRE: 1,
    AIR: 2,
    WATER: 4,
    EARTH: 8,
    FIRE_AIR: 3,
    FIRE_WATER: 5,
    FIRE_AIR_WATER: 7,
    FIRE_EARTH: 9,
    FIRE_AIR_EARTH: 11,
    FIRE_WATER_EARTH: 13,
    AIR_WATER: 6,
    AIR_EARTH: 10,
    AIR_WATER_EARTH: 14,
    WATER_EARTH: 12,
    ALL: 15,
});

// determine how luck affect the drop rate
Object.freeze(G_QUALITY = {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
});

// item affix
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

Object.freeze(G_CONTEXT = {
    WORLD: 1,
    BAG: 2,
    TOME: 3,
    MERCAHNT_BUY: 4,
    MERCHANT_SALE: 5,
    PLAYER_EFFECT: 6,
    CREEP_EFFECT: 7
});

Object.freeze(G_TILE_TYPE = {
    EMPTY: 0,
    SHOW: 2+4+8+16+32+64,
    HIDE: 1,
    CREEP: 2,
    CHEST: 4,
    EXIT: 8,
    ENTRANCE: 16,
    PORTAL: 32,
    WAYPOINT: 64,
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

Object.freeze(G_NPC_TYPE = {
    BLACKSMITH: 145,
    ARCHMAGE: 150,
    TOWN_GUARD: 149,
});

Object.freeze(G_ENV_TYPE = {
    SHRINE: 1,
    ALTAR: 2,
    MESSAGE_BOARD: 3,
    BANNER: 4,
    TOMB: 5
});

Object.freeze(G_CREEP_TYPE = {
    PLANT: 1,
    INSECT: 2,
    BEAST: 3,
    UNDEAD: 4,
    DEMON: 5
});

Object.freeze(G_FLOOR = {
    UNCLEAR: 8,
    WAYPOINT_NEW: 9,
    CLEAR: 10,
    BROKEN: 11,
    LOCKED: 12,
    STAIR_DOWN: 13,
    STAIR_UP: 14,
    PITFALL: 15,
    PORTAL: 16,
    WAYPOINT: 17,
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
    BONES: 130,
    TOMB: 131,
    ALTAR: 132,
    SHRINE: 133,
    SOUL_STONE: 134,
    HEALTH_GLOBE: 135,
    PENTAGRAM: 136,
    ANKH: 137,
    ALL_SEEING: 138,
    CREATION: 139,
    CHAOS: 140,
    EVOLVE: 141,
    BANNER: 142,
    MESSAGE_BOARD: 143,
    ROGUE: 144,
    MONK: 145,
    BARBARIAN: 146,
    DRUID: 147,
    HUNTER: 148,
    PALADIN: 149,
    WIZARD: 150,
    WARLOCK: 151,
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

    BLACKSMITH: 145,
    ARCHMAGE: 150,
    TOWN_GUARD: 149,

    WHIRLWIND: 196,
    POISON_BLADE: 226,
    GAZE: 256,
    FIREBALL: 295,

    EFX_BURNED: 589,
    EFX_CURSED: 590,
    EFX_DISEASED: 591,
    EFX_FEARED: 592,
    EFX_FROZEN: 593,
    EFX_POISONED: 594,
    EFX_POISON_BLADE: 595,
});
// id, rate, luck factor, grade
Object.freeze(G_GRADE_RATE = [
    [G_GRADE.LEGENDARY,    1,      G_QUALITY.HIGH,     G_GRADE.ALL], // legend, 2 enchants, 2 charms
    [G_GRADE.ENCHANTED,    5,      G_QUALITY.HIGH,     G_GRADE.ALL], // enchanted, 1 enchant, 1 charms
    [G_GRADE.CHARMED,      20,     G_QUALITY.MEDIUM,   G_GRADE.ALL], // charmed, 1 charm
    [G_GRADE.COMMON,       100,    G_QUALITY.LOW,      G_GRADE.ALL], // common
]);
// id, drop rate, luck factor, grade, enchant1, enchant2, charm1, charm2
Object.freeze(G_LEGENDARY_RATE = [
    [0, 10, G_QUALITY.HIGH,     G_GRADE.G13,    0, 1, 0, 1],
    [1, 10, G_QUALITY.MEDIUM,   G_GRADE.G13,    2, 3, 2, 3],
]);
// id, drop rate, luck factor, grade, class, spellId
Object.freeze(G_ENCHANTED_RATE = [
    [0,     10, G_QUALITY.LOW,      G_GRADE.ALL, G_HERO_CLASS.ROGUE, 187],
    [1,     10, G_QUALITY.LOW,      G_GRADE.ALL, G_HERO_CLASS.MONK, 187],
    [2,     10, G_QUALITY.LOW,      G_GRADE.ALL, G_HERO_CLASS.BARBARIAN, 187],
    [3,     10, G_QUALITY.LOW,      G_GRADE.ALL, G_HERO_CLASS.DRUID, 187],
    [4,     10, G_QUALITY.LOW,      G_GRADE.ALL, G_HERO_CLASS.HUNTER, 187],
    [5,     10, G_QUALITY.LOW,      G_GRADE.ALL, G_HERO_CLASS.PALADIN, 187],
    [6,     10, G_QUALITY.LOW,      G_GRADE.ALL, G_HERO_CLASS.WIZARD, 187],
    [7,     10, G_QUALITY.LOW,      G_GRADE.ALL, G_HERO_CLASS.WARLOCK, 187],
    [8,     10, G_QUALITY.MEDIUM,   G_GRADE.ALL, G_HERO_CLASS.RANGER, 187],
    [9,     10, G_QUALITY.MEDIUM,   G_GRADE.ALL, G_HERO_CLASS.HEALER, 187],
    [10,    10, G_QUALITY.MEDIUM,   G_GRADE.ALL, G_HERO_CLASS.TANKER, 187],
    [11,    10, G_QUALITY.MEDIUM,   G_GRADE.ALL, G_HERO_CLASS.MELEE, 187],
    [12,    10, G_QUALITY.MEDIUM,   G_GRADE.ALL, G_HERO_CLASS.SPELLCASTER, 187],
    [13,    10, G_QUALITY.MEDIUM,   G_GRADE.ALL, G_HERO_CLASS.DPS, 187],
    [14,    10, G_QUALITY.MEDIUM,   G_GRADE.ALL, G_HERO_CLASS.MONK + G_HERO_CLASS.ROGUE, 187],
    [15,    10, G_QUALITY.HIGH,     G_GRADE.ALL, G_HERO_CLASS.ALL, G_ICON.PENTAGRAM],
]);
// drop rate
Object.freeze(G_CHARMED_RATE = [
    [0,     10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [1,     10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [2,     10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [3,     10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [4,     10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [5,     10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [6,     10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [7,     10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [8,     10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [9,     10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [10,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [11,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [12,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [13,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [14,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [15,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [16,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [16,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [17,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [18,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [19,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [20,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [21,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [22,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [23,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [24,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [25,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [26,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [27,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
    [28,    10, G_QUALITY.LOW, G_GRADE.ALL, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1],
]);
// icon, rate, quality, grade
Object.freeze(G_ITEM_RATE = [
    [G_OBJECT_TYPE.MONEY,   10, G_QUALITY.HIGH,     G_GRADE.ALL], // money
    [G_OBJECT_TYPE.POTION,  100, G_QUALITY.LOW,      G_GRADE.ALL], // potion
    [G_OBJECT_TYPE.SCROLL,  10, G_QUALITY.MEDIUM,   G_GRADE.ALL], // scroll
    [G_OBJECT_TYPE.WEAPON,  30, G_QUALITY.MEDIUM,   G_GRADE.ALL], // weapon
    [G_OBJECT_TYPE.AMMO,    40, G_QUALITY.LOW,      G_GRADE.ALL], // ammo 
    [G_OBJECT_TYPE.ARMOR,   30, G_QUALITY.MEDIUM,   G_GRADE.ALL], // armor
    [G_OBJECT_TYPE.JEWEL,   5,  G_QUALITY.HIGH,     G_GRADE.ALL], // jewel 
    [G_OBJECT_TYPE.MATERIAL,1,  G_QUALITY.MEDIUM,   G_GRADE.ALL], // material
]);
Object.freeze(G_MONEY_TYPE = {
    GOLD: 1,
    SKULL: 2,
});
// icons, drop rate
Object.freeze(G_MONEY_RATE = [
    [G_ICON.COINS,      100,    G_QUALITY.MEDIUM,   G_GRADE.G12],
    [G_ICON.COIN_STACK, 1,      G_QUALITY.HIGH,     G_GRADE.G22],
    [G_ICON.SKULL,      0,      G_QUALITY.HIGH,     G_GRADE.G33],
    [G_ICON.SKULLS,     0,      G_QUALITY.HIGH,     G_GRADE.G33]
]);
Object.freeze(G_POTION_TYPE = {
    ANTIDOT: 1,
    BEER: 2,
    HOLY: 3,
    MEDICINE: 4,
    LUCK: 5,
    HP: 6
});
// icon, drop rate
Object.freeze(G_POTION_RATE = [
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
// icon, drop rate, quality
Object.freeze(G_SCROLL_RATE = [
    [G_ICON.MANUSCRIPT,         10, G_QUALITY.HIGH, G_GRADE.G22],
    [G_ICON.IDENTITY_SCROLL,    50, G_QUALITY.LOW,  G_GRADE.G12],
    [G_ICON.TELEPORT_SCROLL,    50, G_QUALITY.HIGH, G_GRADE.G22],
    [G_ICON.MAP,                10, G_QUALITY.LOW,  G_GRADE.G12],
]);
Object.freeze(G_SPELL_TYPE = {
    AIR_BURST: 1,
    BEAM: 2,
    ENCHANT: 3,
    GAZE: 4,
    EXPLOSION: 5,
    FIREARROWS: 6,
    FIREBALL: 7,
    FOG: 8,
    HASTE: 9,
    HEAL: 10,
    HORROR: 11,
    ICE: 12,
    LEAF: 13,
    LIGHTNING: 14,
    LINK: 15,
    NEEDLES: 16,
    POISON_BLADE: 17,
    PROTECT: 18,
    RIP: 19,
    ROCK: 20,
    RUNES: 21,
    SHIELDING: 22,
    SLICE: 23,
    SUN: 24,
    TORNADO: 25,
    VINES: 26,
    WHIRLWIND: 27,
    WILD: 28,
    WINDGRASP: 29,
});
// from manuscript to spell rate
Object.freeze(G_SPELL_RATE = [
    [G_ICON.WHIRLWIND,      5,      G_QUALITY.HIGH,     G_GRADE.ALL],
    [G_ICON.POISON_BLADE,   5,      G_QUALITY.HIGH,     G_GRADE.ALL],
    [G_ICON.FIREBALL,       5,      G_QUALITY.LOW,      G_GRADE.ALL],
]);
Object.freeze(G_EFFECT_TYPE = {
    BURNED: 1,
    CURSED: 2,
    DISEASED: 3,
    FEARED: 4,
    FROZEN: 5,
    POISONED: 6,
    POISON_BLADE: 7
});
Object.freeze(G_WEAPON_TYPE = {
    SWORD: 1,
    AXE: 2,
    THROW: 3,
    BOW: 4,
    CROSSBOW: 5,
    SCEPTER: 6,
});
Object.freeze(G_WEAPON_RATE = [
    [G_ICON.DAGGER,             80, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.SCIMITAR,           70, G_QUALITY.LOW,  G_GRADE.ALL],
    [G_ICON.GLADIUS,            60, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.XIPHOS,             50, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.CUTLASS,            40, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.BASTARD,            30, G_QUALITY.MEDIUM,  G_GRADE.ALL],
    [G_ICON.CLAYMORE,           20, G_QUALITY.HIGH,  G_GRADE.ALL],
    [G_ICON.FLAMEBARDS,         10, G_QUALITY.HIGH,  G_GRADE.ALL],
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
Object.freeze(G_AMMO_RATE = [
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

Object.freeze(G_ARMOR_RATE = [
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
Object.freeze(G_JEWEL_RATE = [
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
Object.freeze(G_MATERIAL_RATE = [
    [G_ICON.PEARLS,         40, G_QUALITY.MEDIUM, G_GRADE.G12],
    [G_ICON.DIAMOND,        20, G_QUALITY.HIGH, G_GRADE.G22],
    [G_ICON.SKELETON,       50, G_QUALITY.MEDIUM, G_GRADE.G12],
    [G_ICON.SOUL_STONES,    5, G_QUALITY.HIGH, G_GRADE.G22],
]);
Object.freeze(G_ITEM_SUB_RATE = {
    15: G_MONEY_RATE,
    8: G_POTION_RATE,
    9: G_SCROLL_RATE,
    10: G_WEAPON_RATE,
    11: G_AMMO_RATE, 
    12: G_ARMOR_RATE,
    13: G_JEWEL_RATE, 
    14: G_MATERIAL_RATE,
});
Object.freeze(G_OBJECT = [
    undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
    undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
    undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
    undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,
    // icon, name, level, grade, type, sub_type
    [32, '', 0, 0, G_OBJECT_TYPE.CHEST, 1],
    [33, '', 0, 0, G_OBJECT_TYPE.CHEST, 0],
    [34, '', 0, 0, G_OBJECT_TYPE.KEY, 0],
    [35, '', 0, 0, G_OBJECT_TYPE.KEY, 0],
    [36, '', 0, 0, G_OBJECT_TYPE.KEY, 0],
    [37, '', 0, 0, G_OBJECT_TYPE.KEY, 0],
    [38, '', 0, 0, G_OBJECT_TYPE.KEY, 0],
    [39, '', 0, 0, G_OBJECT_TYPE.KEY, 0],
    [40, '', 0, 0, G_OBJECT_TYPE.POTION, G_POTION_TYPE.ANTIDOT],
    [41, '', 0, 0, G_OBJECT_TYPE.POTION, G_POTION_TYPE.BEER],
    [42, '', 0, 0, G_OBJECT_TYPE.POTION, G_POTION_TYPE.HOLY],
    [43, '', 0, 0, G_OBJECT_TYPE.POTION, G_POTION_TYPE.MEDICINE],
    [44, '', 0, 0, G_OBJECT_TYPE.POTION, G_POTION_TYPE.LUCK],
    [45, '', 0, 0, G_OBJECT_TYPE.POTION, G_POTION_TYPE.HP, 1],
    [46, '', 0, 0, G_OBJECT_TYPE.POTION, G_POTION_TYPE.HP, 2],
    [47, '', 0, 0, G_OBJECT_TYPE.POTION, G_POTION_TYPE.HP, 3],
    [48, '', 0, 0, G_OBJECT_TYPE.SCROLL, G_SCROLL_TYPE.MANUSCRIPT],
    [49, '', 0, 0, G_OBJECT_TYPE.SCROLL, G_SCROLL_TYPE.IDENTITY],
    [50, '', 0, 0, G_OBJECT_TYPE.SCROLL, G_SCROLL_TYPE.TELEPORT],
    [51, '', 0, 0, G_OBJECT_TYPE.SCROLL, G_SCROLL_TYPE.MAP],
    [52, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.SHIELD, 0, 0, 0, 0,       0, 0, 0.2,    0, 0.1,    1,1,1,1,1, []],
    [53, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.SHIELD, 0, 0, 0, 0,       0, 0, 0.3,    0, 0.1,    1,1,1,1,1, []],
    [54, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.SHIELD, 0, 0, 0, 0,       0, 0, 0.1,    0, 0.2,    1,1,1,1,1, []],
    [55, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.SHIELD, 0, 0, 0, 0,       0, 0, 0.1,    0, 0.3,    1,1,1,1,1, []],
    // handed, hp, will, dex, luck, [atk, ratk, matk], [def, mdef], [veg, insect, beast, undead, demon]
    [56, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SWORD, 0, 0, 0, 0,      0.1, 0, 0,    0, 0,    1,1,1,1,1, [],1],
    [57, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SWORD, 0, 0, -0.1, 0,   0.2, 0, 0,    0, 0,    1,1,1,1,1, [],1],
    [58, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SWORD, 0, 0, -0.2, 0,   0.3, 0, 0,    0, 0,    1,1,1,1,1, [],1],
    [59, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SWORD, 0, 0, -0.3, 0,   0.4, 0, 0,    0, 0,    1,1,1,1,1, [],1],
    [60, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SWORD, 0, 0, -0.4, 0,   0.5, 0, 0,    0, 0,    1,1,1,1,1, [],1],
    [61, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SWORD, 0, 0, -0.5, 0,   0.6, 0, 0,    0, 0,    1,1,1,1,1, [],2],
    [62, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SWORD, 0, 0, -0.8, 0,   0.7, 0, 0,    0, 0,    1,1,1,1,1, [],2],
    [63, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SWORD, 0, 0, -1, 0,     0.8, 0, 0,    0, 0,    1,1,1,1,1, [],2],
    [64, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.AXE, 0, 0, -0.1, 0,     0.1, 0, 0,    0, 0,    1,1,1,1.1,1, [],1],
    [65, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.AXE, 0, 0, -0.2, 0,     0.3, 0, 0,    0, 0,    1,1,1,1.1,1, [],1],
    [66, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.AXE, 0, 0, -0.3, 0,     0.4, 0, 0,    0, 0,    1,1,1,1.1,1, [],1],
    [67, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.AXE, 0, 0, -0.5, 0,     0.5, 0, 0,    0, 0,    1,1,1,1.1,1, [],2],
    [68, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.AXE, 0, 0, -0.2, 0,     0.5, 0, 0,    0, 0,    1,1,1,1.1,1, [],1],
    [69, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.AXE, 0, 0, -0.8, 0,     1.6, 0, 0,    0, 0,    1,1,1,1.1,1, [],2],
    [70, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.AXE, 0, 0, -0.8, 0,     1.7, 0, 0,    0, 0,    1,1,1,1.1,1, [],2],
    [71, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.AXE, 0, 0, -1.2, 0,     1.8, 0, 0,    0, 0,    1,1,1,1.1,1, [],2],
    [72, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.THROW, 0, 0, 0, 0,     0, 0.2, 0,    0, 0,    1,1,1,1.1,1, [],1],
    [73, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.THROW, 0, 0, 0, 0,     0, 1.0, 0,    0, 0,    1,1,1,1,1, [],2],
    [74, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.THROW, 0, 0, 0, 0,     0, 0.1, 0,    0, 0,    1,1,1,1,1, [],1],
    [75, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.BOW, 0, 0, 0, 0,     0, 0.8, 0,    0, 0,    1,1,1,1,1, [],2],
    [76, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.BOW, 0, 0, 0, 0,     0, 1.2, 0,    0, 0,    1,1,1,1,1, [],2],
    [77, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.BOW, 0, 0, 0, 0,     0, 1.5, 0,    0, 0,    1,1,1,1,1, [],2],
    [78, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.CROSSBOW, 0, 0, 0, 0,     0, 1.2, 0,    0, 0,    1,1,1,1,1, [],2],
    [79, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.CROSSBOW, 0, 0, 0, 0,     0, 1.0, 0,    0, 0,    1,1,1,1,1, [],1],
    [80, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.THROW, 0, 0, 0, 0,     0, 1.0, 0,    0, 0,    1,1,1,1,1, [],1],
    [81, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.THROW, 0, 0, -1, 0,     0, 2.0, 0,    0, 0,    1,1,1,1,1, [],2],
    [82, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.THROW, 0, 0, -2, 0,     0, 3.0, 0,    0, 0,    1,1,1,1,1, [],2],
    [83, '', 0, 0, G_OBJECT_TYPE.AMMO, G_AMMO_TYPE.ARROW, 0, 0, -0.2, 0,     0, 0.1, 0,    0, 0,    1,1,1,1,1, 10],
    [84, '', 0, 0, G_OBJECT_TYPE.AMMO, G_AMMO_TYPE.ARROW, 0, 0, -0.3, 0,     0, 0.2, 0,    0, 0,    1,1,1,1,1, 5],
    [85, '', 0, 0, G_OBJECT_TYPE.AMMO, G_AMMO_TYPE.ARROW, 0, 0, -0.6, 0,     0, 0.8, 0,    0, 0,    1,1,1,1,1, 3],
    [86, '', 0, 0, G_OBJECT_TYPE.AMMO, G_AMMO_TYPE.BOLT, 0, 0, -0.1, 0,     0, 0.1, 0,    0, 0,    1,1,1,1,1, 10],
    [87, '', 0, 0, G_OBJECT_TYPE.AMMO, G_AMMO_TYPE.BOLT, 0, 0, -0.2, 0,     0, 0.2, 0,    0, 0,    1,1,1,1,1, 5],
    [88, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.ARMOR, 0, 0, 0, 0,     0, 0, 0,    0.1, 0.5,    1,1,1,1,1, []],
    [89, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.ARMOR, 0, 0, -0.1, 0,     0, 0, 0,    0.2, 0.5,    1,1,1,1,1, []],
    [90, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.ARMOR, 0, 0, -0.2, 0,     0, 0, 0,    0.8, -0.5,    1,1,1,1,1, []],
    [91, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.ARMOR, 0, 0, -0.3, 0,     0, 0, 0,    1.0, -0.5,    1,1,1,1,1, []],
    [92, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.ARMOR, 0, 0, -0.5, 0,     0, 0, 0,    1.5, -1,    1,1,1,1,1, []],
    [93, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.ARMOR, 0, 0, -0.8, 0,     0, 0, 0,    2.0, -1,    1,1,1,1,1, []],
    [94, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.ARMOR, 0, 0, -1.0, 0,     0, 0, 0,    3.0, -1.5,    1,1,1,1,1, []],
    [95, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.ARMOR, 0, 0, -2.0, 0,     0, 0, 0,    4.0, -2,    1,1,1,1,1, []],
    [96, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.HELM, 0, 0, 0, 0,     0, 0, 0,    0.1, 0,    1,1,1,1,1, []],
    [97, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.HELM, 0, 0, 0, 0,     0, 0, 0,    0.3, -0.5,    1,1,1,1,1, []],
    [98, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.HELM, 0, 0, -0.1, 0,     0, 0, 0,    0.5, -0.8,    1,1,1,1,1, []],
    [99, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.HELM, 0, 0, -0.1, 0,     0, 0, 0,    0.8, -1,    1,1,1,1,1, []],
    [100, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.HELM, 0, 0, -0.3, 0,     0, 0, 0,    1.0, -2,    1,1,1,1,1, []],
    [101, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.HELM, 0, 0, -0.3, 0,     0, 0, 0,    1.2, -2.5,    1,1,1,1,1, []],
    [102, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.HELM, 0, 0, -0.3, 0,     0, 0, 0,    1.4, -3.0,    1,1,1,1,1, []],
    [103, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.HELM, 0, 0, -0.5, 0,     0, 0, 0,    1.6, -4.0,    1,1,1,1,1, []],
    [104, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.SHEILD, 0, 0, 0, 0,     0, 0, 0,    1.0, 0,    1,1,1,1,1, []],
    [105, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.SHEILD, 0, 0, -0.1, 0,     0, 0, 0,    1.2, -0.1,    1,1,1,1,1, []],
    [106, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.SHEILD, 0, 0, -0.5, 0,     0, 0, 0,    1.4, -0.2,    1,1,1,1,1, []],
    [107, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.SHEILD, 0, 0, -0.5, 0,     0, 0, 0,    1.6, -0.5,    1,1,1,1,1, []],
    [108, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.SHEILD, 0, 0, -0.5, 0,     0, 0, 0,    1.8, -0.7,    1,1,1,1,1, []],
    [109, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.SHEILD, 0, 0, -1.0, 0,     0, 0, 0,    2.0, -1.0,    1,1,1,1,1, []],
    [110, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.SHEILD, 0, 0, -1.0, 0,     0, 0, 0,    3.0, -2.0,    1,1,1,1,1, []],
    [111, '', 0, 0, G_OBJECT_TYPE.ARMOR, G_ARMOR_TYPE.SHEILD, 0, 0, -2.0, 0,     0, 0, 0,    4.0, -3.0,    1,1,1,1,1, []],
    [112, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SCEPTOR, 1, 0, 0, -0.1, 0,     0.2, 0, 1,    0, 0,    1,1,1,1,1, []],
    [113, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SCEPTOR, 1, 0, 0, -0.2, 0,     0.2, 0, 2,    0, 0,    1,1,1,1,1, []],
    [114, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SCEPTOR, 1, 0, 0, -0.3, 0,     0.4, 0, 1.0,    0, 0,    1,1,1,1,1, []],
    [115, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SCEPTOR, 1, 0, 0, -0.5, 0,     0.4, 0, 1.2,    0, 0,    1,1,1,1,1, []],
    [116, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SCEPTOR, 1, 0, 0, -1.0, 0,     0.6, 0, 1.4,    0, 0,    1,1,1,1,1, []],
    [117, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SCEPTOR, 1, 0, 0, -1.2, 0,     0.6, 0, 1.6,    0, 0,    1,1,1,1,1, []],
    [118, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SCEPTOR, 1, 0, 0, -1.4, 0,     0.8, 0, 2,    0, 0,    1,1,1,1,1, []],
    [119, '', 0, 0, G_OBJECT_TYPE.WEAPON, G_WEAPON_TYPE.SCEPTOR, 1, 0, 0, -1.6, 0,     0.2, 0, 4,    0, 0,    1,1,1,1,1, []],
    // min, max amount
    [120, '', 0, 0, G_OBJECT_TYPE.MONEY, G_MONEY_TYPE.GOLD, 1, 10],
    [121, '', 0, 0, G_OBJECT_TYPE.MONEY, G_MONEY_TYPE.GOLD, 11, 100],
    [122, '', 0, 0, G_OBJECT_TYPE.MATERIAL, G_MATERIAL_TYPE.PEARL],
    [123, '', 0, 0, G_OBJECT_TYPE.MATERIAL, G_MATERIAL_TYPE.GEM],
    [124, '', 0, 0, G_OBJECT_TYPE.JEWEL, G_JEWEL_TYPE.RING, 0, 0, 0, 0,     0, 0, 4,    0, 1,    1,1,1,1,1, []],
    [125, '', 0, 0, G_OBJECT_TYPE.JEWEL, G_JEWEL_TYPE.RING, 0, 0, 0, 0,     0.1, 0, 4,    0.1, 2,    1,1,1,1,1, []],
    [126, '', 0, 0, G_OBJECT_TYPE.JEWEL, G_JEWEL_TYPE.AMULET, 0, 0, 0, 0,     0.1, 0, 4,    0.1, 2,    1,1,1,1,1, []],
    [127, '', 0, 0, G_OBJECT_TYPE.JEWEL, G_JEWEL_TYPE.AMULET, 0, 0, 0, 0,     0.2, 0, 6,    0.1, 4,    1,1,1,1,1, []],
    [128, '', 0, 0, G_OBJECT_TYPE.MONEY, G_MONEY_TYPE.SKULL, 2, 4],
    [129, '', 0, 0, G_OBJECT_TYPE.MONEY, G_MONEY_TYPE.SKULL, 1, 1],
    [130, '', 0, 0, G_OBJECT_TYPE.MATERIAL, G_MATERIAL_TYPE.BONE],
    [131, '', 0, 0, G_OBJECT_TYPE.ENV, G_ENV_TYPE.TOMB],
    [132, '', 0, 0, G_OBJECT_TYPE.ENV, G_ENV_TYPE.ALTAR],
    [133, '', 0, 0, G_OBJECT_TYPE.ENV, G_ENV_TYPE.SHRINE],
    [134, '', 0, 0, G_OBJECT_TYPE.MATERIAL, G_MATERIAL_TYPE.SOUL],
    [135, '', 0, 0, G_OBJECT_TYPE.HEALTH],
    // spellType, difficulty, cooldown, currCooldown, stat1, stat2, statn
    [136, '', 0, 0, 0, 0, 5, 3, 0], // Pentagram
    [137, '', 0, 0, 0, 0, 5, 3, 0], // ankh
    [138, '', 0, 0, 0, 0, 0, 0, 0], // all seeing
    [139, '', 0, 0, 0, 0, 5, 3, 0], // creation
    [140, '', 0, 0, 0, 0, 5, 3, 0], // chaos
    [141, '', 0, 0, 0, 0, 5, 3, 0], // evolve
    [142, '', 0, 0, G_OBJECT_TYPE.ENV, G_ENV_TYPE.BANNER],
    [143, '', 0, 0, G_OBJECT_TYPE.ENV, G_ENV_TYPE.MESSAGE_BOARD],
    // id, type, name, hp, will, dex, luck, [atk, ratk, matk], [def, mdef], [veg, insect, beast, undead, demon]
    [144, '',-1, 0, G_OBJECT_TYPE.HERO, G_HERO_CLASS.ROGUE,     2, 0, 1, 1,       0.1, 0.2, 0,    0.1, 0,    1,1,1,1,1],     //rogue
    [145, '',-1, 0, G_OBJECT_TYPE.HERO, G_HERO_CLASS.MONK,      3, 0, 0.1, 0,     0.2, 0.1, 0.1,  0.2, 0.1,  1,1,1,1.2,1.2], //monk
    [146, '',-1, 0, G_OBJECT_TYPE.HERO, G_HERO_CLASS.BARBARIAN, 4, 0, 0.2, 0.1,   0.3, 0.1, 0,    0.3, 0,    1,1,1,1,1],     //Barbarian
    [147, '',-1, 0, G_OBJECT_TYPE.HERO, G_HERO_CLASS.DRUID,     3, 0, 0.2, 0.1,   0.2, 0.1, 0.1,  0.2, 0.1,  1,1,1,1,1],     //Druid
    [148, '',-1, 0, G_OBJECT_TYPE.HERO, G_HERO_CLASS.HUNTER,    2, 0, 0.2, 0.1,   0.2, 0.4, 0.1,  0.2, 0.1,  1,1,1.5,1,1],   //Hunter
    [149, '',-1, 0, G_OBJECT_TYPE.HERO, G_HERO_CLASS.PALADIN,   3, 0, 0, 0,       0.2, 0.1, 0.1,  0.4, 0.1,  1,1,1,1.5,1],   //Paladin
    [150, '',-1, 0, G_OBJECT_TYPE.HERO, G_HERO_CLASS.WIZARD,    1, 0, 0, 0.1,     0.1, 0.1, 0.3,  0.1, 0.4,  1,1,1,1,1],     //Wizard
    [151, '',-1, 0, G_OBJECT_TYPE.HERO, G_HERO_CLASS.WARLOCK,   1, 0, 0, 0,       0.1, 0.1, 0.4,  0.1, 0.3,  1,1,1,1,1],     //Warlock
    // id, type, name, creepType, hp, atk matk, def, mdef
    [152, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0,  []], //Rat
    [153, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.INSECT,   1,  0.1, 0, 0,     0.1, 0,  []], //'Spiders',
    [154, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0,  []], //'Komodo Monitor',
    [155, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.INSECT,   2,  0.1, 0, 0,     0.1, 0,  []], //'Spider Champion',
    [156, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0,  []], //'Toad',
    [157, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.INSECT,   1,  0.1, 0, 0,     0.1, 0,  []], //'Scarab',
    [158, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.INSECT,   1,  0.1, 0, 0,     0.1, 0,  []], //'Centipede',
    [159, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    2,  0.1, 0, 0,     0.1, 0,  []], //'Serpent',
    [160, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.PLANT,    2,  0, 0, 0,       0, 0,  []],   //'Fungi',
    [161, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0,  []], //'Hare',
    [162, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0,  []], //'Bat',
    [163, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    2,  0.2, 0, 0,     0.1, 0,  []], //'Bat Champion',
    [164, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.2, 0, 0,     0.1, 0,  []], //'Snake',
    [165, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    2,  0.2, 0, 0,     0.1, 0,  []], //'Wolf',
    [166, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    2,  0.2, 0, 0,     0.1, 0,  []], //'Wild Boar',
    [167, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    3,  0.2, 0, 0,     0.1, 0,  []], //'Bear',
    [168, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    1,  0.1, 0, 0,     0.1, 0,  []], //'Slime',
    [169, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    2,  0.2, 0, 0,     0.1, 0,  []], //'Slime Champion',
    [170, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.INSECT,   1,  0.1, 0, 0,     0.1, 0,  []], //'Scorpion',
    [171, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    4,  0.6, 0, 0,     0.1, 0,  []], //'Kraken',
    [172, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.UNDEAD,   3,  0.3, 0, 0,     0.1, 0,  []], //'Vampire',
    [173, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.UNDEAD,   2,  0.1, 0, 0,     0.1, 0,  []], //'Mummy',
    [174, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.UNDEAD,   2,  0.3, 0, 0,     0.1, 0,  []], //'Wraith',
    [175, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    4,  0.5, 0, 0,     0.1, 0,  []], //'Beholder',
    [176, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    1,  0.1, 0, 0,     0.1, 0,  []], //'Goblin',
    [177, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.UNDEAD,   2,  0.1, 0, 0,     0.1, 0,  []], //'Zombie',
    [178, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.UNDEAD,   2,  0.1, 0, 0,     0.1, 0,  []], //'Undead',
    [179, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    3,  0.3, 0, 0,     0.1, 0,  []], //'Orc',
    [180, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    3,  1, 0, 0,       0.1, 0,  []], //'Cyclops',
    [181, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    3,  0.7, 0, 0,     0.1, 0,  []], //'Werewolf',
    [182, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    6,  0.5, 0, 0,     0.1, 0,  []], //'Werebear',
    [183, '', 0, 0, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    7,  2, 1, 2,       1, 1,  []],   //'Devil'
    // NPC
    [145, '', 0, 0, G_OBJECT_TYPE.NPC, G_NPC_TYPE.BLACKSMITH], // 184
    [150, '', 0, 0, G_OBJECT_TYPE.NPC, G_NPC_TYPE.ARCHMAGE], // 185
    [149, '', 0, 0, G_OBJECT_TYPE.NPC, G_NPC_TYPE.TOWN_GUARD], // 186
    // spellType, difficulty, cooldown, currCooldown, element, strength
    [0, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.AIR_BURST, 5, 3, 0, 0, 0], // 187
    [1, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.AIR_BURST, 5, 3, 0, 0, 0],
    [2, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.AIR_BURST, 5, 3, 0, 0, 0],
    [3, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.AIR_BURST, 5, 3, 0, 0, 0],
    [4, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.AIR_BURST, 5, 3, 0, 0, 0],
    [5, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.AIR_BURST, 5, 3, 0, 0, 0],
    [6, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.AIR_BURST, 5, 3, 0, 0, 0], // 193
    [7, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.AIR_BURST, 5, 3, 0, 0, 0],
    [8, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.AIR_BURST, 5, 3, 0, 0, 0],
    [9, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WHIRLWIND, 5, 10, 0, G_ELEMENT.AIR, 0],
    [10, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WHIRLWIND, 5, 10, 0, G_ELEMENT.AIR, 10],
    [11, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WHIRLWIND, 5, 10, 0, G_ELEMENT.AIR, 20],
    [12, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0], // 199
    [13, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [14, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [15, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [16, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [17, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [18, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0], // 205
    [19, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [20, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [21, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [22, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [23, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [24, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0], // 211
    [25, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [26, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [27, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [28, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [29, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [30, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0], // 217
    [31, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [32, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [33, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [34, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [35, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [36, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0], // 223
    [37, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [38, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.BEAM, 5, 3, 0, 0, 0],
    [39, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.POISON_BLADE, 5, 3, 0, G_ELEMENT.WATER_EARTH, 1],
    [40, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.POISON_BLADE, 5, 6, 0, G_ELEMENT.WATER_EARTH, 2],
    [41, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.POISON_BLADE, 5, 12, 0, G_ELEMENT.WATER_EARTH, 3],
    [42, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0], // 229
    [43, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [44, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [45, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [46, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [47, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [48, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0], // 235
    [49, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [50, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [51, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [52, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [53, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [54, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0], // 241
    [55, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [56, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [57, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [58, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [59, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [60, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0], // 247
    [61, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [62, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [63, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [64, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [65, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ENCHANT, 5, 3, 0, 0, 0],
    [66, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.GAZE, 5, 3, 0, 0, 0], // 253
    [67, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.GAZE, 5, 3, 0, 0, 0],
    [68, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.GAZE, 5, 3, 0, 0, 0],
    [69, '', 1, G_GRADE.LEGENDARY, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.GAZE, 5, 3, 0, G_ELEMENT.ALL, 0],
    [70, '', 2, G_GRADE.LEGENDARY, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.GAZE, 5, 3, 0, G_ELEMENT.ALL, 0],
    [71, '', 3, G_GRADE.LEGENDARY, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.GAZE, 5, 3, 0, G_ELEMENT.ALL, 0],
    [72, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0], // 259
    [73, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0],
    [74, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0],
    [75, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0],
    [76, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0],
    [77, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0],
    [78, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0], // 265
    [79, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0],
    [80, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0],
    [81, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0],
    [82, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0],
    [83, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0],
    [84, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0], // 271
    [85, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0],
    [86, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.EXPLOSION, 5, 3, 0, 0, 0],
    [87, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0],
    [88, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0],
    [89, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0],
    [90, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0], // 277
    [91, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0],
    [92, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0],
    [93, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0],
    [94, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0],
    [95, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0],
    [96, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0], // 283
    [97, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0],
    [98, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0],
    [99, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0],
    [100, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0],
    [101, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREARROWS, 5, 3, 0, 0, 0],
    [102, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREBALL, 5, 3, 0, 0, 0], // 289
    [103, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREBALL, 5, 3, 0, 0, 0],
    [104, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREBALL, 5, 3, 0, 0, 0],
    [105, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREBALL, 5, 3, 0, 0, 0],
    [106, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREBALL, 5, 3, 0, 0, 0],
    [107, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREBALL, 5, 3, 0, 0, 0],
    [108, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREBALL, 5, 6, 0, G_ELEMENT.FIRE, 10], // 295
    [109, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREBALL, 5, 6, 0, G_ELEMENT.FIRE, 20],
    [110, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREBALL, 5, 6, 0, G_ELEMENT.FIRE, 40],
    [111, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREBALL, 5, 3, 0, 0, 0],
    [112, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREBALL, 5, 3, 0, 0, 0],
    [113, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FIREBALL, 5, 3, 0, 0, 0],
    [114, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0], // 301
    [115, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [116, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [117, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [118, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [119, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [120, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0], // 307
    [121, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [122, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [123, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [124, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [125, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [126, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0], // 313
    [127, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [128, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [129, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [130, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [131, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [132, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0], // 319
    [133, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [134, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.FOG, 5, 3, 0, 0, 0],
    [135, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HASTE, 5, 3, 0, 0, 0],
    [136, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HASTE, 5, 3, 0, 0, 0],
    [137, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HASTE, 5, 3, 0, 0, 0],
    [138, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HASTE, 5, 3, 0, 0, 0], // 325
    [139, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HASTE, 5, 3, 0, 0, 0],
    [140, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HASTE, 5, 3, 0, 0, 0],
    [141, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HASTE, 5, 3, 0, 0, 0],
    [142, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HASTE, 5, 3, 0, 0, 0],
    [143, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HASTE, 5, 3, 0, 0, 0],
    [144, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HEAL, 5, 3, 0, 0, 0], // 331
    [145, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HEAL, 5, 3, 0, 0, 0],
    [146, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HEAL, 5, 3, 0, 0, 0],
    [147, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HEAL, 5, 3, 0, 0, 0],
    [148, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HEAL, 5, 3, 0, 0, 0],
    [149, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HEAL, 5, 3, 0, 0, 0],
    [150, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HEAL, 5, 3, 0, 0, 0], // 337
    [151, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HEAL, 5, 3, 0, 0, 0],
    [152, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HEAL, 5, 3, 0, 0, 0],
    [153, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HORROR, 5, 3, 0, 0, 0],
    [154, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HORROR, 5, 3, 0, 0, 0],
    [155, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HORROR, 5, 3, 0, 0, 0],
    [156, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HORROR, 5, 3, 0, 0, 0], // 343
    [157, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HORROR, 5, 3, 0, 0, 0],
    [158, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HORROR, 5, 3, 0, 0, 0],
    [159, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HORROR, 5, 3, 0, 0, 0],
    [160, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HORROR, 5, 3, 0, 0, 0],
    [161, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.HORROR, 5, 3, 0, 0, 0],
    [162, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ICE, 5, 3, 0, 0, 0], // 349
    [163, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ICE, 5, 3, 0, 0, 0],
    [164, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ICE, 5, 3, 0, 0, 0],
    [165, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ICE, 5, 3, 0, 0, 0],
    [166, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ICE, 5, 3, 0, 0, 0],
    [167, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ICE, 5, 3, 0, 0, 0],
    [168, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ICE, 5, 3, 0, 0, 0], // 355
    [169, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ICE, 5, 3, 0, 0, 0],
    [170, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ICE, 5, 3, 0, 0, 0],
    [171, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LEAF, 5, 3, 0, 0, 0],
    [172, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LEAF, 5, 3, 0, 0, 0],
    [173, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LEAF, 5, 3, 0, 0, 0],
    [174, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LEAF, 5, 3, 0, 0, 0], // 361
    [175, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LEAF, 5, 3, 0, 0, 0],
    [176, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LEAF, 5, 3, 0, 0, 0],
    [177, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LEAF, 5, 3, 0, 0, 0],
    [178, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LEAF, 5, 3, 0, 0, 0],
    [179, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LEAF, 5, 3, 0, 0, 0],
    [180, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LEAF, 5, 3, 0, 0, 0], // 367
    [181, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LEAF, 5, 3, 0, 0, 0],
    [182, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LEAF, 5, 3, 0, 0, 0],
    [183, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [184, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [185, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [186, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0], // 373
    [187, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [188, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [189, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [190, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [191, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [192, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0], // 379
    [193, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [194, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [195, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [196, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [197, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [198, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0], // 385
    [199, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [200, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [201, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [202, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [203, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [204, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0], // 391
    [205, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [206, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [207, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [208, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [209, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LIGHTNING, 5, 3, 0, 0, 0],
    [210, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LINK, 5, 3, 0, 0, 0], // 397
    [211, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LINK, 5, 3, 0, 0, 0],
    [212, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LINK, 5, 3, 0, 0, 0],
    [213, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LINK, 5, 3, 0, 0, 0],
    [214, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LINK, 5, 3, 0, 0, 0],
    [215, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LINK, 5, 3, 0, 0, 0],
    [216, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LINK, 5, 3, 0, 0, 0], // 403
    [217, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LINK, 5, 3, 0, 0, 0],
    [218, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LINK, 5, 3, 0, 0, 0],
    [219, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LINK, 5, 3, 0, 0, 0],
    [220, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LINK, 5, 3, 0, 0, 0],
    [221, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.LINK, 5, 3, 0, 0, 0],
    [222, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0], // 409
    [223, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0],
    [224, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0],
    [225, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0],
    [226, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0],
    [227, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0],
    [228, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0], // 415
    [229, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0],
    [230, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0],
    [231, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0],
    [232, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0],
    [233, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0],
    [234, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0], // 421
    [235, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0],
    [236, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.NEEDLES, 5, 3, 0, 0, 0],
    [237, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [238, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [239, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [240, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0], // 427
    [241, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [242, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [243, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [244, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [245, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [246, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0], // 433
    [247, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [248, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [249, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [250, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [251, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [252, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0], // 439
    [253, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [254, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [255, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [256, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [257, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [258, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0], // 445
    [259, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [260, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [261, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [262, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [263, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.PROTECT, 5, 3, 0, 0, 0],
    [264, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0], // 451
    [265, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0],
    [266, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0],
    [267, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0],
    [268, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0],
    [269, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0],
    [270, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0], // 457
    [271, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0],
    [272, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0],
    [273, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0],
    [274, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0],
    [275, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0],
    [276, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0], // 463
    [277, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0],
    [278, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RIP, 5, 3, 0, 0, 0],
    [279, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0],
    [280, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0],
    [281, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0],
    [282, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0], // 469
    [283, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0],
    [284, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0],
    [285, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0],
    [286, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0],
    [287, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0],
    [288, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0], // 475
    [289, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0],
    [290, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0],
    [291, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0],
    [292, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0],
    [293, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.ROCK, 5, 3, 0, 0, 0],
    [294, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RUNES, 5, 3, 0, 0, 0], // 481
    [295, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RUNES, 5, 3, 0, 0, 0],
    [296, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RUNES, 5, 3, 0, 0, 0],
    [297, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RUNES, 5, 3, 0, 0, 0],
    [298, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RUNES, 5, 3, 0, 0, 0],
    [299, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RUNES, 5, 3, 0, 0, 0],
    [300, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RUNES, 5, 3, 0, 0, 0], // 487
    [301, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RUNES, 5, 3, 0, 0, 0],
    [302, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RUNES, 5, 3, 0, 0, 0],
    [303, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RUNES, 5, 3, 0, 0, 0],
    [304, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RUNES, 5, 3, 0, 0, 0],
    [305, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.RUNES, 5, 3, 0, 0, 0],
    [306, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SHIELDING, 5, 3, 0, 0, 0], // 493
    [307, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SHIELDING, 5, 3, 0, 0, 0],
    [308, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SHIELDING, 5, 3, 0, 0, 0],
    [309, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SHIELDING, 5, 3, 0, 0, 0],
    [310, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SHIELDING, 5, 3, 0, 0, 0],
    [311, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SHIELDING, 5, 3, 0, 0, 0],
    [312, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SHIELDING, 5, 3, 0, 0, 0], // 499
    [313, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SHIELDING, 5, 3, 0, 0, 0],
    [314, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SHIELDING, 5, 3, 0, 0, 0],
    [315, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SHIELDING, 5, 3, 0, 0, 0],
    [316, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SHIELDING, 5, 3, 0, 0, 0],
    [317, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SHIELDING, 5, 3, 0, 0, 0],
    [318, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SLICE, 5, 3, 0, 0, 0], // 505
    [319, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SLICE, 5, 3, 0, 0, 0],
    [320, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SLICE, 5, 3, 0, 0, 0],
    [321, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SLICE, 5, 3, 0, 0, 0],
    [322, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SLICE, 5, 3, 0, 0, 0],
    [323, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SLICE, 5, 3, 0, 0, 0],
    [324, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SLICE, 5, 3, 0, 0, 0], // 511
    [325, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SLICE, 5, 3, 0, 0, 0],
    [326, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SLICE, 5, 3, 0, 0, 0],
    [327, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SLICE, 5, 3, 0, 0, 0],
    [328, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SLICE, 5, 3, 0, 0, 0],
    [329, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SLICE, 5, 3, 0, 0, 0],
    [330, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0], // 517
    [331, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [332, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [333, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [334, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [335, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [336, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0], // 523
    [337, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [338, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [339, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [340, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [341, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [342, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0], // 529
    [343, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [344, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [345, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [346, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [347, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [348, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0], // 535
    [349, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [350, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.SUN, 5, 3, 0, 0, 0],
    [351, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.VINES, 5, 3, 0, 0, 0],
    [352, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.VINES, 5, 3, 0, 0, 0],
    [353, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.VINES, 5, 3, 0, 0, 0],
    [354, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.VINES, 5, 3, 0, 0, 0], // 541
    [355, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.VINES, 5, 3, 0, 0, 0],
    [356, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.VINES, 5, 3, 0, 0, 0],
    [357, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.VINES, 5, 3, 0, 0, 0],
    [358, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.VINES, 5, 3, 0, 0, 0],
    [359, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.VINES, 5, 3, 0, 0, 0],
    [360, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.VINES, 5, 3, 0, 0, 0], // 547
    [361, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.VINES, 5, 3, 0, 0, 0],
    [362, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.VINES, 5, 3, 0, 0, 0],
    [363, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.TORNADO, 5, 3, 0, 0, 0],
    [364, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.TORNADO, 5, 3, 0, 0, 0],
    [365, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.TORNADO, 5, 3, 0, 0, 0],
    [366, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.TORNADO, 5, 3, 0, 0, 0], // 553
    [367, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.TORNADO, 5, 3, 0, 0, 0],
    [368, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.TORNADO, 5, 3, 0, 0, 0],
    [369, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.TORNADO, 5, 3, 0, 0, 0],
    [370, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.TORNADO, 5, 3, 0, 0, 0],
    [371, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.TORNADO, 5, 3, 0, 0, 0],
    [372, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.TORNADO, 5, 3, 0, 0, 0], // 559
    [373, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.TORNADO, 5, 3, 0, 0, 0],
    [374, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.TORNADO, 5, 3, 0, 0, 0],
    [375, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WILD, 5, 3, 0, 0, 0],
    [376, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WILD, 5, 3, 0, 0, 0],
    [377, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WILD, 5, 3, 0, 0, 0],
    [378, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WILD, 5, 3, 0, 0, 0], // 565
    [379, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WILD, 5, 3, 0, 0, 0],
    [380, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WILD, 5, 3, 0, 0, 0],
    [381, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WILD, 5, 3, 0, 0, 0],
    [382, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WILD, 5, 3, 0, 0, 0],
    [383, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WILD, 5, 3, 0, 0, 0],
    [384, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WILD, 5, 3, 0, 0, 0], // 571
    [385, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WILD, 5, 3, 0, 0, 0],
    [386, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WILD, 5, 3, 0, 0, 0],
    [387, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0],
    [388, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0],
    [389, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0],
    [390, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0], // 577
    [391, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0],
    [392, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0],
    [393, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0],
    [394, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0],
    [395, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0],
    [396, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0], // 583
    [397, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0],
    [398, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0],
    [399, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0],
    [400, '', 2, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0],
    [401, '', 3, G_GRADE.COMMON, G_OBJECT_TYPE.SPELL, G_SPELL_TYPE.WINDGRASP, 5, 3, 0, 0, 0],
    [402, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.EFFECT, G_EFFECT_TYPE.BURNED], // 589
    [403, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.EFFECT, G_EFFECT_TYPE.CURSED],
    [404, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.EFFECT, G_EFFECT_TYPE.DISEASED],
    [405, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.EFFECT, G_EFFECT_TYPE.FEARED],
    [406, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.EFFECT, G_EFFECT_TYPE.FROZEN],
    [407, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.EFFECT, G_EFFECT_TYPE.POISONED],
    [39, '', 1, G_GRADE.COMMON, G_OBJECT_TYPE.EFFECT, G_EFFECT_TYPE.POISON_BLADE],
]);

Object.freeze(G_CREEP_TEAM = {
    'vampire': [G_ICON.BAT, 5, G_ICON.BAT_CHAMPION, 2, G_ICON.VAMPIRE, 1],
    'veggie': [G_ICON.SLIME, 1, G_ICON.SLIME_CHAMPION, 1, G_ICON.FUNGI, 1],
    'undead': [G_ICON.SKELETON, 2, G_ICON.MUMMY, 2, G_ICON.ZOMBIE, 2, G_ICON.WRAITH, 1],
});

Object.freeze(G_TOWN_MAP = {
    heroPos: 27,
    map:[
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, G_TILE_TYPE.PORTAL, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, G_TILE_TYPE.EXIT, 0, 0, 0, 0, G_TILE_TYPE.EXIT, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ],
    terrain:[
        24, 24, 24, 25, 24, 24, 24, 24,
        10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, G_FLOOR.PORTAL, 10, 10, 10, 10,
        10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 10, 10, 10, G_FLOOR.STAIR_DOWN, 10,
        10, 10, 10, 10, 10, 10, 10, 10,
    ],
    objects:[
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 186, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        G_ICON.SHRINE, 0, 0, 0, 0, 0, 0, G_ICON.ALTAR,
        184, 0, 0, 0, 0, 0, 0, 185,
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
    TOME: 'uiTome',
    BAG: 'uiBag',
    INFO: 'uiInfo',
    DIALOG: 'uiDialog',
    TRADE: 'uiTrade',
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
    HP: 663,
    HP_EMPTY: 667,
    RATK: 568,
    DEX: 613,
    WILL: 670,
    MATK: 671,
    SELECTED: 713
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
