//TODO: should be a popup and separate project
var
pStr=require('pico/str'),
signup=function(from,sender,curr,total,data){
	if (data.pwd!==data.confirm_pwd) return __.dialogs.alert('Password not matched','Sign Up Error')
	this.slots.modal_pageResult=dummyPageResult
	var self=this
	this.deps.auth.create(null,{
		data:{
			name:data.name,
			email:data.email,
			pwd:pStr.hash(data.pwd)
		},
		success:function(model,res){
			console.log('signup succeed',res)
			self.deps.cred.reset(null,{silent:true})
			self.deps.cred.add(res)
		},
		error:function(res){
			console.log('signup failed',res)
		}
	})
},
confirmEmail=function(self){
	var arr=location.hash.split('/')
	if ('#email'===arr[0] && 'confirm'===arr[1]){
		location.hash='#'
		self.deps.auth.read({email:arr[2],verifyId:arr[3]},function(err,model,res){
			if (err) {
				__.dialogs.alert('Error in your email confirmation','Email Confirmation')
				return location.reload()
			}
			self.deps.cred.reset(null,{silent:true})
			self.deps.cred.add(res)
			__.dialogs.alert('Thanks for signing up, your email has been confirmed','Email Confirmation')
		})
		return true
	}
	return false
},
signin=function(from,sender,curr,total,data){
	this.slots.modal_pageResult=dummyPageResult
	var self=this
	this.deps.auth.fetch({
		data:{
			email:data.email,
			pwd:pStr.hash(data.pwd)
		},
		success:function(coll,res){
			self.deps.cred.reset(null,{silent:true})
			self.deps.cred.add(res)
			console.log('signup succeed',res)
		},
		error:function(model,res){
			console.log('signup failed',res)
		}
	})
},
pageCreate=function(from,sender,curr,total,page,cb){
	cb(null,page)
},
pageItemChange=function(from,sender,name,value,cb){
	var self=this
	switch(name){
	case 'signin':
		this.slots.modal_pageResult=signin
		return this.signals.modal_collectPageResult().send(sender)
	case 'signup':
		this.slots.modal_pageResult=signup
		return this.signals.modal_collectPageResult().send(sender)
	case 'gosignin':
		this.slots.modal_pageResult=dummyPageResult
		return this.signals.modal_pageChange(0,false).send(sender)
	case 'gosignup':
		this.slots.modal_pageResult=dummyPageResult
		return this.signals.modal_pageChange(1,false).send(sender)
	}
},
dummyPageResult=function(from,sender,curr,total,data,cb){ cb() }

return {
	signals:['modal_pageChange','modal_collectPageResult'],
	deps:{
		form:'list',
		auth:'models',
		cred:'models'
	},
	slots:{
		signin:function(from,sender,user){
			var s=this.slots
			if(!confirmEmail(this)){
				s.modal_hide.call(this,from,this)
				s.modal_pageItemChange=undefined
				s.modal_pageCreate=undefined
			}
		},
		signout:function(from,sender){
			var s=this.slots
			if(!confirmEmail(this)){
				s.modal_pageCreate=pageCreate
				s.modal_pageItemChange=pageItemChange
				s.modal_show.call(this,from,this,this.deps.form)
			}
		},
		modal_pageItemChange:undefined,
		modal_pageCreate:undefined,
		modal_pageResult:dummyPageResult
	}
}
