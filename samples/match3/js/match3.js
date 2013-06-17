pico.def('m3Frame', function(){
    var
    me = this,
    onLoad = function(){
        pico.addFrame(document.body, 'page', 'views/login.html');
    };

    this.slot(pico.LOAD, onLoad);
});
