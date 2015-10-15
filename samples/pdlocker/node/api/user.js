module.exports= {
    setup: function(context, next){
        var
        sigslot=context.sigslot,
        web=context.webServer

        next()
    },
    signin:function(session,models,next){
        console.log('signin',session.data)
        next()
    },
    signup:function(session,models,next){
        var data=session.data
        console.log('signup',data)
        next()
    },
    signout:function(session,models,next){
        console.log('signout',session.data)
        next()
    },
    poll:function(session,models,next){
        console.log('poll')
        next()
    }
}
