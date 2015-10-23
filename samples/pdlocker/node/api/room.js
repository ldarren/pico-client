var
web,
userIds=[],
pipes=[],
remove=function(idx){
    if (-1 === idx) return
    pipes.splice(idx, 1)
    userIds.splice(idx, 1)
}

module.exports= {
    setup: function(context, next){
        web=context.webServer
        next()
    },
    add: function(session, models, next){
        var user=models.get('user')
        if (!user || !user.id) return next()
        remove(userIds.indexOf(user.id))
        pipes.push(session.res)
        userIds.push(user.id)
console.log('add room member, new count',pipes.length)
        next()
    },
    remove: function(session, models, next){
        remove(pipes.indexOf(session.res))
console.log('remove room member, new count',pipes.length)
        next()
    },
    stream: function(session, models, next){
        var user=models.get('user')
        if (!user || !user.id) return next(null, 'room.404')
        var res=pipes[userIds.indexOf(user.id)]
        if (!res) return next(null, 'room.404')
console.log('stream',JSON.stringify(session.getOutput()))
        web.SSE(res,JSON.stringify(session.getOutput()),'user')
        next()
    },
    broadcast: function(session, models, next){
        next(session.error(404))
    }
}
