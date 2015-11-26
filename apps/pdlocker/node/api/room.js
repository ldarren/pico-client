var
web,
userIds=[],
pipes=[],
userPipeMap=new Map,
pingId=0,
pingCountdown=function(){
    clearTimeout(pingId)
    pingId=setTimeout(ping, 20000)
console.log('ping countdown')
},
ping=function(){
console.log('ping')
    if (!pipes.length) return pingCountdown()
    for(var i=pipes.length-1,r; r=pipes[i]; i--){
console.log(i,r.finished)
        if(r.finished) remove(i)
        else web.SSE(r, '', 'ping')
    }
    pingCountdown()
},
remove=function(idx){
    if (-1 === idx) return
    pipes.splice(idx, 1)
    var userId=userIds.splice(idx, 1)
    userPipeMap.delete(userId[0])
console.log('removed room member, new count',pipes.length)
}

module.exports= {
    setup: function(context, next){
        web=context.webServer
        pingCountdown()
        next()
    },
    add: function(res,user,next){
        if (!user || !user.id) return next()
        var userId=user.id
        if (userPipeMap.has(userId)){
            var idx=userIds.indexOf(userId)
            pipes[idx]=res
            userIds[idx]=userId
this.log('replaced room member, index',idx)
        }else{
            pipes.push(res)
            userIds.push(userId)
this.log('added room member, new count',pipes.length)
        }
        userPipeMap.set(userId,res)
        next()
    },
    remove: function(res, next){
        res.finished=true // nodejs step forward, close res but din set finished
        //remove(pipes.indexOf(res))
        next()
    },
    stream: function(evt, user, next){
        if (!user || !user.id) return next(this.error(404))
        var res=userPipeMap.get(user.id)
        if (!res) return next(this.error(404))
this.log('stream',JSON.stringify(this.getOutput()))

        web.SSE(res,JSON.stringify(this.getOutput()),evt)
        next()
    },
    broadcast: function(evt, users, next){
        if (!users || !users.length) return next(this.error(404))

        var output=JSON.stringify(this.getOutput())
        for(var i=users.length-1,u; u=users[i]; i--){
            if (userPipeMap.has(u.id)){
                web.SSE(userPipeMap.get(u.id),output,evt)
                users.splice(i,1)
            }
        }

        next()
    }
}
