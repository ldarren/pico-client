var
Net = require('pico/piDataNetModel'),
projClient,
onSend = function(req){
    if (!req) return
    var
    reqData = req.data || {},
    onReceive = function(err, data){
        if (err) return req.error(err)
        return req.success(data, 'success')
    }
    if (reqData instanceof HTMLFormElement){
        if (req.hasFile){
            projClient.submit(reqData, onReceive)
        }else{
            projClient.request(null, reqData, onReceive)
        }
    }else{
        projClient.request(req.url, reqData || {}, onReceive)
    }
}

me.slot(pico.LOAD, function(){
    Net.create({
        url: 'PROJ_URL',
        delimiter: ['&'],
        beatRate: 500,
    }, function(err, client){
        if (err) return console.error(err)

        client.request('pico/project/read', {name:'PROJ_ID'}, function(err, project){
            if (err) return console.error(err)
            if (!project) return console.error('empty project file')
            me.signalStep('connected', [project.json, client])
        })
    })
})

me.create = function(url, forProj, cb){
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

me.reconnect = function(url, cb){
    if (!projClient) return this.create(url, true, cb)
    projClient.reconnect(url, cb)
}
