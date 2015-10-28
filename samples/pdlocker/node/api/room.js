var
web,
userIds=[],
pipes=[],
pingId=0,
pingCountdown=function(){
    clearTimeout(pingId)
    pingId=setTimeout(ping, 20000)
},
ping=function(){
    if (!pipes.length) return
    for(var i=0,r; r=pipes[i]; i++){
        web.SSE(r, '', 'ping')
    }
    pingCountdown()
},
remove=function(idx){
    if (-1 === idx) return
    pipes.splice(idx, 1)
    userIds.splice(idx, 1)
}

module.exports= {
    setup: function(context, next){
        web=context.webServer
        pingCountdown()
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

        pingCountdown()

        web.SSE(res,JSON.stringify(session.getOutput()),'user')
        next()
    },
    broadcast: function(session, models, next){
        pingCountdown()
        next(session.error(404))
    }
}
