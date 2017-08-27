var pObj=require('pico/obj')
var Collection=require('po/Collection')
var specMgr=require('p/specMgr')
var pHttp=require('p/pHTTP')
var SSE=require('p/SSE')

return function(name, type, rawSpec, klass, cb){
	specMgr.load(null, null, rawSpec, function(err, spec){
		if (err) return cb(err)

		switch(type){
		case 'models':
			var C = klass ? Collection.extend(klass) : Collection
			return cb(null, new C(
				specMgr.find('data',spec), 
				specMgr.find('routes',spec), 
				name,
				specMgr.find('network',spec)
			))
			break
		case 'phttp':
			var C = klass ? pHTTP.extend(klass) : pHTTP
			return cb(null, new C(
				specMgr.find('env',spec),
				specMgr.find('cred',spec)
			))
			break
		case 'sse':
			var C = klass ? SSE.extend(klass) : SSE
			return cb(null, new C(
				specMgr.find('env',spec),
				specMgr.find('cred',spec),
				specMgr.find('params',spec),
				specMgr.find('events',spec),
				specMgr.find('autoconnect',spec)
			))
			break
		}
	})
}