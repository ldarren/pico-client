return {
    setup:function(context,cb){
        cb()
    },
    sep:function(msg,next){console.log(msg); return next()},
    route:function(req,next){
        switch(req.method){
        case 'POST': return next()
        case 'GET': this.setOutput(this.time)
        default: return next(null, this.sigslot.abort())
        }       
    },
    delay:function(period,next){
        setTimeout(next,period)
    },
    help:function(next){
        next(`api ${this.api} is not supported by mindsair yet`)
	}
}
