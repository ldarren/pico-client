var
picoStr=require('pico/str'),
sqlEntity=require('sql/entity'),
createKey=function(){
	return picoStr.rand().substr(0,20)
},
createSecret=function(){
	return (picoStr.rand()+picoStr.rand()).substr(0,40)
}

return {
	setup(context,cb){
		cb()
	},
    reply(output,next){
        this.setOutput(output,sqlEntity.clean,sqlEntity)
        next()
    },
    replyPrivate(output,next){
        this.setOutput(output,sqlEntity.cleanSecret,sqlEntity)
        next()
    },
    replyList(list,next){
        this.setOutput(list,sqlEntity.cleanList,sqlEntity)
        next()
    },
	// TODO: ses email verification
	create(input,output,next){
console.log(1,input)
		if (!input.name|| !input.type) return next(this.error(400))
		Object.assign(input,{
			parentId:0,
			key:createKey(),
			secret:createSecret()
		})
console.log(2,input)
		sqlEntity.set(input, (err, entity)=>{
console.log(3,err,entity)
			if (err) return next(this.error(500))
			Object.assign(output,entity)
console.log(4,output)
			next()
		})
	},
	remove(input,next){
		next()
	},
	list(input,next){
		next()
	},
	read(input,output,next){
		next()
	},
	update(input,next){
		next()
	}
}
