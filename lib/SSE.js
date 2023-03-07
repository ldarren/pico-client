// TODO:
// authentication(header or cookies) with withCredentials=true
// how to get sep["&"] from pico/web?
var Callback=require('po/Callback')
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
				try{
					var d=JSON.parse(e.data)
				} catch(ex){
					console.error(ex)
				}
				self.callback.trigger('error',d)
				break
			case EventSource.CLOSED:
			default:
				self.callback.trigger('closed',self.dcCount)
				break
			}
		},
		function(e){
			var data
			try{
				data=PJSON.parse(e.data.split('["&"]'),true)
			} catch(exp){
				data=e.data
			}
			self.callback.trigger(e.type, data, e.lastEventId)
		}
	]
}

function init(self, cfg, env, params, events, autoconnect){
	self.cfg=cfg
	self.env=env
	self.params=params
	self.events=events
	self.callback=new Callback
	if (!autoconnect || !cfg) return

	var c = cfg
	var e = env
	var cbList=callbacks(self)
	var s=new EventSource(
		encodeURI(e.domain + c.path) + (-1===c.path.lastIndexOf('?')?'?':'&') + __.querystring(Object.assign(
			{key: e.cred},
			params
		)),
		{withCredentials:c.withCredentials})

	s.addEventListener('open', cbList[0], false)
	s.addEventListener('error', cbList[1], false)
	for(var i=0,evt; (evt=events[i]); i++){
		s.addEventListener(evt, cbList[2],false)
	}
	self.sse=s
}

function SSE(cfg, env, params, events, autoconnect){
	this.dcCount=0
	init(this, cfg, env, params, events, autoconnect)
}

SSE.prototype={
	reconnect:function(params, events){
		var s=this.sse
		if (s) s.close()
		init(
			this,
			this.cfg,
			this.env,
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
