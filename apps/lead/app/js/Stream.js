//TODO: authentication(header or cookies) with withCredentials=true
var
network=require('js/network'),
callbacks=function(self){
    return [
    function(e){
        self.trigger(e.type)
    },
    function(e){
        switch(e.target.readyState){
        case EventSource.CONNECTING: self.trigger('connecting'); break
        case EventSource.CLOSED:
        default:
            self.trigger('closed');
            break
        }       
    },
	function(e){
        var data
        try{ data=JSON.parse(e.data) }
        catch(exp){ data=e.data }
        self.trigger(e.type, data, e.lastEventId)
    }
    ]
}

function Stream(options){
    init(this, options.channel, options.path, options.events, options.withCredentials)
}           
            
function init(self, channel, path, events, withCredentials){
    self.channel=channel
    self.events=events
    if (!path) return

    var
    cbList=callbacks(self),
    s=new EventSource(
            encodeURI(-1===path.indexOf('//')?network.getDomain(channel).url+path:path)+
            (-1===path.lastIndexOf('?')?'?':'&')+
            __.querystring(network.getAddon()),
            {withCredentials:withCredentials})

    s.addEventListener('open', cbList[0], false)   
    s.addEventListener('error', cbList[1], false)   
    for(var i=0,e; e=events[i]; i++){
        s.addEventListener(e,cbList[2],false)
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
