return{
	signals: ['modelReady'],
	create: function(deps){
	},
	slots:{
		frameAdded:function(){
			this.signal.modelReady().send()
		}
	}
}
