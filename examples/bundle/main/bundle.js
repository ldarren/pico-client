pico.run({
	name: 'bundle',
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
		main: './main/',
		cfg: './cfg/',
		p: './lib/pico/',
		po: './lib/pojs/'
	}
},function(){
	var specMgr= require('p/specMgr')
	var View= require('p/View')
	var project = require('cfg/proj-bundle.json')
	var main

	return function(){
		specmgr.load(null, null, project, function(err, spec){
			if (err) return console.error(err)
			main = new view
			main.spawnbyspec(spec)
		})
	}
})
