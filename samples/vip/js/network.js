var
Net = require('pico/piDataNetModel'),
client,
onReceive = function(err, res){
},
onSend = function(req){
},
onLoad = function(){
    client = Net.create({
        url: 'http://107.20.154.29:4888/channel',
    });
    Backbone.ajax = bbAjax;
};

me.slot(pico.LOAD, onLoad);
