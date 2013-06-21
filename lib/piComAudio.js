// support for ogg and aac format only
// background music is not supported due to current html5 audio api doesnt support multichannels playback
pico.def('piComAudio', 'piComponentBase', function(){
    var
    me = this,
    silenced = false,
    channels = {},
    useOgg = (function(){
        var snd = new Audio();
        return (typeof snd.canPlayType === 'function' && snd.canPlayType('audio/ogg') !== '');
    }).call(),
    pauseAll = function(){
        var keys = Object.keys(channels);
        for(var k=0,l=keys.length; k<l; k++){
            channels[keys[k]].pause();
        }
    },
    onFocus = function(evt){
        window.removeEventListener('focus', onFocus, false);
        window.addEventListener('blur', onBlur, false);

        silenced = false;
    },
    onBlur = function(evt){
        window.removeEventListener('blur', onBlur, false);
        window.addEventListener('focus', onFocus, false);

        silenced = true;
        pauseAll();
    },
    onLoadError = function(evt){
        return console.error('failed to load', evt.srcElement.currentSrc);
    };

    me.addAudio = function(id, src, option){
        var snd = new Audio(src + (useOgg ? '.ogg' : '.aac'));
        snd.addEventListener('error', onLoadError, false);
        channels[id] = snd;
    };

    // must call within mouse or touch event to overcome ios limitation
    me.preload = function(){
        var keys = Object.keys(channels);
        for(var k=0,l=keys.length; k<l; k++){
            channels[keys[k]].load();
        }
    };

    me.play = function(entities){
        if (silenced) return;

        var opt;
        for (var i=0, l=entities.length; i<l; i++){
            opt = entities[i].getComponent(me);
            if (opt) break;
        }

        if (opt){
            pauseAll();
            var snd = channels[opt.id];
            snd.currentTime = 0;
            snd.pause(); // fixed some android browser doesnt reset seektime
            snd.play();
        }

        return entities;
    };

    me.stop = function(entities){
        return entities;
    };

    window.addEventListener('blur', onBlur, false);
});
