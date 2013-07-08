pico.def('game', 'picGroup', function(){

    var
    me = this,
    JOB_NAMES = ['Rogue', 'Priest', 'Barbarian', 'Druid', 'Hunter', 'Knight', 'Wizard', 'Warlock'];

    me.tileSet = null;
    me.heroJob = G_HERO.ROGUE;
    me.tileWidth = 16;
    me.tileHeight = 16;
    me.mapWidth = 160;
    me.mapHeight = 160;
    me.mapLevel = 0;
    me.heroPos = [];
    me.map = [];

});
