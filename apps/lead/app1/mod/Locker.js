var
scratchSrv='A495FF20-C5B1-4B44-B512-1370F02D74DE',
scratch1=  'A495FF21-C5B1-4B44-B512-1370F02D74DE',
scratch2=  'A495FF22-C5B1-4B44-B512-1370F02D74DE',
scratch3=  'A495FF23-C5B1-4B44-B512-1370F02D74DE',
scratch4=  'A495FF24-C5B1-4B44-B512-1370F02D74DE',
scratch5=  'A495FF25-C5B1-4B44-B512-1370F02D74DE'

return{
	signals:['lockStatus','ble_startScan','ble_connect','ble_write','ble_startNotification','ble_stopNotification'],
	deps:{
		lock:'models',
		ble:'ctrl'
	},
	create: function(deps){
		this.senders={}
		this.lockers={}
		this.names={}
		this.ble= this.spawn(deps.ble)
	},
	slots:{
		ble_scanned:function(from,sender,error,peripheral){
			console.log('Lock.ble_scanned',error,peripheral)
			var
			name=peripheral.name,
			senders=this.senders,
			lockers=this.lockers,
			names=this.names,
			keys=Object.keys(this.senders)

			for(var i=0,l; l=keys[i]; i++){
				if (name===l){
					lockers[name]=peripheral
					names[peripheral.id]=name
					this.signals.lockStatus(name,'found').send(senders[l])
					this.signals.ble_connect(peripheral.id).send(sender)
					return
				}
			}
			this.signals.lockStatus(name,'disconnected').send(senders[l])
		},
        ble_connected:function(from,sender,peripheral){
            console.log('Lock.ble_connected',peripheral)
			var lockOwner=this.senders[this.names[peripheral.id]]
			this.signals.lockStatus(peripheral.name,'connected').send(lockOwner)
        },
        ble_disconnected:function(from,sender,peripheral){
            console.log('Lock.ble_disconnected',peripheral)
			var lockOwner=this.senders[this.names[peripheral.id]]
			this.signals.lockStatus(peripheral.name,'disconnected').send(lockOwner)
        },
		ble_notification:function(from,sender,err,peripheralId,buffer){
			if (err) return console.error(err)
			var
			stage=new Uint32Array(buffer),
			name=this.names[peripheralId],
			lockOwner=this.senders[name]

			switch(stage[0]){
			case 1:
				this.signals.lockStatus(name,'unlocked').send(lockOwner)
				break
			case 2:
				this.signals.lockStatus(name,'locked').send(lockOwner)
				this.signals.ble_stopNotification(peripheralId, scratchSrv, sratch3).send(this.ble)
				break
			}
		},
		// name='AF131569' or name='DA02'
		scan:function(from,sender,name){
			this.senders[name]=sender
			this.signals.ble_startScan([],30).send(this.ble)
		},
		unlock:function(from,sender,name,cred){
			var p=this.lockers[name]

			if (!p) return console.error('Locker unlock without lock')

			var
            self=this,
            buf=(new Uint32Array(cred)).buffer

            this.signals.ble_startNotification(p.id, scratchSrv, scratch3).send(this.ble)
            this.signals.ble_write(p.id, scratchSrv, scratch1, buf.slice(0, 4), function(){
                self.signals.ble_write(p.id, scratchSrv, scratch2, buf.slice(4, 8), function(){
                }).send(self.ble)
            }).send(this.ble)
		}
	}
}
