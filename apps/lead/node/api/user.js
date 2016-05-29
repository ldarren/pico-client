var
Floor=Math.floor,Random=Math.random,
sqlUser=require('sql/user'),
sqlRequest=require('sql/request'),
picoStr=require('pico/str'),
picoObj=require('pico/obj'),
poll=function(list,seen,output,next){
    sqlRequest.getList(list,(err,requests)=>{
        if (err) return next(this.error(500))
        output['requests']=requests
        output['seen']=Max(seen,Max(...(picoObj.pluck(requests,'uat'))))
        next()
    })
}

module.exports= {
    setup: function(context, next){
        next()
    },
    signin:function(input,user,next){
this.log('signin',input)
        var un=input.un

        if (!un) return next(this.error(401))

        sqlUser.findByUn(un, (err, briefs)=>{
            if (err) return next(this.error(500))
            if (!briefs || !briefs.length) return next(this.error(401))
            var b=briefs[0]

            sqlUser.map_get(b, (err, map)=>{
                if (err) return next(this.error(500))
                if (!map || input.pwd !== map.pwd) return next(this.error(401))

                Object.assign(user,map,b)
                this.setOutput(user, sqlUser.cleanForSelf, sqlUser)
                next()
            })
        })
    },
    signup:function(input,user,next){
this.log('signup',input)
        var un=input.un

        if (!un) return next(this.error(401))

        sqlUser.findByUn(un, (err, users)=>{
            if (err) return next(this.error(500))
            if (users.length) return next(this.error(401))
            Object.assign(user,input,{
				sess:picoStr.rand(),
				role:'consumer'
			})
            this.addJob([user, 0], sqlUser.set, sqlUser)
            this.addJob([user], sqlUser.get, sqlUser)
            this.setOutput(user, sqlUser.cleanForSelf, sqlUser)
            next()
        })
    },
	// TODO: implement agent approval process, should be applicant->agent
    join:function(input,user,next){
this.log('join',input)
        var un=input.un

        if (!un) return next(this.error(401))

        sqlUser.findByUn(un, (err, users)=>{
            if (err) return next(this.error(500))
            if (users.length) return next(this.error(401))
            Object.assign(user,input,{
				sess:picoStr.rand(),
				role:'agent'
			})
            this.addJob([user, 0], sqlUser.set, sqlUser)
            this.addJob([user], sqlUser.get, sqlUser)
            this.setOutput(user, sqlUser.cleanForSelf, sqlUser)
            next()
        })
    },
    signout:function(input,users,next){
        this.log('signout',input)
        next(session.error(404))
    },
    verify:function(input,user,next){
		if (!input.id || !input.sess) return next(this.error(403))
		sqlUser.findBySess(input.sess, (err, rows)=>{
			if (err) return next(this.error(500))
			if (!rows.length) return next(this.error(403))
			var data=rows[0]
			this.log('verify',input,data)
			// for GET method, all params in string format
			if (data.id != input.id) return next(this.error(403))
			Object.assign(user,data)
			next()
		})
    },
    read:function(input,next){
        sqlUser.get(input, (err, user)=>{
            if (err) return next(this.error(500))
            this.setOutput(user, sqlUser.clean, sqlUser)
            next()
        })
    },
	update:function(input,next){
		next()
	},
	appoint:function(input,output,next){
		sqlUser.findByRole('agent',(err,rows)=>{
			if (err) return next(this.error(500))
            if (!rows.length) return next(this.error(500, 'No Agent Available'))
			output['list']=[rows[Floor(rows.length*Random())].id]
			next()
		})
    },
    addAgent:function(request,output,next){
        sqlUser.list_set(output.list[0],'requestId',[request.id],0,(err)=>{
            if (err) return next(this.error(500,err))
            next()
        })
	},
    poll:function(input,user,output,next){
        if ('agent'!==user.role) return next()
        var t=input.t
        sqlRequest.list_findByTime(user.id,'requestId',t,(err, list)=>{
            if (err) return next(this.error(500))
            poll(picoObj.pluck(list,'requestId'),t,output,next)
        })
    }
}
