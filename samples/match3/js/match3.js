pico.def('m3Main', function(){
    this.use('picAudio');

    var
    me = this,
    onLoad = function(){
        var audio = me.picAudio;
        audio.addSrc('bang', '../res/audio/182274__martian__gun-for-roy');
        pico.addFrame(document.body, 'div#page', 'views/login.html');
    };

    me.slot(pico.LOAD, onLoad);
});
