return {
	signals:['header','modal_show'],
	deps:{
		paneId:'int',
		title:'text',
		btnLeft:'map',
		btnRight:'map',
		cred:'models',
		chats:'models',
		newChatForm:'list'
	},
	create:function(deps){
		if(deps.title)this.signals.header(deps.paneId,deps.title,deps.btnLeft,deps.btnRight).send(this.host)
	},
	slots:{
		headerButtonClicked:function(from,sender,hash){
			var o=this.deps.cred.at(0)
			if (!o || !o.id) return __.dialogs.alert('You need to confirm your email first','Not signin')
			switch(hash){
			case 'plus':
				this.signals.modal_show([this.deps.newChatForm]).send(this.host)
				break
			}
		},
		modal_pageCreate:function(from,sender,curr,total,form,cb){
			cb('New Entity',form)
		},
		modal_pageResult:function(from,sender,curr,total,data,cb){
			cb()
		},
		modal_result:function(from,sender,result){
			this.deps.chats.create(null,{
				data:result,
				wait:true,
				success:function(coll,res){
					console.log('added new chat')
				},
				error:function(coll,res){
					console.log('failed to add new chat',res)
				}
			})
		}
	}
}
