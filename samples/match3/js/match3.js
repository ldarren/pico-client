pico.def('m3Main', function(){
    this.use('piHTMLAudio');

    var
    me = this,
    onLoad = function(){
        me.piHTMLAudio.create('dat/ui-sfx.json', function(err, audioSprite){
            pico.addFrame(document.body, 'div#page', 'html/login.html');
        });
    };

    me.slot(pico.LOAD, onLoad);
});
