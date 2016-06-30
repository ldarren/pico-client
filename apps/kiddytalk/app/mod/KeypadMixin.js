return {
	setup:function(){
		this.display=this.el.querySelector('.display')
		this.value=[]
	},
	btnUp:function(e){
		var
		t=e.currentTarget,
		value=this.value,
		cl=t.classList

		cl.remove('down')

		if (cl.contains('plus')){
			if ('+'===value[0]) value.shift()
			else value.unshift('+')
		}else if (cl.contains('del')){
			value.pop()
		}else if (cl.contains('call')){
			window.location.href='Call.html'
		}else{
			var span=t.querySelector('span')
			value.push(span.textContent)
		}

		this.display.textContent=value.join('')
	}
}
