return {
    setup:function(context,cb){
        cb()
    },
    sep:function(next){console.log('###'); return next()},
    route:function(req,input,next){
        switch(req.method){
        case 'POST': return next()
        case 'GET':
            if (input.id) return next(null, 'sirocco/greets/read')
            this.setOutput(this.time)
        default: return next(null, this.sigslot.abort())
        }       
    },
    help:function(next){
        next(`api ${this.api} is not supported by sirocco yet`)
    }
}
