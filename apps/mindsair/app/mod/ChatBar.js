return {
	deps:{
		chats:'models'
	},
	sendMsg:function(msg, cb){
		var chats=this.deps.chats
		chats.create(null,{
			data:{
				msg:msg
			},
			wait:true,
			success:function(){
				cb()
			},
			error:function(coll, err, opt){
				cb(err)
			}
		})
	}
}
