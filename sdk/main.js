pico.run({
    name: 'main',
    ajax: __.ajax,
    onLoad: __.load,
    env:{
        live:false,
		dataset:(function(el){ if (el) return el.dataset })(document.getElementById('picoEnv'))
    },
    preprocessors:{
        '.asp':function(url,asp){ return pico.export('pico/str').template(asp) }
    },
    paths:{
        '~': './mod/',
        root: './',
        cfg: './cfg/',
		p: './lib/pico/',
		po: './lib/pojs/'
    }
},function(){
    var
    Frame= require('p/Frame'),
    project = require('cfg/proj.json'),
    env = require('cfg/env.json')

    return function(){
        new Frame(project, env)
    }
})
