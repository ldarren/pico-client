return {
	deps:{
		grpName:'text',
		grpParentId:'int'
	},
	credential:function(att){
		return {id:att.id, sess:att.sess, grp:this.deps.grpName, grpp:this.deps.grpParentId}
	}
}
