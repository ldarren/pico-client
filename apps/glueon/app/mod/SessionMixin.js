var
specMgr=require('specMgr'),
cwd

return {
	deps:{
		app:'text',
		cwd:'text'
	},
	slots:{
		cd:function(from,sender,dir){
			specMgr.setValue(cwd,dir)
		}
	},
	credential:function(att){
		cwd=specMgr.find('cwd',this.spec,true)
		var deps=this.deps
		return {id:att.id, sess:att.sess, app:deps.app, grp:deps.group, cwd:}
	}
}
