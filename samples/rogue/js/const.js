Object.freeze(G_OBJECT_TYPE = {
    EMPTY: 0,
    HERO: 1,
    NPC: 2,
    CREEP: 3,
    CHEST: 4,
    ENV: 5,
    HEALTH: 6,
    ITEM: 7,
    SKILL: 8,
    EFFECT: 9,
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
    KEY_01: 34,
    KEY_02: 35,
    KEY_03: 36,
    KEY_04: 37,
    KEY_05: 38,
    KEY_06: 39,
    ALTAR: 132,
    SHRINE: 133,
    SOUL_STONE: 134,
    HEALTH_GLOBE: 135,
    GOLD: 195,
    SKULL: 196,
});

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
    LIZARD: 154,
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
    CARABIA: 175,
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
    'veggie': [G_CREEP.SLIME, 5, G_CREEP.SLIME_CHAMPION, 2, G_CREEP.FUNGI, 1],
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

Object.freeze(G_OBJECT_NAME = {
    32: 'Chest',
    33: 'Empty Chest',
    34: 'Normal Key',
    35: 'Crown Key',
    36: 'Gold Key',
    37: 'Stone Key',
    38: 'Secret Key',
    39: 'Bone Key',
    40: 'Antidot',
    41: 'Medicinal Potion',
    42: 'Holy Water',
    43: 'Fire Water',
    44: 'Potion of Luck',
    45: 'Small Healing Potion',
    46: 'Healing Potion',
    47: 'Large Healing Potion',
    48: 'Manuscript',
    49: 'Identify Scroll',
    50: 'Teleport Scroll',
    51: 'Map',
    52: 'Tome of Knowledge',
    53: 'Tome of Wisdom',
    54: 'Tome of Divinity',
    55: 'Tome of Necromancy',
    56: 'Dagger',
    57: 'Scimitar',
    58: 'Gladius',
    59: 'Xiphos',
    60: 'Cutlass',
    61: 'Claymore',
    62: 'Espadon',
    63: 'Flameberge',
    64: 'Hatchet',
    65: 'Cleaver',
    66: 'Tomahawk',
    67: 'Tabarzin',
    68: 'Double Hatchet',
    69: 'Double Axe',
    70: 'Battle Axe',
    71: 'Labrys',
    72: 'Shuriken',
    73: 'Fuuma Shuriken',
    74: 'Dart',
    75: 'Recurve Bow',
    76: 'Long Bow',
    77: 'Reflex Bow',
    78: 'Cross Bow',
    79: 'ChuKoNu',
    80: 'Grenades',
    81: 'Fire Bomb',
    82: 'Thunder Crash Bomb',
    83: 'Wooden Arrow',
    84: 'Copper Arrow',
    85: 'Iron Arrow',
    86: 'Wooden Bolts',
    87: 'Iron Bolts',
    88: 'Robe',
    89: 'Leather Armor',
    90: 'Scale Armor',
    91: 'Cuirass',
    92: 'Plate Mail',
    93: 'Light Plate',
    94: 'Field Plate',
    95: 'Full Plate',
    96: 'Hood',
    97: 'Visage',
    98: 'Spangen',
    99: 'Close',
    100: 'Great',
    101: 'Horned',
    102: 'Viking',
    103: 'Barbute',
    104: 'Buckler',
    105: 'Parma',
    106: 'Rondache',
    107: 'Heater',
    108: 'Kite',
    109: 'Pavise',
    110: 'Scutum',
    111: 'Heraldry',
    112: 'Orb',
    113: 'Mace',
    114: 'Wand',
    115: 'Staff',
    116: 'Aquila',
    117: 'Caduceus',
    118: 'Scepter',
    119: 'Skull Wand',
    120: 'Coins',
    121: 'Coin Stack',
    122: 'Pearls',
    123: 'Diamonds',
    124: 'Ring',
    125: 'Ring',
    126: 'Amulet',
    127: 'Amulet',
    128: 'Skulls',
    129: 'Skull',
    130: 'Skeleton',
    131: 'Tomb',
    132: 'Altar',
    133: 'Shrine',
    134: 'Soulstones',
    135: 'Health Globe',
    136: 'Symbol of Pentagram',
    137: 'Symbol of Ankh',
    138: 'Mark of All Seeing Eye',
    139: 'Mark of Creation',
    140: 'Mark of Chaotic',
    141: 'Mark of Evolution',
    142: 'Banner',
    143: 'Message Board',
    144: 'Rogue',
    145: 'Monk',
    146: 'Barbarian',
    147: 'Druid',
    148: 'Hunter',
    149: 'Paladin',
    150: 'Wizard',
    151: 'Warlock',
    152: 'Rat',
    153: 'Spiders',
    154: 'Lizard',
    155: 'Spider Champion',
    156: 'Toad',
    157: 'Scarab',
    158: 'Centipede',
    159: 'Serpent',
    160: 'Fungi',
    161: 'Hare',
    162: 'Bat',
    163: 'Bat Champion',
    164: 'Snake',
    165: 'Wolf',
    166: 'Wild Boar',
    167: 'Bear',
    168: 'Slime',
    169: 'Slime Champion',
    170: 'Scorpion',
    171: 'Kraken',
    172: 'Vampire',
    173: 'Mummy',
    174: 'Wraith',
    175: 'Carabia',
    176: 'Goblin',
    177: 'Zombie',
    178: 'Skeleton',
    179: 'Orc',
    180: 'Cyclops',
    181: 'Werewolf',
    182: 'Werebear',
    183: 'Devil',

    413: 'Farmer',
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

Object.freeze(G_CREEP_TYPE_NAME = [
    'NA',
    'Plant',
    'Insect',
    'Beast',
    'Undead',
    'Demon',
]);

Object.freeze(G_CREEP_STAT = [
    [152, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0], //Rat
    [153, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.INSECT,   1,  0.1, 0, 0,     0.1, 0], //'Spiders',
    [154, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0], //'Lizard',
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
    [175, G_OBJECT_TYPE.CREEP, G_CREEP_TYPE.DEMON,    4,  0.5, 0, 0,     0.1, 0], //'Carabia',
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
