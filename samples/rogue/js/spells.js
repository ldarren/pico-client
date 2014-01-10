pico.def('spells', function(){
    me.triggerAtAttack = function(spell){
    };

    me.triggerAtExplore = function(spell, id){
        map = this.map,
        hero = this.hero,
        object = this.objects[id],
        flags = this.flags;

        switch(spell[0]){
        case G_SPELL_TYPE.UNHIDE:
            if (!object){
                map[id] |= G_TILE_TYPE.CREEP;
                objects[id] = this.ai.spawnCreep(this.deepestLevel);
                this.recalHints();

                this.go('attack', hero.battle(id, true));
            }else{
                flags[id] = G_UI.FLAG;
                this.go('showInfo', { targetId: id, context: G_CONTEXT.WORLD });
            }
            map[id] &= G_TILE_TYPE.SHOW;
            return true;
        }
        return false;
    };
});
