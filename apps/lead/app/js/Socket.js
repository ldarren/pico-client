var network=require('js/network')

function Socket(opt){
    init(this, opt.channel, opt.path, opt.protocols, opt.auto)
}           
            
function init(self, channel, path, protocols, auto){
    self.channel=channel
    self.path=path
    self.protocols=protocols
    if (!path || !auto) return

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
                path||s.url||this.path,
                protocols||s.protocol||this.protocols,
				true)
        }else{
            init(
                this,
                channel||this.chanel,
                path||this.path,
                protocols||this.protocol,
				true)
        }
    },
	readyState:function(){
		return this.ws ? this.ws.readyState : 0
	},
	send:function(buff){
		if (1 !== this.readyState()) return false
		this.ws.send(buff)
		return true
	},
    close:function(code, reason){
        var s=this.ws
        if (!s) return
        s.close(code, reason)
    }
})

return Socket
