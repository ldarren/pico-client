var
Net = require('pico/piDataNetModel'),
channels = [], addon,
create = function(list, cb){
    if (!list.length) return cb()

    var c = list.pop()

    Net.create({
        url: c.url,
        delimiter: c.delimiter || ['&'],
        beatRate: c.beatRate || 500,
    }, function(err, client){
        if (err) return cb(err)
        channels.push(client)
        create(list, cb)
    })
}

Backbone.ajax = function(req){
    if (!req) return
    var
    api = req.url,
    c = channels[req.channel||0],
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

me.slot('addon', function(){ addon = arguments[0] })

exports.create = function(list, cb){
    if (!list) return cb()
    create(list, cb)
}
