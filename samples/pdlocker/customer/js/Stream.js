//TODO: authentication for withCredentials option
var network=require('js/network')

function Stream(options){
    init(this, options.url, options.withCredentials, options.events)
}           
            
function init(self, url, withCredentials, events){
    var trigger=function(e){
        var data
        try{ data=JSON.parse(e.data) }
        catch(exp){ data=e.data }
        self.trigger(e.type, data, e.lastEventId)
    }
    self.sse=new EventSource(-1===url.indexOf('://')?network.getDomain(url)+url:url, {withCredentials:withCredentials})
    self.sse.events=events
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
    for(var i=0,e; e=events[i]; i++){
        self.sse.addEventListener(e,trigger,false)
    }       
}       

_.extend(Stream.prototype, Backbone.Events,{
    reconnect:function(url,withCredentials,events){
        var s=this.sse
        s.close()
        init(this,url||s.url,withCredentials||s.withCredentials||events||s.events)
    },
    close:function(){
        this.sse.close()
    }
})

return Stream
