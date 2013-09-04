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
    ARMOR: 11,
    JEWEL: 12,
    MONEY: 13,
    SKILL: 14,
    EFFECT: 15,
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

Object.freeze(G_WIN_ID = {
    PLAYER: 'uiPlayer',
    SKILLS: 'uiSkills',
    BAG: 'uiBag',
    INFO: 'uiInfo',
    POPUP: 'uiPopup',
    DIALOG: 'uiDialog',
});

Object.freeze(G_NUMERIC = {
    SMALL_LIGHT: 247,
    SMALL_DARK: 275,
    LARGE_LIGHT: 227,
    LARGE_DARK: 257
});

Object.freeze(G_OBJECT = {
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
    MEDICINAL_POTION: 43,
    POTION_OF_LUCK: 44,
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
    OUTFITTER_ARROWS: 84,
    BLOODLINE_ARROWS: 85,
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
    DIAMONDS: 123,
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
Object.freeze(G_ITEM_RATE = [
    [], // money
    [], // potion
    [], // scroll
    [], // weapon
    [], // armor
]);
Object.freeze(G_GRADE_RATE = [
    [], // legend, 4 enchantments
    [], // rare, 2 enchantments
    [], // magical, 1 enchantment
    [], // normal
    [], // damage
]);
Object.freeze(G_ENCHANT = {
});
Object.freeze(G_WEAPON = [

]);
Object.freeze(G_ARMOR = [

]);

Object.freeze(G_UI = {
    FLAG: 202,
    HP: 237,
    HP_EMPTY: 242,
    SLOT: 15,
    LEVEL: 216,
    WILL: 670,
    DEX: 613,
    LUCK: 193,
    PATK: 190,
    RATK: 568,
    MATK: 671,
    PDEF: 192,
    MDEF: 191,
    GOLD: 195,
    SKULL: 196,
});

Object.freeze(G_SHADE = [0, 1, 2, 3, 4, 5, 6, 7 ]);
Object.freeze(G_HINT_COLOR = ['BLACK', 'RED', 'YELLOW', 'ORANGE', 'BLUE', 'PURPLE', '#aec440', 'WHITE' ]);
Object.freeze(G_COLOR_TONE = ['#d7e894','#aec440','#527f39','#204631']);

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


// name, ui_id, difficulty, cooldown, currCooldown, stat1, stat2, statn
Object.freeze(G_SPELL = {
    POISON:     [128, 5, 3, 0],
    PENTAGRAM:  [136, 5, 3, 0],    // protection, 4 elements
    ANKH:       [137, 5, 3, 0],    // revive, eternal life
    ALL_SEEING: [138, 0, 3, 0],    // spiritual sight, inner vision, higher knowledge, insight into occult mysteries
    CREATON:    [139, 5, 3, 0],    // creation, alchemic creation
    CHAOS:      [140, 5, 3, 0],    // all direction
    EVOLVE:     [141, 5, 3, 0],    // mankind, evolve
});

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
        [G_OBJECT.SHRINE, G_OBJECT_TYPE.ENV], 0, 0, 0, 0, 0, 0, [G_OBJECT.ALTAR, G_OBJECT_TYPE.ENV],
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
