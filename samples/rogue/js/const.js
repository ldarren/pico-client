Object.freeze(G_TILE_TYPE = {
    EMPTY: 0,
    SHOW: 2+4+8+16,
    HIDE: 1,
    CREEP: 2,
    CHEST: 4,
    EXIT: 8,
    ENTRANCE: 16,
    OBSTACLES: 2+4+8,
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
    CHEST_CLOSED: 32,
    CHEST_OPENED: 33,
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
});

Object.freeze(G_MARK = {
    PENTAGRAM: 136,     // protection, 4 elements
    ANKH: 137,          // revive, eternal life
    EYE_OF_GOD:138,     // spiritual sight, inner vision, higher knowledge, insight into occult mysteries
    CREATON: 139,       // creation, alchemic creation
    CHAOS: 140,         // all direction
    EVOLVE: 141         // mankind, evolve
});

Object.freeze(G_UI = {
    SLOT: 15,
});

Object.freeze(G_SHADE = [0, 1, 2, 3, 4, 5, 6, 7 ]);
Object.freeze(G_HINT_COLOR = ['BLACK', 'RED', 'YELLOW', 'ORANGE', 'BLUE', 'PURPLE', 'GREEN', 'WHITE' ]);
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
    UNDEAD: 178,
    ORC: 179,
    CYCLOPS: 180,
    WEREWOLF: 181,
    WEREBEAR: 182,
    DEVIL: 183,
});

Object.freeze(G_CREEP_TEAM = {
    'vampire': [G_CREEP.BAT, 5, G_CREEP.BAT_CHAMPION, 2, G_CREEP.VAMPIRE, 1],
    'vegie': [G_CREEP.SLIME, 5, G_CREEP.SLIME_CHAMPION, 2, G_CREEP.FUNGI, 1],
    'undead': [G_CREEP.UNDEAD, 2, G_CREEP.MUMMY, 2, G_CREEP.ZOMBIE, 2, G_CREEP.WRAITH, 1],
});

Object.freeze(G_FLOOR = {
    UNCLEAR: 8,
    CLEAR: 10,
    BROKEN: 11,
    STAIR_DOWN: 13,
    STAIR_UP: 14,
    WALL: 19,
    BROKEN_WALL: 20,
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
    48: 'Spell Snipet',
    49: 'Identify Scroll',
    50: 'Teleport Scroll',
    51: 'Map',
    52: 'Spell Tome',
    53: 'Spell Tome',
    54: 'Spell Tome',
    55: 'Spell Tome',
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
    105: 'Round',
    106: 'Scutum',
    107: 'Mornach',
    108: 'Ward',
    109: 'Steelclash',
    110: 'Rebuke',
    111: 'Barrier',
    112: 'Orb',
    113: 'Scepter',
    114: 'Wand',
    115: 'Staff',
    116: 'Aquila',
    117: 'Angelica',
    118: 'Trinity',
    119: 'Skull Wand',
    120: 'Less coins',
    121: 'More coins',
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
    178: 'Undead',
    179: 'Orc',
    180: 'Cyclops',
    181: 'Werewolf',
    182: 'Werebear',
    183: 'Devil'
});

// hp, [atk, ratk, matk], [def, rdef, mdef], dex, luck, [veg, insect, beast, undead, demon]
Object.freeze(G_HERO_STAT = [
    [144, 2,    0.1, 0.2, 0,    0.1, 0.2, 0,    1, 1,       1,1,1,1,1], //rogue
    [145, 3,    0.2, 0.1, 0.1,  0.2, 0.1, 0.1,  0.1, 0,     1,1,1,1.2,1.2], //monk
    [146, 4,    0.3, 0.1, 0,    0.3, 0.1, 0,    0.2, 0.1,   1,1,1,1,1], //Barbarian
    [147, 3,    0.2, 0.1, 0.1,  0.2, 0.1, 0.1,  0.2, 0.1,   1,1,1,1,1], //Druid
    [148, 2,    0.2, 0.4, 0.1,  0.2, 0.4, 0.1,  0.2, 0.1,   1,1,1.5,1,1], //Hunter
    [149, 3,    0.2, 0.1, 0.1,  0.4, 0.2, 0.1,  0, 0,       1,1,1,1.5,1], //Paladin
    [150, 1,    0.1, 0.1, 0.3,  0.1, 0.1, 0.4,  0, 0.1,     1,1,1,1,1], //Wizard
    [151, 1,    0.1, 0.1, 0.4,  0.1, 0.1, 0.3,  0, 0,       1,1,1,1,1], //Warlock
]);

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
    [152, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0, 0], //Rat
    [153, G_CREEP_TYPE.INSECT,   1,  0.1, 0, 0,     0.1, 0, 0], //'Spiders',
    [154, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0, 0], //'Lizard',
    [155, G_CREEP_TYPE.INSECT,   2,  0.1, 0, 0,     0.1, 0, 0], //'Spider Champion',
    [156, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0, 0], //'Toad',
    [157, G_CREEP_TYPE.INSECT,   1,  0.1, 0, 0,     0.1, 0, 0], //'Scarab',
    [158, G_CREEP_TYPE.INSECT,   1,  0.1, 0, 0,     0.1, 0, 0], //'Centipede',
    [159, G_CREEP_TYPE.BEAST,    2,  0.1, 0, 0,     0.1, 0, 0], //'Serpent',
    [160, G_CREEP_TYPE.PLANT,    2,  0, 0, 0,       0, 0, 0],   //'Fungi',
    [161, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0, 0], //'Hare',
    [162, G_CREEP_TYPE.BEAST,    1,  0.1, 0, 0,     0.1, 0, 0], //'Bat',
    [163, G_CREEP_TYPE.BEAST,    2,  0.2, 0, 0,     0.1, 0, 0], //'Bat Champion',
    [164, G_CREEP_TYPE.BEAST,    1,  0.2, 0, 0,     0.1, 0, 0], //'Snake',
    [165, G_CREEP_TYPE.BEAST,    2,  0.2, 0, 0,     0.1, 0, 0], //'Wolf',
    [166, G_CREEP_TYPE.BEAST,    2,  0.2, 0, 0,     0.1, 0, 0], //'Wild Boar',
    [167, G_CREEP_TYPE.BEAST,    3,  0.2, 0, 0,     0.1, 0, 0], //'Bear',
    [168, G_CREEP_TYPE.DEMON,    1,  0.1, 0, 0,     0.1, 0, 0], //'Slime',
    [169, G_CREEP_TYPE.DEMON,    2,  0.2, 0, 0,     0.1, 0, 0], //'Slime Champion',
    [170, G_CREEP_TYPE.INSECT,   1,  0.1, 0, 0,     0.1, 0, 0], //'Scorpion',
    [171, G_CREEP_TYPE.DEMON,    4,  0.6, 0, 0,     0.1, 0, 0], //'Kraken',
    [172, G_CREEP_TYPE.UNDEAD,   3,  0.3, 0, 0,     0.1, 0, 0], //'Vampire',
    [173, G_CREEP_TYPE.UNDEAD,   2,  0.1, 0, 0,     0.1, 0, 0], //'Mummy',
    [174, G_CREEP_TYPE.UNDEAD,   2,  0.3, 0, 0,     0.1, 0, 0], //'Wraith',
    [175, G_CREEP_TYPE.DEMON,    4,  0.5, 0, 0,     0.1, 0, 0], //'Carabia',
    [176, G_CREEP_TYPE.DEMON,    1,  0.1, 0, 0,     0.1, 0, 0], //'Goblin',
    [177, G_CREEP_TYPE.UNDEAD,   2,  0.1, 0, 0,     0.1, 0, 0], //'Zombie',
    [178, G_CREEP_TYPE.UNDEAD,   2,  0.1, 0, 0,     0.1, 0, 0], //'Undead',
    [179, G_CREEP_TYPE.DEMON,    3,  0.3, 0, 0,     0.1, 0, 0], //'Orc',
    [180, G_CREEP_TYPE.DEMON,    3,  1, 0, 0,       0.1, 0, 0], //'Cyclops',
    [181, G_CREEP_TYPE.DEMON,    3,  0.7, 0, 0,     0.1, 0, 0], //'Werewolf',
    [182, G_CREEP_TYPE.DEMON,    6,  0.5, 0, 0,     0.1, 0, 0], //'Werebear',
    [183, G_CREEP_TYPE.DEMON,    7,  2, 1, 2,       1, 1, 1], //'Devil'
]);

Object.freeze(G_TOWN_MAP = {
    heroPos: 15,
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
        28, 28, 28, 28, 28, 28, 28, 28,
        28, 30, 30, 30, 30, 30, 30, 28,
        28, 30, 30, 30, 30, 30, 30, 28,
        28, 30, 30, 30, 30, 30, 30, 28,
        28, 30, 30, 30, 30, 30, 30, 28,
        30, 30, 30, 30, 30, 30, G_FLOOR.STAIR_DOWN, 30,
        30, 30, 30, 30, 30, 30, 30, 30,
    ],
    objects:[
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, G_HERO.PALADIN, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        G_OBJECT.SHRINE, 0, 0, 0, 0, 0, 0, G_OBJECT.ALTAR,
        G_HERO.MONK, 0, 0, 0, 0, 0, 0, G_HERO.WIZARD,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ],
});

Object.freeze(G_MAP_PARAMS = [
    [8, 8, 0, 0], // level 0 is a town
    [8, 8, 5, 2], // width, height, creeps, chests
    [10, 8, 10, 4],
    [12, 8, 15, 6],
    [14, 8, 20, 8],
    [16, 8, 25, 10],
    [16, 10, 30, 14],
    [16, 12, 35, 18],
    [16, 14, 45, 22],
    [16, 16, 55, 26],
    [18, 16, 65, 30],
    [20, 16, 75, 34],
    [22, 16, 85, 38],
    [24, 16, 95, 42],
    [24, 18, 105, 46],
    [24, 20, 115, 50],
    [24, 22, 130, 54],
    [24, 24, 150, 58],
    [26, 24, 170, 62],
    [28, 24, 190, 66],
    [30, 24, 210, 70],
    [32, 24, 230, 74],
    [32, 26, 250, 78],
    [32, 28, 280, 82],
    [32, 30, 310, 86],
    [32, 32, 340, 90],
    [32, 32, 370, 94],
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
