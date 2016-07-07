return {
	signals:['header'],
	deps:{
		title:'text'
	},
	create:function(deps){
		this.signals.header(deps.title).sendNow(this.host)
	}
}
