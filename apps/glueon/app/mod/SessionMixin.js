return {
	deps:{
		app:'text',
		group:'text'
	},
	credential:function(att){
		var deps=this.deps
		return {id:att.id, sess:att.sess, app:deps.app, grp:deps.group}
	}
}
