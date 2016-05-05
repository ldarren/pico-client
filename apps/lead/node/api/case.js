var
sqlUser=require('sql/user'),
picoStr=require('pico/str'),
picoObj=require('pico/obj')

module.exports= {
    setup: function(context, next){
        next()
    },
	add:function(input,next){
		console.log('add',input)
		sqlUser.setList(input.id,'$case',[input.$case],(err)=>{
			if (err) return next(this.error(500))
			next()
		})
	},
	read:function(input,next){
        next()
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
        this.setOutput('hello SSE')
        next()
    }
}
