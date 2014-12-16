var
Net = require('pico/piDataNetModel'),
projClient, addon,
onSend = function(req){
    if (!req) return
    var
    api = req.url,
    reqData = req.data,
    onReceive = function(err, data){
        if (err) {
            me.signal('error', [err])
            return req.error(err)
        }
        me.signal('recv', [api, data])
        return req.success(data, 'success')
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
            projClient.submit(reqData, addon, onReceive)
        }else{
            projClient.request(null, reqData, addon, onReceive)
        }
    }else{
        projClient.request(req.url, reqData, addon, onReceive)
    }
    me.signal('send', [api])
}

me.slot('addon', function(){ addon = arguments[0] })

exports.create = function(url, forProj, cb){
    Net.create({
        url: url,
        delimiter: ['&'],
        beatRate: 500,
    }, function(err, client){
        if (err) return cb(err)
        if (forProj){
            projClient = client 
            Backbone.ajax = onSend
        }
        cb(null, client)
    })
}

exports.reconnect = function(url, cb){
    if (!projClient) return this.create(url, true, cb)
    projClient.reconnect({url:url}, cb)
}
