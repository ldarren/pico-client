const pico = require('pico-common/bin/pico-cli')
global.__ = { dom: { get(){} } } // fake __

pico.run({
	name: 'TestUnit',
	preprocessors:{
		'.asp':function(url,asp){
			return pico.export('pico/str').template(asp)
		}
	},
	paths:{
		'~': './',
		p: './lib/',
		po: './node_modules/pojs/lib/'
	}
},function(){
	const {test} = require('pico/test')
	const View = require('p/View')

	return function(){
		const view = new View
		test('ensure pico.run works', cb => {
			function NewView(name, specRaw, params, host, chains){
				View.apply(this, arguments)
			}
			NewView.prototype = {
				deps: {a: 'int', b: 'bool', c: 'str'},
				create(deps, params){
					cb(null, 1 === deps.a && true === deps.b && 'a' === deps.c)
				}
			}
			view.spawn([0, 0, 0, NewView], null, [['a', 'int', 1], ['b', 'bool', true], ['c', 'str', 'a']])
		})
		test('ensure recursive view works', cb => {
			function NewView(name, specRaw, params, host, chains){
				View.apply(this, arguments)
			}
			NewView.prototype = {
				deps: {NewView: 'view'},
				create(deps, params){
					if (params.count < 3){
						this.spawn(deps.NewView, {count: params.count+1})
					}
					cb(null, true)
				}
			}
			view.spawn(['NewView', 'view', [], NewView], {count: 0})
		})
	}
})
