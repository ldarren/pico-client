var
dummyCB=function(){},
disconnectAll=function(devices){
	var keys=Object.keys(devices)
	for(var i=0,k; k=keys[i]; i++){
		ble.disconnect(k)
	}
}

return{
	signals:[ 'ble_scanned', 'ble_connected', 'ble_disconnected', 'ble_notification' ],
	deps:{
		msg_error_no_bluetooth:['text','BLE require bluetooth']
	},
    create: function(deps){
        if (!__.refChain(window, ['ble'])){
            this.slots={}
            return console.warn('cordova-plugin-ble-central is not installed')
        }

        this.devices={}

        ble.isEnabled(dummyCB, function(){
            ble.enable(dummyCB, function(){
                ble.showBluetoothSettings(dummyCB, function(){ __.alert(deps.msg_error_no_bluetooth) })
            })
        })
    },
    remove: function(){
        ble.stopScan()
        disconnectAll(this.devices)
        this.devices={}
        this.ancestor.remove.call(this)
    },
    slots: {
        ble_startScan: function(from, sender, services, sec){
            var
            self=this,
            success=function(device){
                self.signals.ble_scanned(null, device).send(sender)
            },
            failure=function(err){
                self.signals.ble_scanned(err).send(sender)
            }

            if (sec && sec > 0){
                ble.scan(services||[], sec, success, failure)
            }else{
                ble.startScan(services||[], success, failure)
            }
        },
        ble_stopScan: function(from, sender){
            ble.stopScan()
        },
        ble_connect: function(from, sender, deviceId){
            var self=this
            ble.connect(deviceId,
                function(peripheral){
                    self.devices[peripheral.id]={}
                    self.signals.ble_connected(peripheral).send(sender)
                },
                function(peripheral){
                    self.signals.ble_disconnected(peripheral).send(sender)
                    delete self.devices[peripheral.id]
                }
            )
        },
        ble_disconnect: function(from, sender, deviceId){
            var self=this
            ble.disconnect(deviceId)
        },
        ble_isConnected: function(from, sender, deviceId, cb){
            ble.isConnected(deviceId, cb, cb)
        },
        ble_read: function(from, sender, deviceId, serviceId, charId, cb){
            if (!cb) return
            ble.read(deviceId, serviceId, charId, function(buffer){
                cb(null, buffer)
            },function(error){
                cb(error)
            })
        },
        ble_write: function(from, sender, deviceId, serviceId, charId, buffer, cb){
            if (cb){
                ble.write(deviceId, serviceId, charId, buffer, cb, cb)
            }else{
                ble.writeWithoutResponse(deviceId, serviceId, charId, buffer)
            }
        },
        ble_startNotification: function(from, sender, deviceId, serviceId, charId ){
            var
            self=this,
            d=this.devices[deviceId]
            if (!d) return console.error('No connection to device:'+deviceId)
            ble.startNotification(deviceId, serviceId, charId,
			function(buffer){
                var s=d[serviceId]||[]
                if (-1 === s.indexOf(charId)){
                    s.push(charId)
                    d[serviceId]=s
                }
                self.signals.ble_notification(null, deviceId, buffer).send(sender)
            }, function(err){
                self.signals.ble_notification(err, deviceId).send(sender)
            })
        },
        ble_stopNotification: function(from, sender, deviceId, serviceId, charId){
            var
            self=this,
            d=this.devices[deviceId]
            if (!d) return
            ble.stopNotification(deviceId, serviceId, charId, function(){
                var
                s=d[serviceId]||[],
                i=s.indexOf(charId)
                if (-1 === i){
                    s.splice(i,1)
                    if (!s.length) delete d[serviceId]
                }
            })
        }
    }
}
