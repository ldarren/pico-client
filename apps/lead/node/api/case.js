var
sqlUser=require('sql/user'),
picoStr=require('pico/str'),
picoObj=require('pico/obj')

module.exports= {
    setup: function(context, next){
        next()
    },
	verify:function(input,output,next){
		next()
	},
	add:function(input,output,next){
		this.log('add',input)
		sqlUser.setList(input.id,'$case',[input['$case']],input.id,(err,result)=>{
			if (err) return next(this.error(500))
			output['caseId']=result.insertId
			next()
		})
	},
	read:function(input,next){
        next()
	},
	readById:function(input,output,next){
		sqlUser.getListById(input.caseId,'$case',(err,rows)=>{
			if (err) return next(this.error(500))
			output['msg']=rows[0]
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
        this.setOutput('sse case')
        next()
    }
}
