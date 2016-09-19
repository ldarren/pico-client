var
picoStr=require('pico/str'),
signin=function(from,sender,data){
	this.deps.cred.read(null,{
		data:{
			email:data.email,
			pwd:picoStr.hash(data.pwd)
		},
		success:function(){
			console.log('signup suceed')
		},
		error:function(){
			console.log('signup failed')
		}
	})
},
signup=function(from,sender,data){
	if (data.pwd!==data.confirm_pwd) return __.dialogs.alert('Password not matched','Sign Up Error')
	this.deps.cred.create(null,{
		data:{
			name:data.name,
			email:data.email,
			pwd:picoStr.hash(data.pwd)
		},
		success:function(){
			console.log('signup suceed')
		},
		error:function(){
			console.log('signup failed')
		}
	})
},
dummyPageResult=function(from,sender,data,cb){ cb() }

return {
	signals:['pageChange','collectPageResult'],
	deps:{
		form:'list',
		cred:'models'
	},
	slots:{
		signin:function(from,sender,user){
			this.slots.modalHide.call(this,from,this)
		},
		signout:function(from,sender){
			this.slots.modalShow.call(this,from,this,this.deps.form)
		},
		pageCreate:function(from,sender,curr,total,page,cb){
			cb(null,page)
		},
		pageItemChange:function(from,sender,name,value,cb){
			var self=this
			switch(name){
			case 'signin':
				this.slots.pageResult=signin
				return this.signals.collectPageResult().send(sender)
			case 'signup':
				this.slots.pageResult=signup
				return this.signals.collectPageResult().send(sender)
			case 'gosignin':
				this.slots.pageResult=dummyPageResult
				return this.signals.pageChange(0,false).send(sender)
			case 'gosignup':
				this.slots.pageResult=dummyPageResult
				return this.signals.pageChange(1,false).send(sender)
			}
		},
		pageResult:dummyPageResult,
		modalResult:function(from,sender,data){
		}
	}
}
