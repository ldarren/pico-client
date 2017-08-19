// TODO:
// authentication(header or cookies) with withCredentials=true
// how to get sep["&"] from pico/web?
var Callback=require('po/Callback')
var network=require('p/network')
var PJSON=require('pico/json')

function callbacks(self){
    return [
    function(e){
		self.dcCount=0
        self.callback.trigger(e.type)
    },
    function(e){
		self.dcCount++
        switch(e.target.readyState){
        case EventSource.CONNECTING: self.callback.trigger('connecting',self.dcCount); break
		case EventSource.OPEN:
			try{var d=JSON.parse(e.data)}
			catch(ex){console.error(ex)}
			self.callback.trigger('error',d);
			break
        case EventSource.CLOSED:
        default:
            self.callback.trigger('closed',self.dcCount);
            break
        }       
    },
	function(e){
        var data
        try{ data=PJSON.parse(e.data.split('["&"]'),true) }
        catch(exp){ data=e.data }
        self.callback.trigger(e.type, data, e.lastEventId)
    }
    ]
}

function init(self, env, params, events, autoconnect){
	self.env=env
	self.cred=cred
	self.params=params
    self.events=events
	self.callback=new Callback
    if (!autoconnect || !env) return
	
	var e = env.get(0).get()
	var c = cred.get(0).get()
    var cbList=callbacks(self)
    var s=new EventSource(
            encodeURI(e.path),
            (-1===e.path.lastIndexOf('?')?'?':'&') + __.querystring(Object.assign(params,c)),
            {withCredentials:e.withCredentials})

    s.addEventListener('open', cbList[0], false)   
    s.addEventListener('error', cbList[1], false)   
    for(var i=0,e; e=events[i]; i++){
        s.addEventListener(e,cbList[2],false)
    }
	self.sse=s
} 

function SSE(env, cred, params, events, autoconnect){
	this.dcCount=0
    init(this, env, cred, params, events, autoconnect)
}           

SSE.prototype={
    reconnect:function(params, events){
        var s=this.sse
        if (s) s.close()
		init(
			this,
			this.env,
			this.cred,
			params||this.params,
			events||this.events,
			true)
    },
    close:function(){
        var s=this.sse
        if (!s) return
        s.close()
    }
}

return SSE
