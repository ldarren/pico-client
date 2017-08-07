return {
    signals:['paneAdd','pageAdd','moduleAdded'],
    deps:{
        html:   ['file',''],
        paneId: 'int'
    },
    create: function(deps, params){
        var self=this
		this.super.create.call(this, deps, params, function(){
			self.signals.paneAdd(deps.paneId).send()
		})
    },

    slots: {
        paneUpdate: function(from, sender, paneId, name, pageSpec, params){
            if (this.deps.paneId !== paneId) return

			var pageParams = JSON.stringify(params)
			if (name === this.pageName && this.pageParams===pageParams) return
            this.pageName=name
            this.pageParams=pageParams

            this.signals.pageAdd(name, pageSpec, params).send([this.host])
        },
		moduleAdded:function(from, sender){
			if (-1===this.modules.indexOf(from)) return // not child
			this.signals.moduleAdded(this.deps.paneId).send(this.host) // repropagate with paneId
		}
    }
}
