//TODO: authentication for withCredentials option
var network=require('js/network')

function Stream(options){
    init(this, options.channel, options.path, options.events, options.withCredentials)
}           
            
function init(self, channel, path, events, withCredentials){
    self.channel=channel
    self.events=events
    self.withCredentials=withCredentials
    if (!path) return

    var trigger=function(e){
        var data
        try{ data=JSON.parse(e.data) }
        catch(exp){ data=e.data }
        self.trigger(e.type, data, e.lastEventId)
    }
    self.sse=new EventSource(
            encodeURI(-1===path.indexOf('://')?network.getDomain(channel).url+path:path),
            {withCredentials:withCredentials})
    self.sse.addEventListener('open', function(e){
        self.trigger(e.type)
    }, false)   
    self.sse.addEventListener('error', function(e){
        switch(e.target.readyState){
        case EventSource.CONNECTING: self.trigger('connecting'); break
        case EventSource.CLOSED:
        default:
            self.trigger('closed');
            break
        }       
    }, false)   
    for(var i=0,e; e=events[i]; i++){
        self.sse.addEventListener(e,trigger,false)
    }       
}       

_.extend(Stream.prototype, Backbone.Events,{
    reconnect:function(channel, path, events, withCredentials){
        var s=this.sse
        if (s){
            s.close()
            init(
                this,
                channel||this.channel,
                path||s.url||this.path,
                events||this.events,
                withCredentials||s.withCredentials||this.withCredentials)
        }else{
            init(
                this,
                channel||this.chanel,
                path||this.path,
                events||this.events,
                withCredentials||this.withCredentials)
        }
    },
    close:function(){
        var s=this.sse
        if (!s) return
        s.close()
    }
})

return Stream
