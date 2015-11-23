var tpl='<button class="btn btn-positive btn-block">Unlock</button><button class="btn btn-negative btn-block">Lock</button>'
return{
    className:'content-padded',
	signals:['ble_startScan'],
	deps:{
        owner:'models'
	},
	create: function(deps){
        if (!deps.owner.length) return
        this.signals.ble_startScan([],30).send(this.host)
        this.el.innerHTML=tpl
	},
	slots:{
		ble_scan:function(from,sender,peripheral){
			console.log(peripheral)
            if ('AF131569'===peripheral.name){
                this.signals.ble_connect(peripheral.id).send(sender)
            }
		},
        ble_connected:function(from,sender,peripheral){
            console.log
        }
	}
}
