var
	script = 'exports.prop1 = \'working\'; exports.show(\'it is \'+exports.prop1); exports.show(exports.moduleName)',
	base = {
		prop1: 'not working',
		// eslint-disable-next-line
		show: console.log
	},
	func = Function('exports', 'require', script),
	obj = Object.create(base, {moduleName: {value:'testObj',    writable:false, configurable:false, enumerable:true}})

func.call(obj, obj)
