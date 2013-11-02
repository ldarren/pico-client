// HTML5 Audio component
// support for ogg and aac format only
// background music is not supported due to current html5 audio api doesnt support multichannels playback
pico.def('picAudio', 'picBase', function(){
    var
    me = this,
    muted = false,
    channels = {},
    useOgg = (function(){
        var snd = new Audio();
        return (typeof snd.canPlayType === 'function' && snd.canPlayType('audio/ogg') !== '');
    }).call(),
    pauseAll = function(){
        var keys = Object.keys(channels);
        for(var i=0,l=keys.length; i<l; i++){
            channels[keys[i]].pause();
        }
    },
    onFocus = function(evt){
        window.removeEventListener('focus', onFocus, false);
        window.addEventListener('blur', onBlur, false);

        muted = false;
    },
    onBlur = function(evt){
        window.removeEventListener('blur', onBlur, false);
        window.addEventListener('focus', onFocus, false);

        muted = true;
        pauseAll();
    },
    onLoadError = function(evt){
        return console.error('failed to load', evt.srcElement.currentSrc);
    },
    onTimeUpdate = function(evt){
        // HACK: fix readonly currentTime bug if audio played to its end
        if (this.currentTime + 0.5 > this.duration) this.pause();
    };

    me.addSrc = function(id, src, option){
        var snd = new Audio(src + (useOgg ? '.ogg' : '.aac'));

        snd.addEventListener('error', onLoadError, false);
        snd.addEventListener('timeupdate', onTimeUpdate, false);
        channels[id] = snd;
    };

    me.removeSrc = function(id){
        var snd = channels[id];
        snd.removeEventListener('error', onLoadError);
        snd.removeEventListener('timeupdate', onTimeUpdate);
        delete channels[id];
    };

    me.clearAllSrc = function(){
        var 
        keys = Object.keys(channels),
        snd;
        for(var i=0,l=keys.length; i<l; i++){
            snd = channels[keys[i]];
            snd.removeEventListener('error', onLoadError);
            snd.removeEventListener('timeupdate', onTimeUpdate);
        }
        channels = {};
    };

    // must call within mouse or touch event to overcome ios limitation
    me.preload = function(){
        var keys = Object.keys(channels);
        for(var k=0,l=keys.length; k<l; k++){
            channels[keys[k]].load();
        }
    };

    // sample usage
    // picAudio.volume(0.1);
    // picAudio.volume(0.1, 'channel1');
    // picAudio.volume(0.1, ['channel1', 'channel2']);
    me.volumn = function(){
        var
        volume = arguments[0],
        keys, c;
        if (arguments.length > 1){
            switch(typeof arguments[1]){
                case 'string': keys = [arguments[1]]; break;
                case 'object': 
                    keys = arguments[1];
                    if (!keys.length) keys = null;
                    break;
            }
        }
        if (!keys) keys = Object.keys(channels);

        if (volume > 1.0) volume = 1.0;
        if (volume < 0) volume = 0;

        for(var k=0,l=keys.length; k<l; k++){
            c = channels[keys[k]];
            if (!c || !c.volume) continue;
            c.volume = volume;
        }
    };

    me.play = function(elapsed, evt, entities){
        if (muted) return;

        var
        name = me.moduleName,
        opt;
        for (var i=0, l=entities.length; i<l; i++){
            opt = entities[i].getComponent(name);
            if (opt) break;
        }

        if (opt){
            var snd = channels[opt.id];
            if (4 === snd.readyState) {
                pauseAll();
                snd.currentTime = 0; // for immediate sound effect
                snd.play();
            }
        }

        return entities;
    };

    me.stop = function(elapsed, evt, entities){
        return entities;
    };

    window.addEventListener('blur', onBlur, false);
});
