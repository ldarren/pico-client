pico.def('m3Main', function(){
    this.use('piComAudio');

    var
    me = this,
    onLoad = function(){
        var audio = me.piComAudio;
        audio.addAudio('bang', '../res/audio/182274__martian__gun-for-roy');
        pico.addFrame(document.body, 'div#page', 'views/login.html');
    };

    this.slot(pico.LOAD, onLoad);
});
