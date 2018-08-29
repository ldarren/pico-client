var specMgr=require('p/specMgr')
var evts=[]
var middlewares=[]

function addMW(arr){
	for(var i=0,a; a=arr[i]; i++){
		middlewares.push(specMgr.getValue(a))
	}
}
function applyMW(mws,evt,args,cb){
	if (!mws.length) return cb(evt,args)
	var mw=mws.shift()
	var next=function(evt,args){ 
		if (!evt) return cb(evt,args)
		applyMW(mws,evt,args,cb)
	}
	if (mw instanceof Function) mw(evt,args,next)
	else if (mw.run) mw.run(evt,args,next)
	else applyMW(mws,evt,args,cb)
}
function sigslot(self, def){
    var signals = {}
    
    ;(self.signals||[]).concat(def||[]).forEach(function(evt){
        var sender = this
        signals[evt] = function(){
            return {
                args: Array.prototype.slice.call(arguments),
                sender: sender,
                evt: evt,
				mws:[],
                queue: false,
				run:run,
                send: proc,
                sendNow: procNow
            }
        }
    }, self)

    self.callback.on('*', recv, self)
        
	return signals
}
function remove(signals){
	var keys = Object.keys(signals)
	var signal
	keys.forEach(function(key){
		signal = signals[key]()
		signal.args.length = 0
		signal.mws.length = 0
		delete signals[key]
	})
}
function run(mw){
	if (mw instanceof Function)this.mws.push(mw)
	else if (mw.length) Array.prototype.push.apply(this.mws,mw)
	return this
}
function proc(a, next){
	var self=this
	applyMW(this.mws.concat(middlewares),this.evt,this.args,function(evt,args){
		if (!evt) return console.warn(self.evt,'signal aborted',args)
		self.evt=evt
		self.args=args
		;(next || send).call(self,a)
	})
}
function procNow(a){
	proc.call(this, a, dispatch)
}
function send(a, from){
	if (this.sender._removed) return
    this.queue=true
    evts.push([this, a, from||this.sender])
}      
function recv(evt, from, params){
    var func = this.slots[evt]
    var forward = true 
                
    if (func) forward = func.apply(this, [from, params.sender].concat(params.args))
	if (from===this) return // prevent trigger twice from extra 'from'
    if (forward) (params.queue?send:dispatch).call(params, [from,this], this)
}
function dispatch(a, from){
	if (this.sender._removed) return
    from=from||this.sender

    var isArr=Array.isArray(a)
    if (!isArr && a) return a.callback.trigger(this.evt, from, this)

    var host = from.host
    var modules = from.modules.concat(host ? [host,from] : [from]) //extra 'from' for mixin

    if (isArr){
        for(var i=0,m; m=modules[i]; i++) if (-1 === a.indexOf(m)) m.callback.trigger(this.evt, from, this);
    }else{
        for(var i=0,m; m=modules[i]; i++) m.callback.trigger(this.evt, from, this);
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
	remove:remove,
	addMiddleware:addMW
}
