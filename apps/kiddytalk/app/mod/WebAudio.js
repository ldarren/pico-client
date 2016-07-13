var
useOgg,
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
			var buf=this.map[name]
			if (!buf) return console.warn('Audio '+name+' not found')
			var
			ctx=this.ctx,
			source=ctx.createBufferSource()

			source.connect(ctx.destination)
			source.buffer=buf

			if (loop){
				if (this.loopSource) this.loopSource.stop()
				this.loopSource=source
				source.loop=true
				source.start(ctx.currentTime)
			}else{
				source.start(ctx.currentTime)
			}
			if (period) source.stop(ctx.currentTime+period)
		},
		WebAudio_stop:function(from,sender){
			if (this.loopSource) this.loopSource.stop()
		}
	}
}
