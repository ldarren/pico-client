var evts=[]

this.update= function(){
	for(var i=0, l=evts.length, e; i < l; i++){
		e=evts.shift()
		dispatch.call(e[0], e[1], e[2])
	}
}

function recv(evt, from, params){
	var func = this.slots[evt]
	var forward = true

	if (func) forward = func.apply(this, [from, params.sender].concat(params.args))
	if (from===this) return // prevent trigger twice from extra 'from'
	if (forward) (params.queue?send:dispatch).call(params, [from,this], this)
}

function send(a, from){
	if (this.sender._removed) return
	evts.push([this, a, from||this.sender])
}

function dispatch(a, from){
	if (this.sender._removed) return
	from=from||this.sender

	var isArr=Array.isArray(a)
	if (!isArr && a) return a.callback.trigger(this.evt, from, this)

	var host = from.host
	var modules = from.modules.concat(host ? [host,from] : [from]) //extra 'from' for mixin

	var i, m
	if (isArr){
		for(i=0; (m=modules[i]); i++) if (-1 === a.indexOf(m)) m.callback.trigger(this.evt, from, this)
	}else{
		for(i=0; (m=modules[i]); i++) m.callback.trigger(this.evt, from, this)
	}
}

var Run = {
	get(target, propKey, receiver){
		switch(propKey){
		default: return
		case 'send':
			return function(a){
				send.call(Object.assign(target, {queue: true}), a)
			}
		case 'sendNow':
			return function(a){
				dispatch.call(target, a)
			}
		}
	}
}

var Signal = {
	get(target, propKey, receiver){
		if (!target.signals.includes(propKey)) return
		return function(){
			return new Proxy({
				sender: target,
				evt: propKey,
				args: Array.prototype.slice.call(arguments),
			}, Run)
		}
	}
}

return {
	create(self, def){
		var sigslot = Proxy.revocable(self, Signal)
		self._sigslot = sigslot
		self.signal = sigslot.proxy
		self.callback.on('*', recv, self)
	},
	remove(self){
		self.callback.off('*', recv)
		var ss = self._sigslot
		if (!ss) return
		self._sigslot = self.signal = void 0
		ss.revoke()
	}
}
