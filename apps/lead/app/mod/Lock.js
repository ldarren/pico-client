var
scratchSrv='A495FF20-C5B1-4B44-B512-1370F02D74DE',
scratch1=  'A495FF21-C5B1-4B44-B512-1370F02D74DE',
scratch2=  'A495FF22-C5B1-4B44-B512-1370F02D74DE',
scratch3=  'A495FF23-C5B1-4B44-B512-1370F02D74DE',
scratch4=  'A495FF24-C5B1-4B44-B512-1370F02D74DE',
scratch5=  'A495FF25-C5B1-4B44-B512-1370F02D74DE',
passcode=65535,
salt=456,
credential=function(){
	var
	key=Math.floor(Math.random()*0xffffffff),
	hash=passcode^key

	key+=salt
	return [hash, key]
}

return{
	signals:['ble_startScan','ble_connect','ble_write','ble_startNotification','ble_stopNotification'],
	deps:{
		ble:'ctrl'
	},
	create: function(deps){
		this.peripheral=null
		this.ble=null
		var self=this
		this.spawnAsync([deps.ble],null,null,true,function(err){
			if (err) return console.error(err)
			self.signals.ble_startScan([],30).send([self.host])
		})
	},
	slots:{
		ble_scan:function(from,sender,error,peripheral){
			console.log(error,peripheral)
            if ('AF131569'===peripheral.name || 'DA02'===peripheral.name){
                this.signals.ble_connect(peripheral.id).send(sender)
            }
		},
        ble_connected:function(from,sender,peripheral){
            console.log('connected',peripheral)
			this.peripheral=peripheral
			this.ble=sender
        },
        ble_disconnected:function(from,sender,peripheral){
            console.log('disconnected',peripheral)
			this.peripheral=null
			this.ble=null
        },
		ble_notification:function(from,sender,err,buffer){
			if (err) return console.error(err)
			var stage=new Uint32Array(buffer)
			var btn=this.el.querySelector('a')
			switch(stage[0]){
			case 1:
				btn.setAttribute('disable',1)
				btn.textContent='Unlocked'
				break
			case 2:
				btn.removeAttribute('disable')
				btn.textContent='Unlock'
				this.signals.ble_stopNotification(this.peripheral.id, scratchSrv, sratch3).send(this.ble)
				break
			}
		},
		unlock:function(from,sender){
			var
			self=this,
			p=this.peripheral
			if (!p) return
			var cred=Uint32Array(credential())
			this.signals.ble_startNotification(p.id, scratchSrv, scratch3).send(this.ble)
			this.signals.ble_write(p.id, scratchSrv, scratch1, cred.buffer.slice(0, 4), function(){
				console.log(arguments)
				self.signals.ble_write(p.id, scratchSrv, scratch2, cred.buffer.slice(4, 8), function(){
					console.log(arguments)
				}).send(self.ble)
			}).send(this.ble)
		}
	}
}
