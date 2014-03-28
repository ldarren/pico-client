Object.freeze(G_MSG = {
    TRADE: "Let's trade, here is my 'ITEM'",
    POSTFIX_SEPARATOR: " of ",
    FLEE_WIN: "You fled the battle area",
    FLEE_LOST: "You failed to flee, improve your `0613 dex and `0193 luck to increase your chances",
    BUY_LABEL: 'Get Extra Slots',
    BAG_FULL: ["You cannot receive this item. Your bag may be full."],
    TOME_FULL: ["You cannot learn this scroll. Your tome may be full."],
});

Object.freeze(G_LABEL = {
    CLOSE: 'Close',
    DONE: 'Done',
    LEAVE: 'Leave',
    OFFER: 'Donate',
    TITHE: 'Tithe', 
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

Object.freeze(G_STAT_NAME = [
    'Icon','Name','Desc','Level','Grade','Type','SubType',
    'HP', 'Fire', 'Dex', 'Luck', 'Str',
    'Atk', 'Atk', 'Def',
    'Plant', 'Insect', 'Beast', 'Undead', 'Demon',
    'Fire', 'Air', 'Water', 'Earth'
]);

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
    256: 'Ash Rat',
    512: 'Tainted Bat',
    1024: 'Dire Wolf',
    2048: 'Arctic Bear',
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
    ["Glimmerborg's", "Brave"],
    ["Negablade's", "Ordeal"]
]);
Object.freeze(G_ENCHANTED_PREFIX = [
'Burning','Strong','Heavy','Nimble','Crafty','Sharp','Thin','Grim','Stalwart','Bendy','Balanced','Weak','Grand','Broad','Pointy','Immovable',
'Disingenuous','Vamoose','Enamor','Bewitch','Enrapture','psychic', 'Fabled'
]);
Object.freeze(G_CHARMED_POSTFIX = [
'the Phoenix','Strength','Agility','Luck','Health','Precision','Heartseeking','Armor','Defense','Magical Attraction',
'the Heavy','the Thief','Blades','the Golem','the Ninja','the Lion','the Bounty Hunter','the Loser','the Hermit','Kings',
'Beleaguer','Ordeal','Anguish','Torment','Nightmare','Agony','Misery','Burden','Torture','Heretic','Dread','Callous','Vain','Arduous',
'Excruciate','Obliterate','Oratory','Deplorer','Unadulterated','Bewilderment','Imminent','Ruin','Despoil','Plunder','Pillage','Sack',
'Ruin','Waste','Desolation','Solitary','Deviant','Uncanny'
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
    41: 'Minor Healing Potion',
    42: 'Greater Healing Potion',
    43: 'Medicinal Potion',
    44: 'Potion of Luck',
    45: 'Master Healing Potion',
    46: 'Holy Water',
    47: 'Fire Water',
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
    132: 'Altar of Wodinaz',
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
    154: 'Salamandra',
    155: 'Spider King',
    156: 'Toad',
    157: 'Scarab',
    158: 'Centipede',
    159: 'Serpent',
    160: 'Fungi',
    161: 'Hare',
    162: 'Bat',
    163: 'Bat King',
    164: 'Snake',
    165: 'Wolf',
    166: 'Wild Boar',
    167: 'Bear',
    168: 'Slime',
    169: 'Slime King',
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
    183: 'Balrog',
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
    562: 'Lycan',
    563: 'Lycan',
    564: 'Lycan',
    565: 'Nocturnal',
    566: 'Nocturnal',
    567: 'Nocturnal',
    568: 'Growl',
    569: 'Growl',
    570: 'Growl',
    571: 'Squeal',
    572: 'Squeal',
    573: 'Squeal',

    589: 'Burned', // reduce hp
    590: 'Cursed', // reduce roll
    591: 'Plague', // reduce max hp
    592: 'Feared', // reduce atk and def 
    593: 'Frozen', // immobilize, cooldown stop
    594: 'Poisoned', // hp dun heal
    595: 'Poison Blade',
    596: 'Squeal',
    597: 'Nocturnal',
    598: 'Lycan',
    599: 'Growl',

    681: 'Stash',
    682: 'Empty stash',

    691: 'Ash Rat',
    692: 'Tainted Bat',
    693: 'Dire wolf',
    694: 'Arctic Bear',

    701: 'Prove your worth',
    702: 'Key objective',
    703: 'Creep sweeping',
    704: 'Combat training',
    705: 'Combat rewards!',
    706: 'Treasure hunting',
    707: 'Waypoint!',
    708: 'Equip items',
});
Object.freeze(G_OBJECT_DESC = {
    32: 'Contains treasures depend on your luck',
    33: 'A looted chest',
    34: 'Chest Key',
    35: 'Treasure Key',
    36: 'Use it to unlock dungeon gate to next level',
    37: 'Dungeon Key',
    38: 'Mystic Key',
    39: 'Skeleton Key',
    40: 'Drink it to cure poison',
    41: 'Drink it to restore 1 HP',
    42: 'Drink it to restore 3 HP',
    43: 'Drink it to cure for the plague',
    44: 'Drink it to be lucky for 4 turns',
    45: 'Drink it to restore 8 HP',
    46: 'Drink it to remove curse',
    47: 'Drink it to remove fear',
    48: 'Manuscript',
    49: 'Identify Scroll',
    50: 'Use it to open a town portal',
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
    132: 'Altar of the god of creation. Make offering to god to gain piety. you may exhange piety for exhancements.',
    133: 'Drink it to restore full health',
    134: 'Soulstones',
    135: 'consume it to heal yourself (and enemies)',
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
    150: 'An old and stinky sorcerer',
    151: 'A young and intelligent magic user, obcess with rare and forbidden tomes and bent honself to dark sorcery allow him gained powerful art of magic at young age',
    152: 'Rat',
    153: 'Spiders',
    154: 'A worm penetrating flames',
    155: 'Spider King',
    156: 'Toad',
    157: 'Scarab',
    158: 'Centipede',
    159: 'Serpent',
    160: 'Fungi',
    161: 'Hare',
    162: 'Bat',
    163: 'Bat King',
    164: 'Snake',
    165: 'Wolf',
    166: 'Wild Boar',
    167: 'Bear',
    168: 'Slime',
    169: 'Slime King',
    170: 'Scorpion',
    171: 'Kraken',
    172: 'Vampire',
    173: 'Mummy',
    174: 'Angry spirit of failed heroes',
    175: 'Beholder',
    176: 'Goblin',
    177: 'Zombie',
    178: 'Skeleton',
    179: 'Orc',
    180: 'Cyclops',
    181: 'Werewolf',
    182: 'Werebear',
    183: 'A demonic spirits, lord of evil, sin and treachery, and the enemies of God and the human race',
    184: 'Mighty dwarf that can build any item with a reasonable price',
    185: 'The leader of the mages guild, deep knowledge in making potions and enchanting items',
    186: 'Full plated town guardian, his hobby is to gamble with traveller',

    196: 'Spin attack all nearby objects',
    197: 'Spin attack all nearby objects',
    198: 'Spin attack all nearby objects',
    226: 'Coats weapon with poisons',
    227: 'Coats weapon with poisons',
    228: 'Coats weapon with poisons',
    256: 'Expose object at hidden cell, summon creep if failed',
    257: 'Expose object at hidden cell, summon creep if failed',
    258: 'Expose object at hidden cell, summon creep if failed',
    295: 'Hurls a fiery ball to selected cell',
    296: 'Hurls a fiery fireball to selected cell',
    297: 'Hurls a fiery mateor to selected cell',
    562: 'Shape shift to a fast and furious dire wolf can spread poison when attack',
    565: 'Shape shift to a tainted bat that spread plague to any object come in contact',
    568: 'Shape shift to a mighty arctic bear that frozen attack object',
    571: 'Shape shift to ash rat that burn any object come in contact',

    589: 'Reduce HP per turn', // reduce hp
    590: 'Increase skill casting cost', // reduce roll
    591: 'Reduce MAX HP per turn', // reduce max hp
    592: 'Stop attack point regeneration', // reduce atk and def 
    593: 'Stop cooldown', // immobilize, cooldown stop
    594: 'Prevent object from healing', // hp dun heal
    595: 'Poison object when deal damage',
    596: 'Weak creature that burn creep when touch',
    597: 'Weak creature that spread plague to contacted creep',
    598: 'Fast and furious creature that spread poison when attack',
    599: 'Sturdy and strong creature that freeze contact',

    681: 'It holds items for your friends',
    682: 'It holds items for your friends',

    701: "Welcome to Loki's Trial, God has created this town to guard the dungeon named Loki's Trail, to test the strength and purity of our soul. travel down to the deepest level and retrieve a soul stone to complete the test",
    702: "Your goal is to unlock the exit gate `012 of each level and travel down to next level. Key `036 is required to unlock gate, go near to the key `036 tap on it and choose 'Unlock Gate'",
    703: 'The key to down stair is concealed in dungeon, tab on hidden cell `08 to reveal it, but hidden cell may contains dangerous creep, the digit on cell indicates the number of adjacent cells which contains creeps. You can use this information to deduce creep-free cell, reveal creep-free cells to discover the key. Warning! a revealed creep may attack you immediately. if you get killed your soul will join Valhala and God Wodinaz will reincarnate you, so don\'t be afraid to try',
    704: 'The key to next level is keep by one of the hidden creeps, to get the key creeps must be defeated. Use the digit on the floor to deduce the creep location and use skill from tome to expose creep. exposed creeps has a `0202 icon on them and they don\'t attack you by exposing them. to attack creep, tab on creep and choose fight.',
    705: 'Beside getting key, defeating creep also reward you a health globe `0135 and a piety point `0196 . consume a health globe restore one hit point 663 for you and all exposed creeps. Piety point can be used to get rewards from God Wodinaz Altar at town',
    706: 'Creeps are not the only objects conceled in dungeon, there treasure chests that you can find to get equipments, consumable items and spell scrolls. Expose all concealed objects to find treasures',
    707: 'There is a waypoint in this dungeon. A Waypoint is a way to fast travel between dungeon and town. They appear as `09 when inactive, and `017 when activated. besides waypoint there are teleport scrolls to travel back to town immediately',
    708: 'Looted artifacts from treasure chest are kept in your bag. to equip item from bag, tab on the item and choose Equip. You can see equip item from expanded player stats window. Item may have enchantment that contain elemental power. Your skill requires elemental power to level up',
});
Object.freeze(G_MEDAL_GRADE = ['Medal of ', 'Medal of ', 'Order of ', 'Hero of ', 'Hero of ']);
Object.freeze(G_MEDAL_NAME = {
won:            'Glory',
die:           'the Steadfast', 
gold:           'Wealth',
piety:          'Faith',
chest:          'Quest',
fame:           'Fame',
common:         'Favour',
charm:          'Luck',
enchant:        'Fortune',
legendary:      'Fate',
drink:          'Indulgence',
learn:          'Arcanum', 
plant:          'Blight',
insect:         'Pestilence',
beast:          'Fury',
undead:         'Acolyte',
demon:          'Torment',
def:            'Fortitude',
patk:           'Mastery',
ratk:           'Deadeye',
will:           'Oath',
cast:           'Adept',
burn:           'Inferno',
curse:          'Conjure',
plague:         'Retribution',
fear:           'Terror',
frozen:         'Blizzard',
poison:         'Alchemy',
});
Object.freeze(G_MEDAL_DESC = {
won:            'The deeper the dungeon, the more glory in overcoming it and retrieve the soul stones',
die:           'A dutifully fearless spirit that stuborn challenge the legion from Hel, rise every time falling', 
gold:           'Earning golds',
piety:          'Earning piety points',
chest:          'Open chests on dungeon floors',
fame:           'Actively trading with friends',
common:         'Found common items',
charm:          'Found charmed items',
enchant:        'Found enchanted items',
legendary:      'Found legendary items',
drink:          'Drink potions to maintain healthy state 324349 98958924 445329 23424',
learn:          'Learning arcane skills from scrolls', 
plant:          'Kill plant type creeps',
insect:         'kil insect type creeps',
beast:          'kill beast type creeps',
undead:         'kill undead type creeps',
demon:          'kill demon type creeps',
def:            'Block incoming attack',
patk:           'Deal melee damage',
ratk:           'Deal range damage',
will:           'Deal damage with skills',
cast:           'Actively cast spell',
burn:           'Burn creeps number of times',
curse:          'Curse creeps number of times',
plague:         'Spread disease to creeps',
fear:           'Causing fear to creeps',
frozen:         'Freeze creeps number of times',
poison:         'Spread poison to creeps',
});
