return {
	deps:{
		formSignin:'list',
		formSignout:'list'
	},
	slots:{
		signin:function(from,sender,user){
			this.slots.modalHide.call(this,from,this)
		},
		signout:function(from,sender){
			this.slots.modalShow.call(this,from,this,this.deps.formSignin)
		},
		pageCreate:function(from,sender,curr,total,page,cb){
			cb(null,page)
		},
		pageChange:function(from,sender,name,value,cb){
		},
		pageResult:function(from,sender,data,cb){
		},
		modalResult:function(from,sender,data){
		}
	}
}
