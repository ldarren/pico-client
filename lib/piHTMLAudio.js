// HTML5 Audio component
// before editing this code please read following precaution notice
// - this code supports ogg and mp4 format only
// - background music is not supported due to current html5 audio api doesnt support multichannels playback
// - preload must be called in mouse or touch event
// - in ios, audio file only load when audio is first play, but in android, audio load when Audio object is created
// - browser close and suspend doesn't trigger onBlur, therefore we need to listen to onBeforeUnload
// - each tile in sprite must at least 2 sec long
// - accuracy of tile start time and duration should not be more than 0.1 sec
pico.def('piHTMLAudio', function(){
    var
    me = this,
    Random = Math.random, Ceil = Math.ceil, Floor = Math.floor,
    channels = {},
    muted = false,
    useOgg = (function(){
        var snd = new Audio();
        return (typeof snd.canPlayType === 'function' && snd.canPlayType('audio/mp4') === '');
    }).call(),
    playList = function(audioSprite, key, list, index, minGap, maxGap, ordered){
        var loopList = audioSprite.loopList;

        if (!loopList[key]) return; // removed?

        var
        audio = audioSprite.audio,
        tile, val;

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
        window.addEventListener('beforeunload', onBlur, false);
console.log('onFocus');
        muted = false;
    },
    onBlur = function(evt){
        window.removeEventListener('blur', onBlur, false);
        window.removeEventListener('beforeunload', onBlur, false);
        window.addEventListener('focus', onFocus, false);
console.log('onBlur');

        muted = true;
        pauseAll();
    },
    onLoadError = function(evt){
        return console.error('failed to load', evt.srcElement.currentSrc);
    },
    onPlay = function(evt){
        console.log('first play', this.src);
        this.pause();
        this.removeEventListener('play', onPlay, false);
    },
    onTimeUpdate = function(evt){
        // HACK: fix readonly currentTime bug if audio played to its end
        var tile = this.sprite.list[this.currentTileId];
        if (this.currentTime + 0.5 > tile[0] + tile[1]){
            this.pause();
        }
    };

    function AudioSprite(sprite){
        this.audio = null;
        this.sprite = sprite;
        this.loopList = {};
    }
    
    AudioSprite.prototype = {
        // must call within mouse or touch event to overcome ios and android limitation
        preload: function(){
            var snd = new Audio(this.sprite.path + (useOgg ? '.ogg' : '.mp4'));
            snd.addEventListener('error', onLoadError, false);
            snd.addEventListener('timeupdate', onTimeUpdate, false);
            snd.sprite = this.sprite;
            snd.currentTileId = 0;
            this.audio = snd;
            snd.addEventListener('play', onPlay, false);
            snd.play(); 
            console.log('preload',snd.src); // safari need this for time seeking
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
            var
            audio = this.audio,
            tile = audio.sprite.list[index];
            if (4 === audio.readyState) {
                pauseAll();
                audio.currentTileId = index;
                audio.currentTime = tile[0]; // for immediate sound effect
                audio.play();
            }
            return tile;
        },

        stop: function(){
            var a = this.audio;
            if (a && a.readyState){
                a.pause();
console.log('pause', a.src);
            }
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

                var audioSprite = new AudioSprite(sprite);
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
    window.addEventListener('beforeunload', onBlur, false);
});
