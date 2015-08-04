//TODO: authentication for withCredentials option
var network=require('network')

exports.Class=function(options){
    init(this, network.createEvents(options.url, options.withCredentials), options.events)
}

function init(self, sse, events){
    self.sse=sse
    sse.addEventListener('open', function(e){
        self.trigger(e.type)
    }, false)
    sse.addEventListener('error', function(e){
        switch(e.target.readyState){
        case EventSource.CLOSED: self.trigger('closed'); break
        case EventSource.CONNECTING: self.trigger('connecting'); break
        default: self.trigger('error'); vreak
        }
    }, false)
    var trigger=function(e){
        var data
        try{ data=JSON.parse(e.data) }
        catch(exp){ data=e.data }
        self.trigger(e.type, data, e.lastEventId)
    }
    for(var i=0,e; e=events[i]; i++){
        sse.addEventListener(e,trigger,false)
    }
}

_.extend(exports.Class.prototype, Backbone.Events,{
    close:function(){
        this.sse.close()
    }
})
