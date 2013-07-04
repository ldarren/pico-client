pico.def('m3Main', function(){

    var
    me = this,
    onLoad = function(){
        pico.addFrame(document.body, 'div#page', 'views/game.html');
    };

    me.slot(pico.LOAD, onLoad);
});
