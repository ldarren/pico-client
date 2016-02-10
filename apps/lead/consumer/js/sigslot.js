var
picoObj=require('pico/obj'),
trigger = Backbone.Events.trigger,
evts=[],
schedule= (function(){
    if ('undefined'!==typeof process) return process.nextTick
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     ||
            function(cb){ return window.setTimeout(cb, 50) }
})(),   
sigslot = function(self, def){
    var
    ss = picoObj.extend(self.signals, def || [], {mergeArr:1}),
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
                dispatch: dispatch
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
    if (forward) (params.queue?send:dispatch).call(params, [from], this)
},
tick = function(){
    schedule(tick)
    if (evts.length){
        var e=evts.shift()
        dispatch.call(e[0], e[1], e[2])
    }
},
dispatch = function(a, from){
    var isObj='object'===typeof a
    if (isObj && !a.length) return trigger.call(a, this.evt, from, this)

    from=from||this.sender

    var
    host = from.host,
    modules = from.modules

    modules = host ? modules.concat([host]) : modules

    if (isObj && a.length){
        for(var i=0,m; m=modules[i]; i++) if (-1 === a.indexOf(m)) trigger.call(m, this.evt, from, this);
    }else{
        for(var i=0,m; m=modules[i]; i++) trigger.call(m, this.evt, from, this);
    }
}

schedule(tick)

return sigslot
