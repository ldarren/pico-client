return {
	signals:['header'],
	deps:{
		paneId:'int',
		title:'text'
	},
	create:function(deps){
		this.signals.header(deps.paneId,deps.title).sendNow(this.host)
	}
}
