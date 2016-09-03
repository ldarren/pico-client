return {
    setup:function(context,cb){ cb() },  
    route:function(req,next){
        switch(req.method){
        case 'POST': return next()
        case 'GET': this.setOutput(this.time)
        default: return next(null, this.sigslot.abort())
        } 
    },  
    sep:function(msg,next){console.log(msg); return next()},
    logParams:function(next){this.log(this.params); return next()},
    delay:function(period,next){ setTimeout(next,period) },  
    help:function(next){ next(`api ${this.api} is not supported yet`) }       
}
