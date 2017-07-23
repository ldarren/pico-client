var el
return {
	start:function(num, cb){
		el=document.createElement('p')
		el.textContent='Page'+num
		document.body.appendChild(el)
		function click(){
			el.removeEventListener('click',click)
			cb()
		}
		el.addEventListener('click', click)
	},
	stop:function(){
		el.parentElement.removeChild(el)
	}
}
