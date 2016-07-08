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
				Router.go('callout/1')
			}else{
				var span=t.querySelector('span')
				value.push(span.textContent)
			}

			this.display.textContent=value.join('')
		}
	}
}
