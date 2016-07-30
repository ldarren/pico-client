return {
	deps:{
		chats:'models'
	},
	sendMsg:function(msg){
		var chats=this.deps.chats
		chats.add({id:chats.length,msg:msg})
	}
}
