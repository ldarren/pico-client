var
Callback=require('po/Callback'),
network=require('p/network')

function Socket(opt){
    init(this, opt.channel, opt.path, opt.protocols, opt.auto)
}           
            
function init(self, channel, path, protocols, auto){
	self.callback=new Callback
    self.channel=channel
    self.path=path
    self.protocols=protocols
    if (!path || !auto) return

    var
	url=(-1===path.indexOf('://')?network.getDomain(channel).url+path:path).replace('http','ws'),
    s=new WebSocket(
            encodeURI(url)+'?'+__.querystring(network.getCredential()),
            protocols)

    s.addEventListener('open', function(e){
        self.callback.trigger(e.type)
    }, false)   
    s.addEventListener('error', function(e){
		self.callback.trigger(e.type, e)
    }, false)   
    s.addEventListener('close', function(e){
		self.callback.trigger(e.type, e)
    }, false)   
    s.addEventListener('message', function(e){
		var data
		try{ data=JSON.parse(e.data) }
		catch(exp){ data=e.data }
		self.callback.trigger(e.type, data)
    }, false)   
	self.ws=s
}       

Socket.prototype={
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
}

return Socket
