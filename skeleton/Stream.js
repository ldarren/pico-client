//TODO: authentication for withCredentials option
var network=require('network')

exports.Class=function(options){
    init(this, options.url, options.withCredentials, options.events)
}           
            
function init(self, url, withCredentials, events){
    self.sse=network.createEvents(url, withCredentials)
    self.sse.addEventListener('open', function(e){
        self.trigger(e.type)
    }, false)   
    self.sse.addEventListener('error', function(e){
        switch(e.target.readyState){
        case EventSource.CONNECTING: self.trigger('connecting'); break
        case EventSource.CLOSED:
        default:
            self.trigger('closed');
            setTimeout(init, 5000, self, url, withCredentials, events)
            break
        }       
    }, false)   
    var trigger=function(e){
        var data
        try{ data=JSON.parse(e.data) }
        catch(exp){ data=e.data }
        self.trigger(e.type, data, e.lastEventId)
    }
    for(var i=0,e; e=events[i]; i++){
        self.sse.addEventListener(e,trigger,false)
    }       
}       

_.extend(exports.Class.prototype, Backbone.Events,{
    close:function(){
        this.sse.close()
    }
})
