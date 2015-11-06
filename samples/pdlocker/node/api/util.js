return {
    setup:function(context,cb){
        cb()
    },
    sep:function(session, models, next){console.log('###'); return next()},
    route:function(session,models,next){
        switch(session.req.method){
        case 'POST': return next()
        case 'GET': session.setOutput(session.time)
        default: return next(null, this.sigslot.abort())
        }       
    },
    help:function(session, models, next){
        next(`api ${this.api} is not supported by pdl yet`)
    }
}
