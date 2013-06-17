pico.def('m3Frame', function(){
    var
    me = this,
    onLoad = function(){
        pico.addFrame(document.body, 'div#page', 'views/login.html');
    };

    this.slot(pico.LOAD, onLoad);
});
