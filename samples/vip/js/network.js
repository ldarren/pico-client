var
Net = require('pico/piDataNetModel'),
client,
onSend = function(req){
    client.request(req.url, req.data || {}, function(err, data){
        if (err) return req.error(err);
        return req.success(data, 'success');
    })
},
onLoad = function(){
    Net.create({
        url: 'http://107.20.154.29:4888/channel',
    }, function(err, netClient){
        if (err) return console.error(err);
        client = netClient;
        Backbone.ajax = onSend;
    });
};

me.slot(pico.LOAD, onLoad);
