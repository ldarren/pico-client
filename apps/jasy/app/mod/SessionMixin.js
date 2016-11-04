return {
	deps:{
		group:'text'
	},
	credential:function(att){
		return {id:att.id, sess:att.sess, grp:this.deps.group}
	}
}
