var
user=require('api/user'),
room=require('api/room'),
sep = function(session, models, next){console.log('###'); return next()},
route=function(session,models,next){
    switch(session.req.method){
    case 'POST': return next()
    case 'GET': session.setOutput(session.time)
    default: return next(null, 'END')
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
        sigslot.slot('room.404', [web.render])
        sigslot.slot('/pdl',[route,web.parse])
        sigslot.slot('/pdl/stream',[user.verify,web.sse,room.add,user.poll,room.stream])
        sigslot.slot('web.disconnect',[room.remove])
        sigslot.slot('pdl/user/signin', [user.signin,web.render])
        sigslot.slot('pdl/user/signup', [user.signup,web.render])
        sigslot.slot('pdl/user/signout', [user.signout,web.render])
        next()
    }
}
return[
    all,
    user,
    room
]
