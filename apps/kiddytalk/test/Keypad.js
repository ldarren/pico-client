var
value=[],
display,
audioCtx,
audioBuf,
loadAudio=function(url,cb){
	var req=new XMLHttpRequest()
	req.open('GET','dog.wav')
	req.responseType='arraybuffer',
	req.onload=function(){
		audioCtx.decodeAudioData(req.response,function(buf){
			cb(null, buf)
		})
	}
	req.send()
},
btnDown=function(e){
	e.currentTarget.classList.add('down')

	var source=audioCtx.createBufferSource()
	source.connect(audioCtx.destination)
	source.buffer=audioBuf
	source.start(audioCtx.currentTime)
	//source.stop(audioCtx.currentTime+3)
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
	audioCtx=new (window.AudioContext || window.webkitAudioContext)
	loadAudio('dog.wav',function(err, buf){
		if (err) return console.error(err)
		audioBuf=buf
	})
}
