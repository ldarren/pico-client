var specMgr=require('p/specMgr')
var Min = Math.min
var map = {}

return {
	define: function(type, path, args, cb){
		require(path, (err, C) => {
			if (err) return cb(err)
			map[type] = [C, args]
			cb()
		})
	},
	run: function(name, type, params, rawSpec, klass, cb){
		var _arguments = arguments
		specMgr.load(null, params, rawSpec, function(err, spec){
			if (err) return cb(err)

			var cargs = map[type]
			if (!cargs) return cb(null, spec)

			var C = klass ? cargs[0].extend(klass) : cargs[0]
			var args = cargs[1].map(a => {
				return a.charAt ? specMgr.find(a, spec)	: _arguments[Min(a, 2)]
			})

			var inst = Object.create(C.prototype)
			C.apply(inst, args)
			cb(null, inst)
		})
	}
}
