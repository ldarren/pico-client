var network=require('js/network')

function Socket(options){
    init(this, options.channel, options.path, options.protocols)
}           
            
function init(self, channel, path, protocols){
    self.channel=channel
    if (!path) return

    var
	url=(-1===path.indexOf('://')?network.getDomain(channel).url+path:path).replace('http','ws'),
    s=new WebSocket(
            encodeURI(url)+'?'+__.querystring(network.getAddon()),
            protocols)

    s.addEventListener('open', function(e){
        self.trigger(e.type)
    }, false)   
    s.addEventListener('error', function(e){
		self.trigger(e.type, e)
    }, false)   
    s.addEventListener('close', function(e){
		self.trigger(e.type, e)
    }, false)   
    s.addEventListener('message', function(e){
		var data
		try{ data=JSON.parse(e.data) }
		catch(exp){ data=e.data }
		self.trigger(e.type, data)
    }, false)   
	self.ws=s
}       

_.extend(Socket.prototype, Backbone.Events,{
    reconnect:function(channel, path, protocols){
        var s=this.ws
        if (s){
            s.close()
            init(
                this,
                channel||this.channel,
                path||s.url,
                protocols||s.protocol)
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
        var s=this.ws
        if (!s) return
        s.close()
    }
})

return Socket
