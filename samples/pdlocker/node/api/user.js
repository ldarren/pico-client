var
sqlUser=require('sql/user'),
picoStr=require('pico/str'),
picoObj=require('pico/obj')

module.exports= {
    setup: function(context, next){
        var
        sigslot=context.sigslot,
        web=context.webServer

        next()
    },
    signin:function(session,models,next){
        var
        data=session.data,
        un=data.un

        console.log('signin',session.data)

        if (!un) return next(session.error(400))

        sqlUser.findByUn(un, function(err, briefs){
            if (err) return next(session.error(500))
            if (!briefs || !briefs.length) return next(session.error(401))
            var b=briefs[0]

            sqlUser.getMap(b.id, function(err, user){
                if (err) return next(session.error(500))
session.log(JSON.stringify(user))
                if (data.pwd !== user.pwd) return next(session.error(401))

                models.set('user',picoObj.extend(user,b))
                session.setOutput(models.get('user'), sqlUser.clean, sqlUser)
                next()
            })
        })
    },
    signup:function(session,models,next){
        var
        data=session.data,
        un=data.un

        console.log('signup',data)

        if (!un) return next(session.error(400))

        sqlUser.findByUn(un, function(err, user){
            if (err) return next(session.error(500))
            //if (user) return next(session.error(403))
            models.set('user',{
                un:un,
                pwd:data.pwd,
                sess:picoStr.rand(),
                json:data.json,
                createdBy:0
            })
            session.addJob(models, ['user'], sqlUser.set, sqlUser)
            session.setOutput(models.get('user'), sqlUser.clean, sqlUser)
            next()
        })
    },
    signout:function(session,models,next){
        console.log('signout',session.data)
        next(session.error(404))
    },
    verify:function(session,models,next){
        models.set('user', session.data)
        next()
    },
    poll:function(session,models,next){
        session.setOutput('hello SSE')
        next()
    }
}
