//TODO: authentication(header or cookies) with withCredentials=true
var network=require('js/network')

function Stream(options){
    init(this, options.channel, options.path, options.events, options.withCredentials)
}           
            
function init(self, channel, path, events, withCredentials){
    self.channel=channel
    self.events=events
    if (!path) return

    var
	trigger=function(e){
		debugger
        var data
        try{ data=JSON.parse(e.data) }
        catch(exp){ data=e.data }
        self.trigger(e.type, data, e.lastEventId)
    },
    s=new EventSource(
            encodeURI(-1===path.indexOf('://')?network.getDomain(channel).url+path:path)+'?'+__.querystring(network.getAddon()),
            {withCredentials:withCredentials})

    s.addEventListener('open', function(e){
        self.trigger(e.type)
    }, false)   
    s.addEventListener('error', function(e){
        switch(e.target.readyState){
        case EventSource.CONNECTING: self.trigger('connecting'); break
        case EventSource.CLOSED:
        default:
            self.trigger('closed');
            break
        }       
    }, false)   
    for(var i=0,e; e=events[i]; i++){
        s.addEventListener(e,trigger,false)
    }
	self.sse=s
}       

_.extend(Stream.prototype, Backbone.Events,{
    reconnect:function(channel, path, events, withCredentials){
        var s=this.sse
        if (s){
            s.close()
            init(
                this,
                channel||this.channel,
                path||s.url,
                events||this.events,
                withCredentials||s.withCredentials)
        }else{
            init(
                this,
                channel||this.channel,
                path,
                events||this.events,
                withCredentials)
        }
    },
    close:function(){
        var s=this.sse
        if (!s) return
        s.close()
    }
})

return Stream
