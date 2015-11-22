return{
	signals:['ble_startScan'],
	deps:{
        owner:'models'
	},
	create: function(deps){
        if (deps.owner.length) this.signals.ble_startScan([],30).send(this.host)
	},
	slots:{
		ble_scan:function(from,sender,peripheral){
			console.log(peripheral)
		}
	}
}
