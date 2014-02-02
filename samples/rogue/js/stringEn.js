Object.freeze(G_MSG = {
    POSTFIX_SEPARATOR: " of ",
    ATTACK_WIN: "You rolled a TOTAL(ROLL+ATK) beat NAME's defense DEF, you've dealt DMG damage",
    ATTACK_LOST: "You missed by rolling a TOTAL(ROLL+ATK) lowered than NAME's defense DEF",
    COUNTER_WIN: "NAME has rolled a TOTAL(ROLL+ATK) which is over your defense DEF, you lost HP hp",
    COUNTER_LOST: "NAME missed by rolling a TOTAL(ROLL+ATK) less than your defense DEF",
    CREEP_KILL: ", and you have defeated it",
    CREEP_ALIVE: " but it is still alive",
    HERO_KILL: ", and you have been killed by NAME",
    FLEE_WIN: "You rolled a TOTAL(ROLL+DEX) beat all surrounding creeps `190, you fled the scene",
    FLEE_LOST: "You failed to flee by rolling a TOTAL(ROLL+DEX) lower than NAME's attack ATK, you lost HP hp",
    CAST_FAILURE_MAJOR: "Spell major failure: You roll a 0, this spell was so powerful for your feeble mind that it is thraumatized you. You are now scared and the spell is forgotten.",
    CAST_FAILURE_MINOR: "Spell minor failure: You have failed to cast this spell with a roll of TOTAL(ROLL+STAT) which is lower than the spell difficulty of DIFF",
    CAST_SUCCEED: "You rolled a TOTAL(ROLL+STR)",
    CAST_WHIRLWIND_FAILURE: ", failed to beat the `193 DEF of the NAME",
    CAST_WHIRLWIND_SUCCEED: ", beats the `193 DEF of the NAME",
    CAST_DESTROY_CHEST: ", and you have destroyed COUNT chests",
    CAST_VOID: ", but nothing is near to you",
    CAST_POISONBLADE: ", your weapon has coated with poison",
    CAST_GAZE_FAILURE: ", but nothing is there, this spell has summoned a creep instead...",
    CAST_GAZE_SUCCEED: ", you have revealed a creeps",
    CAST_FIREBALL_SUCCEED: ", you have toasted NAME",
    DLG_TUT_OBJECTIVE: "Lord Odin, the allfather of gods, is gathering an army of gods and heroic dead from Valhala to against the advancement Loki. Loki is the fire god of the Ill Fate, notorious for having the mighty frost giants assisted. Odin attributes this to the deadly dungeon known as Loki's Trial. Filled with unworthy dead and insidious monsters who come from Hel, it is a standing testament to the Loki's madness. Find this dungeon at the south of camp. Complete this trial to prove your worth in the final battle of the fate of gods.",
    DLG_TUT_OPEN_GATE: "To travel down the dungeons and get the ",
});

Object.freeze(G_LABEL = {
    CLOSE: 'Close',
    DONE: 'Done',
    LEAVE: 'Leave',
    OFFER: 'Giving',
    TITHE: 'Tithing', 
});

Object.freeze(G_ELEMENT_NAME = {
    0: 'None',
    1: 'Fire',
    2: 'Air',
    4: 'Water',
    8: 'Earth',
    3: 'Fire, Air',
    5: 'Fire, Water',
    7: 'Fire, Air, Water',
    9: 'Fire, Earth',
    11: 'Fire, Air, Earth',
    13: 'Fire, Water, Earth',
    6: 'Air, Water',
    10: 'Air, Earth',
    14: 'Air, Water, Earth',
    12: 'Water, Earth',
    15: 'Fire, Air, Water, Earth',
});
Object.freeze(G_CREEP_TYPE_NAME = [
    'NA',
    'Plant',
    'Insect',
    'Beast',
    'Undead',
    'Demon',
]);
Object.freeze(G_HERO_CLASS_NAME = {
    1: 'Rogue',
    2: 'Monk',
    4: 'Barbarian',
    8: 'Druid',
    16: 'Hunter',
    32: 'Paladin',
    64: 'Wizard',
    128: 'Warlock',
    17: 'Rogue, Hunter',
    34: 'Monk, Hunter',
    42: 'Monk, Druid, Paladin',
    46: 'Monk, Barbarian, Druid, Paladin',
    192: 'Wizard, Warlock',
    220: 'Barbarian, Druid, Hunter, Wizard, Warlock',
    255: 'All'
});
Object.freeze(G_OBJECT_TYPE_NAME = [
    'Empty',
    'Hero',
    'NPC',
    'Creep',
    'Chest',
    'Env',
    'Health Globe',
    'Key',
    'Potion',
    'Scroll',
    'Weapon',
    'Ammunition',
    'Armor',
    'Material',
    'Craft Ingredient',
    'Money',
    'Spell',
    'Effect',
]);
Object.freeze(G_GRADE_NAME = {
    0: 'None',
    1: 'Common',
    2: 'Charmed',
    4: 'Enchanted',
    8: 'Legendary',
    3: 'Usual',
    12: 'elite',
    6: 'Special',
    8: 'Exceptional',
    15: 'All',
});
Object.freeze(G_LEGENDARY_AFFIX = [
    ["Glimmerborg's", "of Brave"]
    ["Negablade's", "of Ordeal"]
]);
Object.freeze(G_ENCHANTED_PREFIX = [
'Burning','Strong','Heavy','Nimble','Crafty','Sharp','Thin','Grim','Stalwart','Bendy','Balanced','Weak','Grand','Broad','Pointy','Immovable'
]);
Object.freeze(G_CHARMED_POSTFIX = [
'the Phoenix','Strength','Agility','Luck','Health','Precision','Heartseeking','Armor','Defense','Magical Attraction',
'the Heavy','the Thief','Blades','the Golem','the Ninja','the Lion','the Bounty Hunter','the Loser','the Hermit','Kings',
'Beleaguer','Ordeal','Anguish','Torment','Nightmare','Agony','Misery','Burden','Torture',
]);
Object.freeze(G_EQUIP_NAME = ['Helm', 'Armor', 'Weapon', 'Sheild', 'Ring', 'Ring', 'Amulet', 'Ammo']);

Object.freeze(G_OBJECT_NAME = {
    32: 'Chest',
    33: 'Empty Chest',
    34: 'Chest Key',
    35: 'Treasure Key',
    36: 'Gate Key',
    37: 'Dungeon Key',
    38: 'Mystic Key',
    39: 'Skeleton Key',
    40: 'Antidot',
    41: 'Fire Water',
    42: 'Holy Water',
    43: 'Medicinal Potion',
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
    61: 'Bastard Sword',
    62: 'Claymore',
    63: 'Flamebards',
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
    78: 'Arbalest',
    79: 'ChuKoNu',
    80: 'Grenades',
    81: 'Fire Bomb',
    82: 'Thunder Crash Bomb',
    83: 'Hunter Arrows',
    84: 'Broadhead Arrows',
    85: 'Warship Arrows',
    86: 'Hunter Bolts',
    87: 'Military Bolts',
    88: 'Robe',
    89: 'Leather Armor',
    90: 'Scale Armor',
    91: 'Cuirass',
    92: 'Plate Mail',
    93: 'Light Plate',
    94: 'Field Plate',
    95: 'Full Plate',
    96: 'Hood',
    97: 'Sallet',
    98: 'Spangen Helm',
    99: 'Corinthian Helm',
    100: 'Great Helm',
    101: 'Viking Helm',
    102: 'Winged Helm',
    103: 'Barbute Helm',
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
    123: 'Diamond',
    124: 'Ring',
    125: 'Ring',
    126: 'Amulet',
    127: 'Amulet',
    128: 'Skulls',
    129: 'Skull',
    130: 'Skeleton',
    131: 'Tomb',
    132: 'Altar of Vili',
    133: 'Fountain of Eir',
    134: 'Soulstones',
    135: 'Health Globe',
    136: 'Symbol of Protection', // Pentagram
    137: 'Key of Life', // ankh
    138: 'Mark of All Seeing Eye',
    139: 'Cycle of Blood',
    140: 'Rein in the Chaos',
    141: 'The Rite of Sacrifice',
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
    154: 'Komodo Monitor',
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
    175: 'Beholder',
    176: 'Goblin',
    177: 'Zombie',
    178: 'Skeleton',
    179: 'Orc',
    180: 'Cyclops',
    181: 'Werewolf',
    182: 'Werebear',
    183: 'Devil',
    184: 'Blacksmith',
    185: 'Arch-Mage',
    186: 'Town Guard',

    196: 'Whirl Wind',
    197: 'Whirl Wind',
    198: 'Whirl Wind',
    226: 'Poison Blade',
    227: 'Poison Blade',
    228: 'Poison Blade',
    256: 'Gaze',
    257: 'Gaze',
    258: 'Gaze',
    295: 'Fireball',
    296: 'Fireball',
    297: 'Fireball',

    589: 'Burned', // reduce hp
    590: 'Cursed', // reduce roll
    591: 'Diseased', // reduce max hp
    592: 'Feared', // reduce atk and def 
    593: 'Frozen', // immobilize, cooldown stop
    594: 'Poisoned', // hp dun heal
    595: 'Poison Blade',

    701: 'Prove your worth',
    702: 'Key objective',
});
Object.freeze(G_OBJECT_DESC = {
    32: 'Chest',
    33: 'Empty Chest',
    34: 'Chest Key',
    35: 'Treasure Key',
    36: 'Gate Key',
    37: 'Dungeon Key',
    38: 'Mystic Key',
    39: 'Skeleton Key',
    40: 'Antidot',
    41: 'Fire Water',
    42: 'Holy Water',
    43: 'Medicinal Potion',
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
    61: 'Bastard Sword',
    62: 'Claymore',
    63: 'Flamebards',
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
    78: 'Arbalest',
    79: 'ChuKoNu',
    80: 'Grenades',
    81: 'Fire Bomb',
    82: 'Thunder Crash Bomb',
    83: 'Hunter Arrows',
    84: 'Broadhead Arrows',
    85: 'Warship Arrows',
    86: 'Hunter Bolts',
    87: 'Military Bolts',
    88: 'Robe',
    89: 'Leather Armor',
    90: 'Scale Armor',
    91: 'Cuirass',
    92: 'Plate Mail',
    93: 'Light Plate',
    94: 'Field Plate',
    95: 'Full Plate',
    96: 'Hood',
    97: 'Sallet',
    98: 'Spangen Helm',
    99: 'Corinthian Helm',
    100: 'Great Helm',
    101: 'Viking Helm',
    102: 'Winged Helm',
    103: 'Barbute Helm',
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
    123: 'Diamond',
    124: 'Ring',
    125: 'Ring',
    126: 'Amulet',
    127: 'Amulet',
    128: 'Skulls',
    129: 'Skull',
    130: 'Skeleton',
    131: 'Tomb',
    132: 'Altar of Vili, the god of creation. Make offering to god to gain piety. you exhange piety for exhancement.',
    133: 'Fountain of Eir, drink it to restore full health',
    134: 'Soulstones',
    135: 'Health Globe',
    136: 'Symbol of Protection', // Pentagram
    137: 'Key of Life', // ankh
    138: 'Mark of All Seeing Eye',
    139: 'Cycle of Blood',
    140: 'Rein in the Chaos',
    141: 'The Rite of Sacrifice',
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
    154: 'Komodo Monitor',
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
    175: 'Beholder',
    176: 'Goblin',
    177: 'Zombie',
    178: 'Skeleton',
    179: 'Orc',
    180: 'Cyclops',
    181: 'Werewolf',
    182: 'Werebear',
    183: 'Devil',
    184: 'Blacksmith',
    185: 'Arch-Mage',
    186: 'Town Guard',

    196: 'Whirl Wind',
    197: 'Whirl Wind',
    198: 'Whirl Wind',
    226: 'Poison Blade',
    227: 'Poison Blade',
    228: 'Poison Blade',
    256: 'Gaze',
    257: 'Gaze',
    258: 'Gaze',
    295: 'Fireball',
    296: 'Fireball',
    297: 'Fireball',

    589: 'Burned', // reduce hp
    590: 'Cursed', // reduce roll
    591: 'Diseased', // reduce max hp
    592: 'Feared', // reduce atk and def 
    593: 'Frozen', // immobilize, cooldown stop
    594: 'Poisoned', // hp dun heal
    595: 'Poison Blade',

    701: "Lord Odin, the allfather of gods, is gathering an army of gods and heroic dead from Valhala to battle against the forces of jotuns. Loki is the jatun lord of the Ill Fate, notorious for killing many gods. Odin attributes this to the deadly dungeon known as Loki's Trial. Filled with unworthy dead and insidious monsters who come from Hel, it is a standing testament to the Loki's madness. Find this dungeon at the south of camp. Complete this trial by retriveing soulstones from 100th level of dungeon to prove your worth in the final battle of the fate of gods.",
    702: "Go near to key and use it to unlock the gate to bottom level",
});

