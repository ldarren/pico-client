pico.def('picAudio', 'picBase', function(){
    var
    me = this,
    name = me.moduleName,
    audioMap = {
        bang: 1,
    },
    audioSprite;

    me.use('piHTMLAudio');

    me.init = function(){
        me.piHTMLAudio.create('dat/ui-sfx.json', function(err, as){
            if (err) return console.error(err);
            audioSprite = as;
        });
    };

    me.play = function(elapsed, evt, entities){
        if (!audioSprite) return entities;
        var e, com, i;

        for(var i=0,l=entities.length; i<l; i++){
            e = entities[i];
            com = e.getComponent(name);
            if (!com) continue;

            audioSprite.play(audioMap[com.id]);
        }
        return entities;
    };
});
