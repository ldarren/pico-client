return {
    setup:function(context,cb){
        cb()
    },
    sep:function(next){console.log('###'); return next()},
    route:function(req,next){
        switch(req.method){
        case 'POST': return next()
        case 'GET': this.setOutput(this.time)
        default: return next(null, this.sigslot.abort())
        }       
    },
    help:function(next){
        next(`api ${this.api} is not supported by pdl yet`)
    }
}
