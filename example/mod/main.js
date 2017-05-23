var pStr=pico.export('pico/str')
pico.run({
	name: 'main',
	ajax:__.ajax,
	onLoad: __.load,
    env:{
        live:false
    },
	preprocessors:{
		'.asp':function(url,asp){ return pStr.template(asp) }
	},
	paths:{
		'~': './mod/',
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
