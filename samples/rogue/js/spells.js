pico.def('spells', function(){
    var me = this;

    me.triggerAtAttack = function(spell){
    };

    me.triggerAtExplore = function(spell, id){
        if (!spell) return false;

        var
        map = this.map,
        hero = this.hero,
        objects = this.objects,
        object = objects[id],
        flags = this.flags,
        nextAction, nextActionEvent;

        switch(spell[OBJECT_SUB_TYPE]){
        case G_SPELL_TYPE.WHIRLWIND:
            break;
        case G_SPELL_TYPE.GAZE:
            if (!object){
                map[id] |= G_TILE_TYPE.CREEP;
                objects[id] = this.ai.spawnCreep(this.deepestLevel);
                this.recalHints();
                nextAction = 'attack';
                nextActionEvent = hero.battle(id, true);
            }else{
                flags[id] = G_UI.FLAG;
                nextAction = 'showInfo';
                nextActionEvent = { targetId: id, context: G_CONTEXT.WORLD };
            }
            map[id] &= G_TILE_TYPE.SHOW;
            break;
        case G_SPELL_TYPE.FIREBALL:
            if (object){
                switch(object[OBJECT_TYPE]){
                case G_OBJECT_TYPE.CREEP:
                    nextAction = 'showInfo';
                    object[CREEP_HP]--;
                    if (this.ai.bury(id)){
                        nextActionEvent = { info:'You have killed '+object[OBJECT_NAME] };
                    }else{
                        nextActionEvent = { info:'You have toasted '+object[OBJECT_NAME]+' but it is still alive' };
                    }
                    break;
                case G_OBJECT_TYPE.HERO:
                case G_OBJECT_TYPE.NPC:
                case G_OBJECT_TYPE.KEY:
                case G_OBJECT_TYPE.ENV:
                    // ignore
                    break;
                default:
                    var empty = G_OBJECT[G_ICON.CHEST_EMPTY].slice();
                    empty[OBJECT_NAME] = G_OBJECT_NAME[empty[OBJECT_ICON]];
                    this.objects[id] = empty;
                    nextAction = 'showInfo';
                    nextActionEvent = { info:'You have toasted a '+object[OBJECT_NAME] };
                }
                
            }
            map[id] &= G_TILE_TYPE.SHOW;
            break;
        }

        this.go('startEffect', {
            type:'castEfx',
            targets:[id],
            spells:[spell[OBJECT_ICON]],
            callback:nextAction,
            event:nextActionEvent
        });

        return true;
    };
});
