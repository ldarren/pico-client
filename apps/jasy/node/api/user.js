var
sqlUser

return {
	setup:function(context,cb){
		sqlUser=context.mainDB
		cb()
	},
	signup:function(input,next){
	},
	signin:function(input,next){
	},
	update:function(input,next){
	},
	remove:function(input,next){
	},
	verify:function(input,next){
	}
}
