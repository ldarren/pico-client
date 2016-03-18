var
addListeners = function(self, lm){
    var d = new lm.Delegate

    d.didChangeAuthorizationStatus = function(res){
        console.debug('didChangeAuthorizationStatus: '+ JSON.stringify(res.authorizationStatus))
        // TODO: reinitialize
        switch(res.authorizationStatus){
        case 'AuthorizationStatusAuthorized':
        case 'AuthorizationStatusAuthorizedWhenInUse':
            clear(self, lm)
            setup(self, lm)
            break
        }
        self.signals.iBeacon_changeAuthorizationStatus(res.authorizationStatus).send()
    }
    d.didStartMonitoringForRegion = function(res){
        console.debug('didStartMonitoringForRegion: '+ JSON.stringify(res))
        var r = res.region
        self.signals.iBeacon_startMonitoringForRegion(r.identifier,r.uuid,r.major,r.minor).send()
    }
    d.didDetermineStateForRegion = function(res){
        console.debug('didDetermineStateForRegion: '+ JSON.stringify(res))
        var
        r = res.region,
        uuid=r.uuid,
        major=r.major,
        minor=r.minor
        switch(res.state){
        case 'CLRegionStateInside':
            var r1 = getRegion(self.deps.regions,uuid,major,minor)
            if (!r1 || (r1 && r1.range)) startScan.call(lm, getRegion(self.regions,uuid,major,minor))
            break
        case 'CLRegionStateOutside':
            stopScan.call(lm, getRegion(self.regions,uuid,major,minor))
            break
        }
        self.signals.iBeacon_determineStateForRegion(r.identifier,uuid,major,minor,res.state).send()
    }
    d.didEnterRegion = function(res){
        console.debug('didEnterRegion: '+ JSON.stringify(res))
        var r = res.region
        self.signals.iBeacon_enterRegion(r.identifier,r.uuid,r.major,r.minor).send()
    }
    d.didExitRegion = function(res){
        console.debug('didExitRegion: '+ JSON.stringify(res))
        var r = res.region
        self.signals.iBeacon_exitRegion(r.identifier,r.uuid,r.major,r.minor).send()
    }
    d.didRangeBeaconsInRegion = function(res){
        console.debug('didRangeBeaconsInRegion: '+ JSON.stringify(res))
        var
        r = res.region,
        bs = res.beacons
        if (!bs.length) return
		// bug: https://github.com/petermetz/cordova-plugin-ibeacon/issues/159
		for(var i=0,b; b=bs[i]; i++){
			b.uuid=b.uuid.toUpperCase()
			b.major=parseInt(b.major)
			b.minor=parseInt(b.minor)
		}
        self.signals.iBeacon_rangeBeaconsInRegion(r.identifier,r.uuid,r.major,r.minor,bs).send()
    }
    // Event when advertising starts
    d.peripheralManagerDidStartAdvertising = function(res){
        console.debug('peripheralManagerDidStartAdvertising: '+ JSON.stringify(res))
        self.signals.iBeacon_startAdvertising(res.error,res.state).send()
    }
    // Event when bluetooth transmission state changes
    d.peripheralManagerDidUpdateState = function(res){
        console.debug('peripheralManagerDidUpdateState: '+ JSON.stringify(res.state))
        self.signals.iBeacon_updateState(res.state).send()
    }
    lm.setDelegate(d)
},
setup = function(self, lm){

    lm.isRangingAvailable()
    .then(function(ok){
        var
        rs = self.deps.regions,
        r,b
        for(var key in rs){
            r = rs[key]
            b = newRegion.call(self, r.id, r.uuid, r.major, r.minor)
        }
        return lm.isAdvertisingAvailable()
    })
    .then(function(ok){
        var a = self.deps.advertisement
        if (ok && a.advertise) startAdvertise.call(self, a)
    })
},
clear = function(self, lm){
    var
    rs = this.regions,
    r
    for(var key in rs){
        r=rs[key]
        if (!r) continue
        stopScan.call(lm, r)
        deleteRegion.call(self, r.uuid, r.major, r.minor)
    }
    stopAdvertise.call(self)
},
newRegion = function(id, uuid, major, minor){
    if (getRegion(this.regions,uuid,major,minor)) return
    major = major || undefined
    minor = minor || undefined
    var
    lm = this.locationMgr,
    r = new lm.BeaconRegion(id, uuid, major, minor)
    lm.startMonitoringForRegion(r).fail(console.error).done()
    setRegion(this.regions,uuid,major,minor,r)

    // hack for demo, where app launches within region
    // because region state is undefined (sometimes) at beginning
    // is it plugin bug that didn't determine region state at start?
    //if (ok && r.range) startScan.call(lm, b)
    lm.requestStateForRegion(r)

    return r
},
getRegion = function(regions, uuid, major, minor){
    if (!regions) return
    return regions[(uuid+':'+(major||0)+':'+(minor||0)).toUpperCase()]
},
setRegion = function(regions, uuid, major, minor, region){
    if (!regions) return
    regions[(uuid+':'+(major||0)+':'+(minor||0)).toUpperCase()] = region
},
deleteRegion = function(uuid,major,minor,cb){
    var r = getRegion(this.regions,uuid,major,minor)
    if (!r) return
    var lm = this.locationMgr
    setRegion(this.regions,uuid,major,minor,undefined)
    lm.stopMonitoringForRegion(r).fail(console.error).done(cb)
},
startScan = function(region,cb){
    this.startRangingBeaconsInRegion(region).fail(console.error).done(cb)
},
stopScan = function(region,cb){
    if (!region) return
    this.stopRangingBeaconsInRegion(region).fail(console.error).done(cb)
},
startAdvertise = function(ads, cb){
    var org = this.deps.advertisement
    if (!ads || (!ads.uuid && !org.uuid)) return
    var
    self = this,
    lm = this.locationMgr,
    r = new lm.BeaconRegion(''+Date.now(), ads.uuid||org.uuid, ads.major||org.major, ads.minor||org.minor)

    lm.isAdvertising().done(function(state){
        if (state){
            stopAdvertise.call(self, function(){
                lm.startAdvertising(r, ads.rssi||org.rssi).fail(console.error).done(cb)
            })
        }
        lm.startAdvertising(r, ads.rssi||org.rssi).fail(console.error).done(cb)
    })
},
stopAdvertise = function(cb){
    this.locationMgr.stopAdvertising().fail(console.error).done(cb)
}

return{
    signals: [
        'iBeacon_changeAuthorizationStatus',
        'iBeacon_startMonitoringForRegion',
        'iBeacon_determineStateForRegion',
        'iBeacon_rangeBeaconsInRegion',
        'iBeacon_enterRegion',
        'iBeacon_exitRegion',
        'iBeacon_startAdvertising',
        'iBeacon_updateState'],
    deps: {
        daemonized:'bool',
        advertisement: 'map',
        regions:'map'
    },
    create: function(deps){
        var
        self = this,
        lm = __.refChain(window, ['cordova', 'plugins', 'locationManager'])

        if (!lm) {
            this.slots = {}
            return console.warn('iBeacon plugin is not available')
        }

        lm.isBluetoothEnabled().done(function(state){
            if (!state) alert('Please enable bluetooth')
        })

        this.locationMgr = lm
        this.regions = {}

        addListeners(this, lm)

        lm.getAuthorizationStatus().done(function(res){
            switch(res.authorizationStatus){
            case 'AuthorizationStatusAuthorized':
            case 'AuthorizationStatusAuthorizedWhenInUse':
                setup(self, lm)
                break
            case 'AuthorizationStatusNotDetermined':
                if (deps.daemonized){
                    lm.requestAlwaysAuthorization().done(function(){
                        setup(self, lm)
                    })
                }else{
                    lm.requestWhenInUseAuthorization().done(function(){
                        setup(self, lm)
                    })
                }
                break
            default:
                alert('Please allow access to Location')
                break
            }
        })
    },
    remove: function(){
        clear(this, this.locationMgr)
        Module.prototype.remove.call(this)
    },
    slots: {
        iBeacon_addRegion: function(from, sender, id, uuid, major, minor){
            newRegion.call(this, id, uuid, major, minor)
        },
        iBeacon_removeRegion: function(from, sender, uuid, major, minor){
            if (uuid){
                stopScan.call(this.locationMgr, getRegion(this.regions,uuid,major,minor))
                deleteRegion.call(this, uuid, major, minor)
            }else{
                var
                lm=this.locationMgr,
                rs=this.regions,
                r
                for(var key in rs){
                    r=rs[key]
                    if (!r) continue
                    stopScan.call(lm, r)
                    deleteRegion.call(this, r.uuid, r.major, r.minor)
                }
            }
        },
        iBeacon_startScan: function(from, sender, keys){
            var
            lm = this.locationMgr,
            rs = this.regions

            if (keys){
                for(var i=0,r,k; k=keys[i]; i++){
                    r=getRegion(rs,k.uuid,k.major,k.minor)
                    if (!r) continue
                    startScan.call(lm, r)
                }
            }else{
                for(var k in rs){
                    startScan.call(lm, rs[k])
                }
            }
        },
        iBeacon_stopScan: function(from, sender, keys){
            var
            lm = this.locationMgr,
            rs = this.regions

            if (keys){
                for(var i=0,r,k; k=keys[i]; i++){
                    r=getRegion(rs,k.uuid,k.major,k.minor)
                    if (!r) continue
                    stopScan.call(lm, r)
                }
            }else{
                for(var k in rs){
                    stopScan.call(lm, rs[k])
                }
            }
        },
        iBeacon_advertisement: function(from, sender, ads){
            startAdvertise.call(this, ads)
        },
        iBeacon_startAdvertise: function(from, sender){
            startAdvertise.call(this, this.deps.advertisement)
        },
        iBeacon_stopAdvertise: function(from, sender){
            stopAdvertise.call(this)
        }
    }
}
