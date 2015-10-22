var
userIds=[],
pipes=[]

module.exports= {
    setup: function(context, next){
        next()
    },
    add: function(session, models, next){
        var user=models.get('user')
        if (!user || !user.id) return next()
        pipes.push(session.res)
        userIds.push(user.id)
        next()
    },
    remove: function(session, models, next){
        var idx=pipes.indexOf(session.res)
        if (-1 === idx) return next()
        pipes.splice(idx, 1)
        userIds.splice(idx, 1)
        next()
    },
    stream: function(session, models, next){
        var user=models.get('user')
        if (!user || !user.id) return next(null, 'room.404')
        var res=pipes[userIds.indexOf(user.id)]
        if (!res) return next(null, 'room.404')
console.log('stream',JSON.stringify(session.getOutput()))
        res.write(JSON.stringify(session.getOutput()))
        next()
    },
    broadcast: function(session, models, next){
        next(session.error(404))
    }
}
