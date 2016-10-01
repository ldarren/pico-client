return {
	deps:{
		appName:'text',
		appParentId:'int'
	},
	credential:function(att){
		return {id:att.id, sess:att.sess, app:this.deps.appName, appp:this.deps.appParentId}
	}
}
