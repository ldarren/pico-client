var
sqlUser=require('sql/user'),
picoStr=require('pico/str')

module.exports= {
    setup: function(context, next){
        var
        sigslot=context.sigslot,
        web=context.webServer

        next()
    },
    signin:function(session,models,next){
        console.log('signin',session.data)
        next(session.error(401))
    },
    signup:function(session,models,next){
        var
        data=session.data,
        un=data.un

        console.log('signup',data)

        if (!un) return next(session.error(400))
        sqlUser.findByUn(un, function(err, user){
            if (err) return next(session.error(500))
            //if (user) return next(session.error(401))
            models.set('user',{
                un:un,
                pwd:data.pwd,
                sess:picoStr.rand(),
                json:data.json,
                createdBy:0
            })
            session.addJob(models, ['user'], sqlUser.set, sqlUser)
            session.setOutput('user', models)
            next()
        })
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
