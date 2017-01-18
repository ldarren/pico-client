var
trigger = Backbone.Events.trigger,
specMgr=require('js/specMgr'),
evts=[],
middlewares=[],
addMW=function(arr){
	for(var i=0,a; a=arr[i]; i++){
		middlewares.push(specMgr.getValue(a))
	}
},
applyMW=function(idx,evt,args,cb){
	if (middlewares.length <= idx) return cb(null,evt,args)
	var
	mw=middlewares[idx++],
	next=function(err,evt,args){
		if (err) return cb(err)
		applyMW(idx,evt,args,cb)
	}
	if (mw.run) mw.run(evt,args,next)
	else if (mw instanceof Function) mw(evt,args,next)
	else applyMW(idx,evt,args,cb)

},
sigslot = function(self, def){
    var signals = {}
    
    Array.prototype.concat(self.signals||[],def||[]).forEach(function(evt){
        var sender = this
        signals[evt] = function(){
            return {
                args: Array.prototype.slice.call(arguments),
                sender: sender,
                evt: evt,
                queue: false,
                send: proc,
                sendNow: procNow
            }
        }
    }, self)

    self.on('all', recv, self)
        
    return signals
},
proc = function(a, from){
	var self=this
	applyMW(0,this.evt,this.args,function(err,evt,args){
		if (err) return console.warn(self.evt,err)
		self.evt=evt
		self.args=args
		send.call(self,a,from)
	})
},
procNow = function(a, from){
	var self=this
	applyMW(0,this.evt,this.args,function(err,evt,args){
		if (err) return console.warn(self.evt,err)
		self.evt=evt
		self.args=args
		dispatch.call(self,a,from)
	})
},
send = function(a, from){
    this.queue=true
    evts.push([this, a, from||this.sender])
},      
recv = function(evt, from, params){
    var 
    func = this.slots[evt],
    forward = true 
                
    if (func) forward = func.apply(this, [from, params.sender].concat(params.args))
	if (from===this) return // prevent trigger twice from extra 'from'
    if (forward) (params.queue?send:dispatch).call(params, [from,this], this)
},
dispatch = function(a, from){
    from=from||this.sender

    var isArr=Array.isArray(a)
    if (!isArr && a) return trigger.call(a, this.evt, from, this)

    var
    host = from.host,
    modules = from.modules.concat(host ? [host,from] : [from]) //extra 'from' for mixin

    if (isArr){
        for(var i=0,m; m=modules[i]; i++) if (-1 === a.indexOf(m)) trigger.call(m, this.evt, from, this);
    }else{
        for(var i=0,m; m=modules[i]; i++) trigger.call(m, this.evt, from, this);
    }
}

this.update= function(){
	for(var i=0,l=evts.length,e; i<l; i++){
        e=evts.shift()
        dispatch.call(e[0], e[1], e[2])
    }
}

return {
	create:sigslot,
	addMiddleware:addMW
}
