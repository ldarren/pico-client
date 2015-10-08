var
user=require('api/user'),
sep = function(session, order, next){console.log('###'); return next()},
help=function(session, order, next){
    console.log('this api[%s] has no route yet',this.api)
    next()
},
all= {
    setup: function(context, next){
        var
        sigslot=context.sigslot,
        web=context.webServer

        sigslot.slot('*', [help])
        sigslot.slot('err/*', [web.error])
        sigslot.slot('/pdl',[web.parse])
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
