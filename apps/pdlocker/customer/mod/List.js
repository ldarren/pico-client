var
scratchSrv='A495FF20-C5B1-4B44-B512-1370F02D74DE',
scratch1='A495FF21-C5B1-4B44-B512-1370F02D74DE',
scratch2='A495FF22-C5B1-4B44-B512-1370F02D74DE',
scratch3='A495FF23-C5B1-4B44-B512-1370F02D74DE',
scratch4='A495FF24-C5B1-4B44-B512-1370F02D74DE',
scratch5='A495FF25-C5B1-4B44-B512-1370F02D74DE',
tpl='<button class="btn btn-positive btn-block">Unlock</button><button class="btn btn-negative btn-block">Lock</button>'

return{
    className:'content-padded',
	signals:['ble_startScan','ble_connect','ble_write'],
	deps:{
        owner:'models'
	},
	create: function(deps){
        if (!deps.owner.length) return
        this.signals.ble_startScan([],30).send(this.host)
        this.el.innerHTML=tpl
		this.peripheral=null
		this.ble=null
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
        }
	},
	events:{
		'tap .btn-positive':function(e){
			if (!this.peripheral) return
			var data = new Uint8Array(1);
			data[0] = 0;
			this.signals.ble_write(this.peripheral.id, scratchSrv, scratch1, data.buffer, function(){
				debugger
				console.log(arguments)
			}).send(this.ble)
		},
		'tap .btn-negative':function(e){
			if (!this.peripheral) return
			var data = new Uint8Array(1);
			data[0] = 1;
			this.signals.ble_write(this.peripheral.id, scratchSrv, scratch1, data.buffer, function(){
				debugger
				console.log(arguments)
			}).send(this.ble)
		}
	}
}
