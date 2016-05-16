return {
    className: 'modal',
    deps:{
		Header:'view',
		Form:'view'
	},
    signals:['show','hide','formShow','formCollect','modalResult','header'],
    create: function(deps){
		this.header=this.spawn(deps.Header)
		this.form=this.spawn(deps.Form)
		this.sender=null
    },

    slots:{
        modalShow:function(from, sender, title, form){
			this.sender=sender
            this.signals.show(1).send(this.host)
			this.signals.header(title).send(this.header)
			this.signals.formShow(form).send(this.form)
        },
        modalHide:function(from, sender){
			this.sender=null
            this.signals.hide().send(this.host)
		},
		headerButtonClicked:function(from, sender, hash){
			switch(hash){
			case 'ok':
				var self=this
				this.signals.formCollect(function(err,form){
					if(err) return console.error(err)
					self.signals.modalResult(form).send(self.sender)
				}).send(this.form)
			case 'ko':
				this.signals.hide().send(this.host)
				break	
			}
		}
    }
}
