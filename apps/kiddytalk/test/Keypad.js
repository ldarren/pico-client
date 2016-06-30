var
value=[],
display,
btnDown=function(e){
	e.currentTarget.classList.add('down')
},
btnUp=function(e){
	var
	t=e.currentTarget,
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

	display.textContent=value.join('')
}

window.onload=function(){
	var btns=document.querySelectorAll('.btn')
	display=document.querySelector('.display')
	for(var i=0,b; b=btns[i]; i++){
		b.addEventListener('mousedown',btnDown,false)
		b.addEventListener('mouseup',btnUp,false)
	}
}
