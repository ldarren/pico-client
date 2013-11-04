// HTML5 Audio component
// support for ogg and aac format only
// background music is not supported due to current html5 audio api doesnt support multichannels playback
pico.def('piHTMLAudio', function(){
    var
    me = this,
    channels = {},
    muted = false,
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
    };

    function AudioSprite(audio, sprite){
        this.audio = audio;
        this.sprite = sprite;
        this.audio.sprite = sprite;
        this.audio.currentTileId = 0;
    }
    
    AudioSprite.prototype = {
        onTimeUpdate: function(evt){
            // HACK: fix readonly currentTime bug if audio played to its end
            var tile = this.sprite[this.currentTileId];
            if (this.currentTime + 0.5 > tile[0] + tile[1]) this.pause();
        },

        // must call within mouse or touch event to overcome ios limitation
        preload: function(){
            this.audio.load();
        },

        // sample usage
        // audioSprite.volume(0.1);
        volumn: function(level){

            if (level > 1.0) level = 1.0;
            if (level < 0) level = 0;
            this.audio.volume = level;
        },

        play: function(index){
            var audio = this.audio;
            if (audio.muted) return;

            var tile = audio.sprite[index];
            if (4 === audio.readyState) {
                audio.currentTileId = index;
                pauseAll();
                audio.currentTime = tile[0]; // for immediate sound effect
                audio.play();
            }
        },

        stop: function(){
            this.audio.pause();
        },
    };

    me.create = function(audioPath, spritePath, cb){
        var audioSprite = channels[audioPath];
        if (audioSprite){
            return cb(null, audioSprite);
        }
        pico.ajax('get', spritePath, null, {}, function(err, xhr){
            if (err) return cb(err);
            if (4 === xhr.readyState){
                try{ var sprite = JSON.parse(xhr.responseText); }
                catch(ex){ return cb(ex); }

                var snd = new Audio(audioPath + (useOgg ? '.ogg' : '.aac'));

                var audioSprite = new AudioSprite(snd, sprite);
                snd.addEventListener('error', onLoadError, false);
                snd.addEventListener('timeupdate', audioSprite.onTimeUpdate, false);
                channels[audioPath] = audioSprite;
                cb(null, audioSprite);
            }
        });
    };

    me.remove = function(audioPath){
        var audioSprite = channels[audioPath];
        if (!audioSprite){
            return;
        }
        var snd = audioSprite.audio;
        snd.removeEventListener('error', onLoadError);
        snd.removeEventListener('timeupdate', audio.onTimeUpdate);
        delete channels[audioPath];
    };

    me.clearAll = function(){
        var 
        keys = Object.keys(channels),
        audioSprite, snd;
        for(var i=0,l=keys.length; i<l; i++){
            audioSprite = channels[keys[i]];
            snd = audioSprite.audio;
            snd.removeEventListener('error', onLoadError);
            snd.removeEventListener('timeupdate', audioSprite.onTimeUpdate);
        }
        channels = {};
    };

    me.get = function(audioPath){
        return channels[audioPath];
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
            c.volume(volume);
        }
    };

    me.stopAll = function(){
        var c;
        for(var k=0,l=keys.length; k<l; k++){
            c = channels[keys[k]];
            c.stop();
        }
    };

    window.addEventListener('blur', onBlur, false);
});
