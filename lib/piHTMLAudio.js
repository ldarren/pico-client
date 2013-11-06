// HTML5 Audio component
// support for ogg and aac format only
// background music is not supported due to current html5 audio api doesnt support multichannels playback
pico.def('piHTMLAudio', function(){
    var
    me = this,
    Random = Math.random, Ceil = Math.ceil, Floor = Math.floor,
    channels = {},
    muted = false,
    useOgg = (function(){
        var snd = new Audio();
        return (typeof snd.canPlayType === 'function' && snd.canPlayType('audio/ogg') !== '');
    }).call(),
    playList = function(audioSprite, key, list, index, minGap, maxGap, ordered){
        var loopList = audioSprite.loopList;

        if (!loopList[key]) return; // removed?

        var
        audio = audioSprite.audio,
        tile, val;
console.log('HTMLAudio',muted);
        if (muted){
            val = window.setTimeout(
                playList, 
                maxGap,
                audioSprite, key, list, index, minGap, maxGap, ordered);

            loopList[key] = val;
            return;
        }
        // if currently playing, wait for it to stop
        if (!audio.paused){
            tile = audioSprite.sprite.list[audio.currentTileId];
            val = window.setTimeout(
                playList, 
                tile[1] + minGap,
                audioSprite, key, list, index, minGap, maxGap, ordered);

            loopList[key] = val;
            return;
        }

        var
        index = index >= list.length ? 0 : index,
        id = list[index];

        audioSprite.play(id);

        tile = audioSprite.sprite.list[id];

        val = window.setTimeout(
            playList, 
            tile[1] + minGap + Ceil((maxGap - minGap)*Random()),
            audioSprite, key, list, ordered ? index++ : Floor(list.length*Random()), minGap, maxGap, ordered);

        loopList[key] = val;
    },
    pauseAll = function(){
        var keys = Object.keys(channels);
        for(var i=0,l=keys.length; i<l; i++){
            channels[keys[i]].stop();
        }
    },
    onFocus = function(evt){
        window.removeEventListener('focus', onFocus, false);
        window.addEventListener('blur', onBlur, false);

        muted = false;
console.log('HTMLAudio focus',muted);
    },
    onBlur = function(evt){
        window.removeEventListener('blur', onBlur, false);
        window.addEventListener('focus', onFocus, false);

        muted = true;
        pauseAll();
console.log('HTMLAudio blur',muted);
    },
    onLoadError = function(evt){
        return console.error('failed to load', evt.srcElement.currentSrc);
    };

    function AudioSprite(audio, sprite){
        this.audio = audio;
        this.sprite = sprite;
        this.loopList = {};
        audio.sprite = sprite;
        audio.currentTileId = 0;
    }
    
    AudioSprite.prototype = {
        onTimeUpdate: function(evt){
            // HACK: fix readonly currentTime bug if audio played to its end
            var tile = this.sprite.list[this.currentTileId];
            if (this.currentTime + 0.5 > tile[0] + tile[1]) this.pause();
        },

        // must call within mouse or touch event to overcome ios limitation
        preload: function(){
            var a = this.audio;
            a.load();
            //a.play(); // safari need this for time seeking
            a.pause();
        },

        // sample usage
        // audioSprite.volume(0.1);
        volume: function(level){

            if (level > 1.0) level = 1.0;
            if (level < 0) level = 0;
            this.audio.volume = level;
        },

        play: function(index){
            if (muted) return;
console.log('audioSprite play', muted, audio.readyState);
            var
            audio = this.audio,
            tile = audio.sprite.list[index];
            //if (4 === audio.readyState) {
                audio.currentTileId = index;
                pauseAll();
                audio.currentTime = tile[0]; // for immediate sound effect
                audio.play();
            //}
            return tile;
        },

        stop: function(){
            this.audio.pause();
        },

        // loop: playList([1], 0, 0, true);
        playList: function(list, minGap, maxGap, ordered){
            var
            key = ''+(Date.now()*1000 + Object.keys(this.loopList).length);
            val = window.setTimeout(
                playList, 
                minGap + Ceil((maxGap - minGap)*Random()),
                this, key, list, ordered ? 0 : Floor(list.length*Random()), minGap, maxGap, ordered);
            this.loopList[key] = val;
            return key;
        },

        stopList: function(playListId){
            var id = this.loopList[playListId];
            if (!id) return;
            window.clearTimeout(id);
            delete this.loopList[playListId];
        },

        stopAllLists: function(){
            var ids = Object.keys(this.loopList);
            for(var i=0,l=ids.length; i<l; i++){
                this.stopList(ids[i]);
            }
        },
    };

    me.create = function(path, cb){
        var audioSprite = channels[path];
        if (audioSprite){
            return cb(null, audioSprite);
        }
        pico.ajax('get', path, null, {}, function(err, xhr){
            if (err) return cb(err);
            if (4 === xhr.readyState){
                try{ var sprite = JSON.parse(xhr.responseText); }
                catch(ex){ return cb(ex); }

                var snd = new Audio(sprite.path + (useOgg ? '.ogg' : '.aac'));

                var audioSprite = new AudioSprite(snd, sprite);
                snd.addEventListener('error', onLoadError, false);
                snd.addEventListener('timeupdate', audioSprite.onTimeUpdate, false);
                channels[path] = audioSprite;
                cb(null, audioSprite);
            }
        });
    };

    me.remove = function(path){
        var audioSprite = channels[path];
        if (!audioSprite){
            return;
        }
        var snd = audioSprite.audio;
        snd.removeEventListener('error', onLoadError);
        snd.removeEventListener('timeupdate', audioSprite.onTimeUpdate);
        delete channels[path];
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

    me.getSprite = function(path){
        return channels[path];
    };

    me.preload = function(){
        var keys = Object.keys(channels);
        for(var i=0,l=keys.length; i<l; i++){
            channels[keys[i]].preload();
        }
    };

    // sample usage
    // picAudio.volume(0.1);
    // picAudio.volume(0.1, 'channel1');
    // picAudio.volume(0.1, ['channel1', 'channel2']);
    me.volume = function(){
        var
        volume = arguments[0],
        keys;
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
            channels[keys[k]].volume(volume);
        }
    };

    me.stopAll = function(){
        var keys = Object.keys(channels);
        for(var k=0,l=keys.length; k<l; k++){
            channels[keys[k]].stop();
        }
    };

    window.addEventListener('blur', onBlur, false);
});
