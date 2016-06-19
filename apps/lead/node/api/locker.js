var
Floor=Math.floor,Random=Math.random,Max=Math.max,
sqlLocker=require('sql/locker'),
picoObj=require('pico/obj')

module.exports= {
    setup: function(context, next){
        next()
    },
	verify:function(input,output,next){
        Object.assign(output,{id:input.lockerId})
		next()
	},
    setOutput:function(output,next){
		this.setOutput(output,sqlLocker.clean,sqlLocker)
        next()
    },
    setOutputList:function(list,next){
		this.setOutput(list,sqlLocker.cleanList,sqlLocker)
        next()
    },
	add:function(input,output,next){
		if (!input.name) return next(this.error(400))
		sqlLocker.findByName(input.id, input.name, (err, rows)=>{
			if (err) return next(this.error(500,err))
			if (rows.length) return next(this.error(400,'name not available'))

			Object.assign(output,input,{
				userId:input.id,
				passcode:65535,//Floor(0xffffffff*Random()),
				salt:456//Floor(0xffff*Random()))
			})
			sqlLocker.set(output,input.id,(err)=>{
				if (err) return next(this.error(500))
				next()
			})
		})
	},
	read:function(input,next){
        next()
	},
	readById:function(input,output,next){
		sqlLocker.get(input,(err,lock)=>{
			if (err) return next(this.error(500))
			Object.assign(output,lock)
			next()
		})
	},
	update:function(input,next){
        next()
	},
	remove:function(input,next){
        next()
	},
	list:function(input,list,next){
		sqlLocker.gets(input.set,(err,locks)=>{
			if (err) return next(this.error(500))
            list.push(...locks)
			next()
		})
	},
    poll:function(input,user,output,next){
        var t=input.t
        sqlLocker.poll(user.id,t,(err, briefs)=>{
            if (err) return next(this.error(500))
            sqlLocker.map_gets(briefs, (err, lockers)=>{
                if (err) return next(this.error(500))
                if (lockers.length){
                    var lastSeen=Max(...(picoObj.pluck(lockers,'uat')))
                    output['seen']=Max(lastSeen,output['seen']||t) 
                    output['lockers']=lockers
                }
                next()
            })
        })
    },
	unlock:function(input,output,next){
		sqlLocker.map_get(input,(err,map)=>{
			if (err) return next(this.error(500))
			if (!map || !map.passcode || !map.salt) return next(this.error(400))

			var key=Floor(Random()*0xffffffff)
			output.cred=[map.passcode^key, key+map.salt]
			next()
		})
	}
}
