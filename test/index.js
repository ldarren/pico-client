const pico = require('pico-common/bin/pico-cli')

pico.run({
	name: 'TestUnit',
	preprocessors:{
		'.asp':function(url,asp){ return pico.export('pico/str').template(asp) }
	},
	paths:{
		'~': './',
		p: './lib/',
		po: './node_modules/pojs/lib/'
	}
},function(){
	const {test} = require('pico/test')
	const Ctrl = require('p/Ctrl')

	return function(){
		const ctrl = new Ctrl
		test('ensure null in spec doesnt break deps', cb => {
			function NewCtrl(name, specRaw, params, host, chains){
				Ctrl.apply(this, arguments)
			}
			NewCtrl.prototype = {
				deps: {a: 'int', b: 'bool', c: 'str'},
				create(deps, params){
					console.log(deps)
					cb(null, 1 === deps.a && null == deps.b && 'a' === deps.c)
				}
			}
			const newCtrl = ctrl.spawn(NewCtrl, null, [['a', 'int', 1], ['b', 'ref', 'b'], ['c', 'str', 'a']])
		})
	}
})
