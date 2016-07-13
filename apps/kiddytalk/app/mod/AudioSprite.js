var useOgg

this.load=function(){
	useOgg = (function(){
		var snd = new Audio()
		return ('function'===typeof snd.canPlayType && snd.canPlayType('audio/mp4') === '')
	})()
}

return {
	deps:{
		url:'text',
		list:'map'
	},
	create:function(deps){
		var self=this
		this.ctx=new (window.AudioContext || window.webkitAudioContext)
		__.ajax('get',deps.url+(useOgg?'.ogg':'.mp4'),null,{responseType:'arraybuffer'},function(err, state, res){
			if (4>state) return
			if (err) return console.error(err)
			self.ctx.decodeAudioData(res,function(buf){
				self.buf=buf
			})
		})
	},
	remove:function(){
	},
	slots:{
		WebAudio_start:function(from,sender,name,loop,period){
			if (!this.buf) return console.warn('Audio buffer not ready yet')
			var opt=this.deps.list[name]
			if (!opt) return console.warn('Audio '+name+' not found')
			var
			ctx=this.ctx,
			source=ctx.createBufferSource()
			source.connect(ctx.destination)
			source.buffer=this.buf

			if (loop){
				if (this.loopSource) this.loopSource.stop()
				this.loopSource=source
				source.loop=true
				source.loopStart=opt[0]
				source.loopEnd=opt[0]+opt[1]
				source.start(ctx.currentTime, opt[0])
			}else{
				source.start(ctx.currentTime, opt[0], opt[1])
			}
			if (period) source.stop(ctx.currentTime+period)
		},
		WebAudio_stop:function(from,sender){
			if (this.loopSource) this.loopSource.stop()
		}
	}
}
