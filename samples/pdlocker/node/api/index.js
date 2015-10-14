var
user=require('api/user'),
sep = function(session, models, next){console.log('###'); return next()},
route=function(session,models,next){
    switch(session.req.method){
    case 'POST': return next()
    case 'GET':
        var time=models.get('time')
        time.now=session.time
        var err=session.addJob(models, [session.subJob('time','now')])
    default: return next(err, 'END')
    }       
},
help=function(session, models, next){
    console.log('this api[%s] has no route yet',this.api)
    next()
},
all= {
    setup: function(context, next){
        var
        sigslot=context.sigslot,
        web=context.webServer

        sigslot.slot('*', [help])
        sigslot.slot('ERR/*', [web.error])
        sigslot.slot('END', [web.render])
        sigslot.slot('/pdl',[route,web.parse])
        sigslot.slot('pdl/user/signin', [user.signin,web.render])
        sigslot.slot('pdl/user/signup', [user.signup,web.render])
        sigslot.slot('pdl/user/signout', [user.signout,web.render])
        sigslot.slot('pdl/data/poll', [user.poll,web.render])

        next()
    }
}
return[
    all,
    user
]
