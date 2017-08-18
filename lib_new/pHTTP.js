var web=require('pico/web')
var pObj=require('pico/obj')
var Callback=require('po/Callback')
var instances = []
var count=30

this.update=function(){
	if (count--) return
	count=30
	for(var i=0, c; c=instances[i]; i++){
		c.client.beat()
	}
}

function pHTTP(env, cred){
	this.env = env
	this.cred = cred
	this.callback = new Callback
	this.reload()
	instances.push(this)
}

pHTTP.prototype = {
	reload: function(){
		this.client = web.create(this.env.get(0).get(), function(err, client){
			err && console.error(err)
		})
	},
	ajax: function(method,route,params,cb){
		if (!route) return cb(null, params)
		var c = this.client

		if (!c) return cb('client undefined')

		var cred = this.cred.get(0).get()
		var reqData = params || {}
		var onReceive = function(err, data){
			if (err) {
				callback.trigger('network.error', err)
				return cb(err)
			}
			callback.trigger('network.recv', null, route, data)
			return cb(null,data)
		}

		if (reqData.charAt){
			try {reqData=JSON.parse(reqData)}
			catch(e){return cb(err)}
		}

		if (reqData instanceof HTMLFormElement){
			route = reqData.action
			var hasFile = req.hasFile 
			for(var i=0,es=reqData.elements,e; e=es[i]; i++){
				if (e.hasAttribute('type') && 'FILE' === e.getAttribute('type').toUpperCase()){
					hasFile = true
					break
				}
			}
			if (hasFile){
				c.submit(reqData, cred, onReceive)
			}else{
				c.request(null, reqData, cred, onReceive)
			}
		}else{
			c.request(route, reqData, cred, onReceive)
		}
		callback.trigger('network.send', null, route)
	}
}

return pHTTP
