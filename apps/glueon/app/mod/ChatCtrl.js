var
getChat=function(chats,dirId,cb){
	var chat=chats.findWhere({dirId:dirId})
	if (chat) return cb(null, chat)
	chats.read({dirId:dirId},cb)
},
addChatLog=function(model){
	if (this.currChat.id !== model.id) return
	var deps=this.deps
	deps.msg.add(deps.chatLog.where({id:chat.id}))
}

return {
	signals:['header'],
	deps:{
		paneId:'int',
		title:'text',
		btnLeft:'map',
		btnRight:'map',
		folder:'model',
		chats:'models',
		chatLog:'models',
		msg:'models'
	},
	create:function(deps){
		if(deps.title)this.signals.header(
			deps.paneId,
			deps.title,
			0===deps.paneId?{icon:'icon_back'}:deps.btnLeft,
			deps.btnRight
		).send(this.host)
	
		var self=this
		getChat(deps.chats,deps.folder.id,function(err,chat){
			self.currChat=chat
			deps.msg.add(deps.chatLog.where({id:chat.id}))
		})
		this.listenTo(deps.chatLog,'add',addChatLog)

	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			switch(hash){
			case 'edit':
				break
			}
		}
	}
}
