var
Rand=Math.random,Ceil=Math.ceil,
btnDown=function(e){
	e.currentTarget.classList.add('down')
},
btnUp=function(e){
	e.currentTarget.classList.remove('down')

	setTimeout(function(){window.location.href='Keypad.html'},300)
},
talk=function(callscr, profile){
	profile.classList.add('hide')
	callscr.style.backgroundImage='url(../dat/dog.jpg)'
},
connected=function(state){
	state.textContent='connected'
	setTimeout(talk,1000,document.querySelector('.callscr'),document.querySelector('.profile'))
}

window.onload=function(){
	var btn=document.querySelector('.btn')
	btn.addEventListener('mousedown',btnDown,false)
	btn.addEventListener('mouseup',btnUp,false)
	setTimeout(connected,Ceil(10000*Rand()),document.querySelector('.profile .state'))
}
