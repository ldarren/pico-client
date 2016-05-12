var
redisCache=require('redis/cache'),
web,
userIds=[],
pipes=[],
userPipeMap=new Map,
pingId=0,
pingCountdown=function(){
    clearTimeout(pingId)
    pingId=setTimeout(ping, 20000)
},
ping=function(){
    if (!pipes.length) return pingCountdown()
    for(var i=pipes.length-1,r; r=pipes[i]; i--){
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
        var uid=user.id
        if (userPipeMap.has(uid)){
            var idx=userIds.indexOf(uid)
            pipes[idx]=res
            userIds[idx]=uid
this.log('replaced room member, index',idx)
        }else{
            pipes.push(res)
            userIds.push(uid)
this.log('added room member, new count',pipes.length)
        }
        userPipeMap.set(uid,res)
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
        if (!res || res.finished) return next() //TODO: better handling
this.log('stream',JSON.stringify(this.getOutput()))

        web.SSE(res,JSON.stringify(this.getOutput()),evt)
        next()
    },
	publish: function(evt,input,next){
		if (!input || !input.list || !input.list.length || !input.msg) return next()
		redisCache.publish(evt,JSON.stringify(input))
		next()
	},
    broadcast: function(evt, input, next){
		var users=input.list
        if (!users || !users.length) return next(this.error(400))

        var output=JSON.stringify(input.msg)

        for(var i=users.length-1,uid,res; uid=users[i]; i--){
            if (userPipeMap.has(uid)){
                res=userPipeMap.get(uid)
                if (!res || res.finished) continue
                web.SSE(res,output,evt)
            }
        }

        next()
    }
}
