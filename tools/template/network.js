var
Net = require('pico/piDataNetModel'),
client,
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
            client.submit(reqData, onReceive)
        }else{
            client.request(null, reqData, onReceive)
        }
    }else{
        client.request(req.url, reqData || {}, onReceive)
    }
}

me.slot(pico.LOAD, function(){
    Net.create({
        url: 'PROJ_URL',
        delimiter: ['&'],
        beatRate: 500,
    }, function(err, netClient){
        if (err) return console.error(err)
        client = netClient
        Backbone.ajax = onSend

        client.request('pico/project/read', {name:'PROJ_ID'}, function(err, project){
            if (err) return console.error(err)
            if (!project) return console.error('empty project file')
            me.signalStep('connected', [project.json])
        })
    })
})
