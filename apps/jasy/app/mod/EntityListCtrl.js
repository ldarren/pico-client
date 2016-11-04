return {
	signals:['header','modal_show'],
	deps:{
		paneId:'int',
		title:'text',
		btnLeft:'map',
		btnRight:'map',
		entities:'models',
		cred:'models',
		newEntityForm:'list',
		extraForm:'map'
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
				this.extraData=this.extraForm=null
				this.signals.modal_show([this.deps.newEntityForm,[]]).send(this.host)
				break
			}
		},
		modal_pageCreate:function(from,sender,curr,total,form,cb){
			if (1==curr) return cb('New Entity',this.extraForm)
			cb('New Entity',form)
		},
		modal_pageResult:function(from,sender,curr,total,data,cb){
			switch(curr){
			case 0:
				this.extraForm=this.deps.extraForm[data.type]
				break
			case 1:
				this.extraData=data
			}
			cb()
		},
		modal_result:function(from,sender,result){
			this.deps.entities.create(null,{
				data:{
					name:result.name,
					type:result.type,
					userId:this.deps.cred.at(0).id,
					$public:{desc:result.desc},
					$private:this.extraData
				},
				wait:true,
				success:function(coll,res){
					console.log('added new entity')
				},
				error:function(coll,res){
					console.log('failed to add new entity',res)
				}
			})
		}
	}
}
