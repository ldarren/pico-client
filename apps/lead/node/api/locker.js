var
Floor=Math.floor,Random=Math.random,
sqlLocker=require('sql/locker'),
picoObj=require('pico/obj')

module.exports= {
    setup: function(context, next){
        next()
    },
	verify:function(input,output,next){
		next()
	},
	add:function(input,output,next){
this.log('add lock',input)
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
			this.setOutput(output,sqlLocker.clean,sqlLocker)
			next()
		})
	},
	update:function(input,next){
        next()
	},
	remove:function(input,next){
        next()
	},
	list:function(input,next){
        next()
	},
    poll:function(input,next){
        this.setOutput('sse lock')
        next()
    },
	unlock:function(lock,output,next){
		sqlLocker.getMap(lock,(err,map)=>{
			if (err) return next(this.error(500))
			if (!map || !map.passcode || !map.salt) return next(this.error(400))

			var key=Floor(Random()*0xffffffff)
			
			output.cred=[map.passcode^key, key+map.salt[

			this.setOutput(output, sqlLocker.clean, sqlLocker)
			next()
		})
	}
}
