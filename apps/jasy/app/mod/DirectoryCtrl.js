return {
	signals:['header','modal_show'],
	deps:{
		paneId:'int',
		title:'text',
		btnLeft:'map',
		btnRight:'map',
		directory:'models',
		cred:'models',
		newGroupForm:'list'
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
				this.signals.modal_show([this.deps.newGroupForm]).send(this.host)
				break
			}
		},
		modal_pageCreate:function(from,sender,curr,total,form,cb){
			cb('New Group',form)
		},
		modal_result:function(from,sender,result){
			var
			$public={
				desc:result.desc
			},
			$private={
			},
			data={
				name:result.name,
				$public:$public,
				$private:$private
			}

			this.deps.directory.create(null,{
				data:data,
				wait:true,
				success:function(coll,res){
					console.log('added new group')
				},
				error:function(coll,res){
					console.log('failed to add new group',res)
				}
			})
		}
	}
}
