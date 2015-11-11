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
    add: function(res,user,next){
        if (!user || !user.id) return next()
        remove(userIds.indexOf(user.id))
        pipes.push(res)
        userIds.push(user.id)
this.log('add room member, new count',pipes.length)
        next()
    },
    remove: function(res, next){
        remove(pipes.indexOf(res))
this.log('remove room member, new count',pipes.length)
        next()
    },
    stream: function(res, user, next){
        if (!user || !user.id) return next(null, 'room.404')
        var res=pipes[userIds.indexOf(user.id)]
        if (!res) return next(null, 'room.404')
this.log('stream',JSON.stringify(this.getOutput()))

        pingCountdown()

        web.SSE(res,JSON.stringify(this.getOutput()),'user')
        next()
    },
    broadcast: function(session, models, next){
        pingCountdown()
        next(think.error(404))
    }
}
