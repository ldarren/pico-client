var
picoStr=require('pico/str'),
signin=function(from,sender,data){
	var self=this
	this.deps.owner.fetch(null,{
		data:{
			email:data.email,
			pwd:picoStr.hash(data.pwd)
		},
		success:function(model,res){
			console.log('signup succeed',res)
			self.deps.owner.add(model)
		},
		error:function(model,res){
			console.log('signup failed',res)
		}
	})
},
signup=function(from,sender,data){
	if (data.pwd!==data.confirm_pwd) return __.dialogs.alert('Password not matched','Sign Up Error')
	var self=this
	this.deps.cred.create(null,{
		data:{
			name:data.name,
			email:data.email,
			pwd:picoStr.hash(data.pwd)
		},
		success:function(model,res){
			console.log('signup succeed',res)
			self.deps.users.add(model)
			self.deps.owner.add(model)
		},
		error:function(res){
			console.log('signup failed',res)
		}
	})
},
dummyPageResult=function(from,sender,data,cb){ cb() }

return {
	signals:['pageChange','collectPageResult'],
	deps:{
		form:'list',
		cred:'models',
		owner:'models',
		users:'models'
	},
	slots:{
		signin:function(from,sender,user){
			var
			self=this,
			arr=window.location.hash.split('/')
			if ('#email'===arr[0] && 'confirm'===arr[1]){
				this.deps.cred.read({email:arr[2],verifyId:arr[3]},function(err,model,res){
					if (err) return __.dialogs.alert(err,'Email Confirmation Error')
					var coll=[model]
					self.deps.owner.reset(coll)
					self.deps.users.reset(coll)
				})
			}
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
