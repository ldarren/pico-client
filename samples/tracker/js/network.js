var
Net = require('pico/piDataNetModel'),
client,
connected = false,
onSend = function(req){
    if (!req) return;
    var
    reqData = req.data || {},
    onReceive = function(err, data){
        if (err) return req.error(err);
        return req.success(data, 'success');
    }
    if (reqData instanceof HTMLFormElement){
        if (req.hasFile){
            client.submit(reqData, onReceive);
        }else{
            client.request(null, reqData, onReceive);
        }
    }else{
        client.request(req.url, reqData || {}, onReceive);
    }
},
onLoad = function(){
    Net.create({
        url: 'http://107.20.154.29:4888/channel',
        delimiter: ['&'],
        beatRate: 500,
    }, function(err, netClient){
        if (err) return console.error(err);
        client = netClient;
        Backbone.ajax = onSend;
        connected = true;
        me.signal('connected');
    })
};

me.slot(pico.LOAD, onLoad);

// HACK: should use pico.step
me.onConnected = function(cb){
    if (connected) return cb();
    me.slot('connected', cb);
};
