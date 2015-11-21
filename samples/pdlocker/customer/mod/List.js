return{
	signals:['ble_startScan'],
	deps:{
	},
	create: function(deps){
	},
	slots:{
		signin:function(from,sender){
			this.signals.ble_startScan([],30).send(this.host)
		},
		ble_scan:function(from,sender,peripheral){
			console.log(peripheral)
		}
	}
}
