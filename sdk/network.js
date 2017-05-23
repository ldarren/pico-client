var
web=require('pico/web'),
pObj=require('pico/obj'),
Callback=require('po/Callback'),
Collection=require('po/Collection'),
channels = {}, directory={},
credential,count=30,
callback=null,
create = function(keys, domains, cb){
    if (!keys.length) return cb()

    var
    k=keys.pop(),
    c=domains[k]

    web.create({
        url: c.url,
        delimiter: c.delimiter || ['&']
    }, function(err, client){
        if (err) return cb(err)
        channels[k]=client
        create(keys, domains, cb)
    })
},
getKey=function(p){ 
    var i=p.indexOf('/')
    return -1===i ? p : p.substr(0, i)
}

this.update=function(){
	if (count--) return
	count=30
	for(var i=0,keys=Object.keys(channels),c; c=channels[keys[i]]; i++){
		c.beat()
	}
}

this.load=function(){
	Collection.ajax = function(method,route,params,cb){
		if (!route) return cb(null, params)
		var
		c = channels[getKey(route)],
		reqData = params || {},
		onReceive = function(err, data){
			if (err) {
				callback.trigger('network.error', err)
				return cb(err)
			}
			callback.trigger('network.recv', null, route, data)
			return cb(null,data)
		}

		if (!c) return cb(getKey(route)+' domain undefined')

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
				c.submit(reqData, credential, onReceive)
			}else{
				c.request(null, reqData, credential, onReceive)
			}
		}else{
			c.request(route, reqData, credential, onReceive)
		}
		callback.trigger('network.send', null, route)
	}
}

return{
	callback:null,
    create:function(domains,cb){
        if (!domains) return cb()
		this.callback=callback=new Callback
        directory=pObj.extend(directory, domains)
        create(Object.keys(domains), domains, cb)
    },
    credential:function(cred){ credential=cred },
	updateCredential:function(key,value){credential=credential||{},credential[key]=value},
    getCredential:function(){ return credential ? JSON.parse(JSON.stringify(credential)) : ''}, // caniuse Object.assign now?
    getDomain:function(url){ return directory[getKey(url)] || {} }
}
