var pObj=require('pico/obj')
var Collection=require('po/Collection')
var specMgr=require('p/specMgr')

return function(name, rawSpec, klass, cb){
	specMgr.load(null, null, rawSpec, function(err, spec){
		if (err) return cb(err)
		var C = klass ? Collection.extend(klass) : Collection
		return cb(null, new C(specMgr.find('data',spec), specMgr.find('routes',spec),name))
	})
}
