var specMgr=require('js/specMgr')

return {
	tagName:'section',
	deps:{
		tpl:'file',
		data:'map'
	},
	create:function(deps){
		this.el.innerHTML=deps.tpl(deps.data)
		this.spawnAsync(specMgr.findAllByType('view',this.spec))
	}
}
