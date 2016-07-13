var Router=require('js/Router')

return {
	signals:['header'],
	deps:{
		contacts:'models'
	},
	create:function(deps){
		var el=this.el
		el.innerHTML=deps.html
		this.display=el.querySelector('.display')
		this.value=[]
		this.signals.header().send(this.host)
	},
	events:{
		'touchend .btn':function(e){
			var
			t=e.target.closest('.btn'),
			value=this.value,
			cl=t.classList

			cl.remove('down')

			if (cl.contains('plus')){
				if ('+'===value[0]) value.shift()
				else value.unshift('+')
			}else if (cl.contains('del')){
				value.pop()
			}else if (cl.contains('call')){
				var
				tel='+'===this.display[0] ? this.value.slice(1).join('') : this.value.join(''),
				contacts=this.deps.contacts,
				contact=contacts.findWhere({tel:tel})
				if (contact) return Router.go('callout/'+contact.id)
				contact=contacts.get(tel.charAt(0))
				contact=contact?contact.attributes:contacts.get(1).attributes
				__.dialogs.confirm('Do you want to call '+contact.name+'('+contact.tel+') instead?',tel+' Not Found',null,function(btn){
					if (1===btn) Router.go('callout/'+contact.id)
				})
			}else{
				var span=t.querySelector('span')
				value.push(span.textContent)
			}

			this.display.textContent=value.join('')
		}
	}
}
