pico.run({
    name: 'main',
    ajax: __.ajax,
    onLoad: __.load,
    env:{
        live:false,
		dataset:(function(el){ if (el) return el.dataset })(document.getElementById('picoDS'))
    },
    preprocessors:{
        '.asp':function(url,txt){ return _.template(txt,{variable:'d'}) }
    },
    paths:{
        '~': 'mod/',
        root: './',
        cfg: 'cfg/',
        js: 'js/',
        json: 'json/'
    }
},function(){
    require('js/Module') // reload
    var
    Frame= require('js/Frame'),
    project = require('cfg/project.json'),
    env = require('cfg/env.json')

    return function(){
        Frame.start(project, env)
    }
})
