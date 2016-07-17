var
DEFAULT_PERIOD=300000,
useOgg,
looping=0,
loadAudio=function(ctx, idx, input, output, cb){
	if (idx >= input.length) return cb()
	var
	snd=input.at(idx++),
	url=snd.get('path')
	__.ajax('get',url+(useOgg?'.ogg':'.m4a'),null,{responseType:'arraybuffer'},function(err, state, res){
		if (4>state) return
		if (err) return cb(err)
		ctx.decodeAudioData(res,function(buf){
			output[snd.get('name')]=buf
			loadAudio(ctx, idx, input, output, cb)
		})
	})
},
playAudio=function(self,name){
	var buf=self.map[name]
	if (!buf) return console.warn('Audio '+name+' not found')

	var
	ctx=self.ctx,
	source=ctx.createBufferSource()

	source.connect(ctx.destination)
	source.buffer=buf
	source.onended=function(){
		if (looping > Date.now()) playAudio(self,name)
	}
	source.start(ctx.currentTime)
}

this.load=function(){
	useOgg = (function(){
		var snd = new Audio()
		return ('function'===typeof snd.canPlayType && snd.canPlayType('audio/mp4') === '')
	})()
}

return {
	deps:{
		sounds:'models'
	},
	create:function(deps){
		this.ctx=new (window.AudioContext || window.webkitAudioContext)
		this.map={}
		loadAudio(this.ctx, 0, deps.sounds, this.map, function(err){
			if (err) return console.error(err)
		})
	},
	slots:{
		WebAudio_start:function(from,sender,name,loop,period){
			if (loop) looping=Date.now()+period||DEFAULT_PERIOD
			playAudio(this,name)
		},
		WebAudio_stop:function(from,sender){
			looping=0
		}
	}
}
