// TODO:
// authentication(header or cookies) with withCredentials=true
// how to get sep["&"] from pico/web?
var
network=require('js/network'),
PJSON=require('pico/json'),
callbacks=function(self){
    return [
    function(e){
		self.dcCount=0
        self.trigger(e.type)
    },
    function(e){
		self.dcCount++
        switch(e.target.readyState){
        case EventSource.CONNECTING: self.trigger('connecting',self.dcCount); break
        case EventSource.CLOSED:
        default:
            self.trigger('closed',self.dcCount);
            break
        }       
    },
	function(e){
        var data
        try{ data=PJSON.parse(e.data.split('["&"]'),true) }
        catch(exp){ data=e.data }
        self.trigger(e.type, data, e.lastEventId)
    }
    ]
},
init=function(self, params, channel, path, events, withCredentials, autoconnect){
    self.channel=channel
	self.path=path
    self.events=events
	self.withCredentials=withCredentials
    if (!autoconnect || !path) return

    var
    cbList=callbacks(self),
    s=new EventSource(
            encodeURI(-1===path.indexOf('//')?network.getDomain(channel).url+path:path)+
            (-1===path.lastIndexOf('?')?'?':'&')+
            __.querystring(Object.assign(params,network.getCredential())),
            {withCredentials:withCredentials})

    s.addEventListener('open', cbList[0], false)   
    s.addEventListener('error', cbList[1], false)   
    for(var i=0,e; e=events[i]; i++){
        s.addEventListener(e,cbList[2],false)
    }
	self.sse=s
} 

function Stream(opt){
	this.dcCount=0
    init(this, opt.params, opt.channel, opt.path, opt.events, opt.autoconnect, opt.withCredentials)
}           

_.extend(Stream.prototype, Backbone.Events,{
	events:[],
    reconnect:function(params, channel, path, events, withCredentials){
        var s=this.sse
        if (s) s.close()
		init(
			this,
			params,
			channel||this.channel,
			path||this.path,
			events||this.events,
			withCredentials||this.withCredentials,
			true)
    },
    close:function(){
        var s=this.sse
        if (!s) return
        s.close()
    }
})

return Stream
