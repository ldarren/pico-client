var
Net = require('pico/piDataNetModel'),
projClient, addon,
onSend = function(req){
    if (!req) return
    var
    reqData = req.data,
    onReceive = function(err, data){
        if (err) {
            me.signal('error', [err])
            return req.error(err)
        }
        return req.success(data, 'success')
    }
    if (reqData instanceof HTMLFormElement){
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
}

me.slot(pico.LOAD, function(){
    Net.create({
        url: 'http://107.20.154.29:4888',
        delimiter: ['&'],
        beatRate: 500,
    }, function(err, client){
        if (err) return console.error(err)

        client.request('pico/project/read', {name:'tracker'}, function(err, project){
            if (err) return console.error(err)
            if (!project) return console.error('empty project file')
            me.signalStep('connected', [project.json, client])
        })
    })
})

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
