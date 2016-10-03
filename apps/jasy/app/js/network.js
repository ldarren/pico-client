var
web=require('pico/web'),
picoObj=require('pico/obj'),
channels = {}, directory={},
credential,count=30,
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

Backbone.ajax = function(req){
    if (!req) return
    var
    api = req.url,
    c = channels[getKey(api)],
    reqData = req.data || {},
    onReceive = function(err, data){
        if (err) {
            Backbone.trigger('network.error', err)
            return req.error(err)
        }
        Backbone.trigger('network.recv', null, api, data)
        return req.success(data)
    }

    if (!c) return req.error(getKey(api)+' domain undefined')

    if (reqData.charAt){
        try {reqData=JSON.parse(reqData)}
        catch(e){return req.error(null, err)}
    }

    if (reqData instanceof HTMLFormElement){
        api = reqData.action
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
        c.request(api, reqData, credential, onReceive)
    }
    Backbone.trigger('network.send', null, api)
}

return{
    create:function(domains,cb){
        if (!domains) return cb()
        directory=picoObj.extend(directory, domains)
        create(Object.keys(domains), domains, cb)
    },
    credential:function(cred){ credential=cred },
    getCredential:function(){ return credential ? JSON.parse(JSON.stringify(credential)) : ''},
    getDomain:function(url){ return directory[getKey(url)] || {} }
}
