var
Module = require('Module'),
UpdateDrawers = function(){
    var
    $ = function(id){return document.getElementById(id)},
    state = snapper.state(),
    towards = state.info.towards,
    opening = state.info.opening;

    if(opening=='right' && towards=='left'){
        $('right-drawer').classList.add('active-drawer');
        $('left-drawer').classList.remove('active-drawer');
    } else if(opening=='left' && towards=='right') {
        $('right-drawer').classList.remove('active-drawer');
        $('left-drawer').classList.add('active-drawer');
    }
}
snapper

exports.Class = Module.Class.extend({
    initialization: function(){
        snapper = new Snap({element: $content[0]})
        snapper.on('drag', UpdateDrawers);
        snapper.on('animate', UpdateDrawers);
        snapper.on('animated', UpdateDrawers);
    }
})
