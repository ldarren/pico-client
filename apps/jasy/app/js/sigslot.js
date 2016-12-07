var
pObj=require('pico/obj'),
trigger = Backbone.Events.trigger,
extOpt={mergeArr:1},
evts=[],
sigslot = function(self, def){
    var
    ss = pObj.extend(self.signals, def || [], extOpt),
    signals = {}
    
    ss.forEach(function(evt){
        var sender = this
        signals[evt] = function(){
            return {
                args: Array.prototype.slice.call(arguments),
                sender: sender,
                evt: evt,
                queue: false,
                send: send,
                sendNow: dispatch
            }
        }
    }, self)

    self.on('all', recv, self)
        
    return signals
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
    if (forward) (params.queue?send:dispatch).call(params, [from,this], this)
},
dispatch = function(a, from){
    from=from||this.sender

    var isArr=Array.isArray(a)
    if (!isArr && a) return trigger.call(a, this.evt, from, this)

    var
    host = from.host,
    modules = from.modules.concat(host ? [host,from] : [from])

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

return sigslot
