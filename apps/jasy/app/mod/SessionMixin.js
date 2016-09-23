return {
	deps:{
		appName:'text'
	},
	credential:function(att){
		return {id:att.id, app:this.deps.appName, sess:att.sess}
	}
}
