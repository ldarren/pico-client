var
sqlUser=require('sql/user'),
picoStr=require('pico/str'),
picoObj=require('pico/obj')

module.exports= {
    setup: function(context, next){
        next()
    },
    signin:function(input,user,next){
        var un=input.un

this.log('signin',input)

        if (!un) return next(this.error(400))

        sqlUser.findByUn(un, (err, briefs)=>{
            if (err) return next(this.error(500))
            if (!briefs || !briefs.length) return next(this.error(401))
            var b=briefs[0]

            sqlUser.getMap(b.id, (err, map)=>{
                if (err) return next(this.error(500))
this.log(JSON.stringify(map))
                if (input.pwd !== map.pwd) return next(this.error(401))

                Object.assign(user,map,b)
                this.setOutput(user, sqlUser.clean, sqlUser)
                next()
            })
        })
    },
    signup:function(input,user,next){
        var un=input.un

this.log('signup',input)

        if (!un) return next(this.error(400))

        sqlUser.findByUn(un, (err, users)=>{
            if (err) return next(this.error(500))
            if (users.length) return next(this.error(403))
            var user={
                un:un,
                pwd:input.pwd,
                sess:picoStr.rand(),
                json:input.json,
                createdBy:0
            }
            this.addJob([user], sqlUser.set, sqlUser)
            this.setOutput(user, sqlUser.clean, sqlUser)
            next()
        })
    },
    signout:function(input,users,next){
        this.log('signout',input)
        next(session.error(404))
    },
    verify:function(input,user,next){
        Object.assign(user,input)
        this.log('verify',input)
        next()
    },
    read:function(input,next){
console.log('read',input)
        sqlUser.get(input.id, (err, user)=>{
            if (err) return next(this.error(500))
            this.setOutput(user, sqlUser.clean, sqlUser)
            next()
        })
    },
    poll:function(input,next){
        this.setOutput('hello SSE')
        next()
    }
}
