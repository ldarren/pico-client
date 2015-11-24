var
web=require('pico/web'),
picoObj=require('pico/obj'),
channels = {}, directory={},
addon,
create = function(keys, domains, cb){
    if (!keys.length) return cb()

    var
    k=keys.pop(),
    c=domains[k]

    web.create({
        url: c.url,
        delimiter: c.delimiter || ['&'],
        beatRate: c.beatRate || 500,
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

Backbone.ajax = function(req){
    if (!req) return
    var
    api = req.url,
    c = channel[getKey(api)],
    reqData = req.data,
    onReceive = function(err, data){
        if (err) {
            me.signal('error', [err])
            return req.error(err)
        }
        me.signal('recv', [api, data])
        return req.success(data, 'success')
    }

    if (!c) return

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
            c.submit(reqData, addon, onReceive)
        }else{
            c.request(null, reqData, addon, onReceive)
        }
    }else{
        c.request(api, reqData, addon, onReceive)
    }
    me.signal('send', [api])
}

module.exports={
    create:function(domains,cb){
        if (!domains) return cb()
        directory=picoObj.extend(directory, domains)
        create(Object.keys(domains), domains, cb)
    },
    addon:function(){ addon = arguments[0] },
    getDomain:function(url){ return directory[getKey(url)] }
}
