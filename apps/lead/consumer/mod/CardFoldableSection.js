var specMgr=require('js/specMgr')

return {
	tagName:'section',
	deps:{
		tpl:'file',
		card:'map'
	},
	create:function(deps){
		this.el.innerHTML=deps.tpl(deps.card)
		this.spawnAsync(specMgr.findAllByType('view',this.spec))
	}
}
