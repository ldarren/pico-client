var
Net = require('pico/piDataNetModel'),
channels, addon,
create = function(list, cb){
    if (!list.length) return cb()

    var
    c = list.pop(),
    config = c.config

    Net.create({
        url: config.url,
        delimiter: config.delimiter || ['&'],
        beatRate: config.beatRate || 500,
    }, function(err, client){
        if (err) return cb(err)
        channels[c.name] = client
        create(list, cb)
    })
}

Backbone.ajax = function(req){
    if (!req) return
    var
    c = channels[req.channel],
    reqData = req.data,
    onReceive = function(err, data){
        if (err) {
            me.signal('error', [err])
            return req.error(err)
        }
        return req.success(data, 'success')
    }

    if (!c) return

    if (reqData instanceof HTMLFormElement){
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
        c.request(req.url, reqData, addon, onReceive)
    }
}

me.slot(pico.LOAD, function(){
    pico.ajax('get', 'project.json', null, null, function(err, xhr){
        if (err) return console.error(err)
        if (4 !== xhr.readyState) return
        try{
            var project = JSON.parse(xhr.responseText)
        }catch(exp){
            return console.error(exp)
        }
        me.signalStep('projectLoaded', [project])
    })
})

me.slot('addon', function(){ addon = arguments[0] })

exports.create = function(list, cb){
    if (!list) return cb()
    create(list, cb)
}
