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
		this.senders={}
		this.locks={}
		this.names={}
		this.ble= this.spawn(deps.ble)
	},
	slots:{
		ble_scanned:function(from,sender,error,peripheral){
			console.log('Lock.ble_scanned',error,peripheral)
			var
			name=peripheral.name,
			senders=this.senders,
			locks=this.locks,
			names=this.names,
			keys=Object.keys(this.senders)

			for(var i=0,l; l=keys[i]; i++){
				if (name===l){
					locks[name]=peripheral
					names[peripheral.id]=name
					this.signals.lockStatus(peripheral.id,'found').send(senders[l])
					this.signals.ble_connect(peripheral.id).send(sender)
				}
			}
		},
        ble_connected:function(from,sender,peripheral){
            console.log('Lock.ble_connected',peripheral)
			var lockOwner=this.senders[this.names[peripherals.id]]
			this.signals.lockStatus(peripheral.id,'connected').send(lockOwner)
        },
        ble_disconnected:function(from,sender,peripheral){
            console.log('Lock.ble_disconnected',peripheral)
			var lockOwner=this.senders[this.names[peripherals.id]]
			this.signals.lockStatus(peripheral.id,'disconnected').send(lockOwner)
        },
		ble_notification:function(from,sender,err,peripheral,buffer){
			if (err) return console.error(err)
			var
			stage=new Uint32Array(buffer),
			lockOwner=this.senders[this.names[peripherals.id]]

			switch(stage[0]){
			case 1:
				this.signals.lockStatus(peripheral.id,'unlocked').send(lockOwner)
				break
			case 2:
				this.signals.lockStatus(peripheral.id,'locked').send(lockOwner)
				this.signals.ble_stopNotification(peripheral.id, scratchSrv, sratch3).send(this.ble)
				break
			}
		},
		// name='AF131569' or name='DA02'
		scan:function(from,sender,name){
			this.locks[name]=sender
			this.signals.ble_startScan([],30).send(this.ble)
		},
		unlock:function(from,sender,name){
			var
			self=this,
			p=this.locks[name]
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
