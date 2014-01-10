pico.def('spells', function(){
    var me = this;

    me.triggerAtAttack = function(spell){
    };

    me.triggerAtExplore = function(spell, id){
        if (!spell) return false;

        map = this.map,
        hero = this.hero,
        objects = this.objects,
        object = objects[id],
        flags = this.flags;

        switch(spell[OBJECT_SUB_TYPE]){
        case G_SPELL_TYPE.UNHIDE:
            if (!object){
                map[id] |= G_TILE_TYPE.CREEP;
                objects[id] = this.ai.spawnCreep(this.deepestLevel);
                this.recalHints();

                this.go('startEffect', {
                    type:'castEfx',
                    targets:[id],
                    spells:[spell[OBJECT_ICON]],
                    callback:'attack',
                    evt:hero.battle(id, true)
                });
            }else{
                flags[id] = G_UI.FLAG;
                this.go('startEffect', {
                    type:'castEfx',
                    targets:[id],
                    spells:[spell[OBJECT_ICON]],
                    callback:'showInfo',
                    evt:{ targetId: id, context: G_CONTEXT.WORLD }
                });
            }
            map[id] &= G_TILE_TYPE.SHOW;
            return true;
        }
        return false;
    };
});
