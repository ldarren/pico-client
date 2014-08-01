var
Abs = Math.abs,Floor=Math.floor,Random=Math.random,
API_ACK = 'ack',
isOnline = true,
stdCB = function(err){if (err) console.error(err)},
appendFD = function(fd, name, value){ fd.append(name, value) },
appendObj = function(obj, name, value){ obj[name] = value },
timeSync = function(net, cb){
    cb = cb || stdCB
    pico.ajax('get', net.url, null, null, function(err, xhr){
        if (4 !== xhr.readyState) return
        if (err) return cb(err)
        var st = parseInt(xhr.responseText)
        if (isNaN(st)) return cb('invalid timesync response')
        net.serverTime = st
        net.serverTimeAtClient = Date.now()
        net.beatId = window.setInterval(onBeat, net.beatRate, net)
        cb()
    })
},
parseHeader = function(k,v){if ('data'===k || 'error'===k)return JSON.stringify(v); return v},
onResponse = function(err, xhr, net){
    // schedule next update
    if (2 === xhr.readyState){
        // parse response header here
    } else if (!net.beatId && 4 === xhr.readyState){
        net.beatId = window.setInterval(onBeat, net.beatRate, net)
    }

    if (err) {
        // network or auth error, abort all requests
        var
        reqs = net.reqs,
        sep = net.delimiter,
        reqId, cb
        for (var i=0,l=reqs.length; i<l; i++){
            try{
                reqId = JSON.parse(reqs[i].split(sep)[0]).reqId
                cb = net.callbacks[reqId]
                if (!cb) continue
                delete net.callbacks[reqId]
                cb(err)
            }catch(exp){
                console.error(exp)
                continue
            }
        }
        return timeSync(net) // sync time, in case it was due to time error
    }

    var
    startPos = net.resEndPos, endPos = -1,
    text = xhr.responseText,
    sep = net.delimiter,
    json

    try{
        while(true){
            endPos = text.indexOf(sep, startPos)
            if (-1 === endPos) break

            json = JSON.parse(text.substring(startPos, endPos), parseHeader)
            startPos = endPos + sep.length

            if (json.length) {
                net.channel = json[0]
                continue
            }
            if (!json.reqId) {
                console.error('incomplete response header: '+JSON.stringify(json))
                continue
            }

            if (json.resId){
                net.request(API_ACK, {resId:json.resId})
            }

            if (net.cullAge && json.data && net.cullAge < Abs(net.getServerTime()-json.data)) {
                console.error('invalid server time: '+JSON.stringify(json)+' '+net.getServerTime())
                continue
            }

            net.inbox.push(json)
        }
    }catch(exp){
        // incomplete json, return first
    }
    net.resEndPos = startPos
},
onBeat = function(net){
    if (net.inbox.length){
        var
        inbox = net.inbox,
        callbacks = net.callbacks,
        res, reqId, payload, cb

        for(var i=0,l=inbox.length; i<l; i++){
            res = inbox.pop()
            payload = res.data || res.error
console.debug('res: '+JSON.stringify(res))

            if (net.secretKey){
                if (res.key !== CryptoJS.HmacMD5(payload, net.secretKey+res.date).toString(CryptoJS.enc.Base64)){
                    console.error('invalid server key: '+JSON.stringify(res))
                    continue
                }
            }

            reqId = res.reqId
            cb = callbacks[reqId]
            if (cb){
                delete callbacks[reqId]
                if (res.error) cb(JSON.parse(payload))
                else cb(null, JSON.parse(payload))
            }
        }
    }

    // post update tasks, buffer data in memory network if offline
    if (isOnline && (net.uploads.length || net.outbox.length || net.acks.length)){

        net.resEndPos = 0

        if (net.uploads.length){
            var fb = net.uploads.shift()
            fb.append('channel', net.channel)
            pico.ajax('post', net.url, net.uploads.shift(), null, onResponse, net)
console.debug('reqs: upload')
        }else{
            var reqs = net.reqs = net.acks.concat(net.outbox)
            reqs.unshift(JSON.stringify([net.channel]))
            net.acks.length = 0
            net.outbox.length = 0

            pico.ajax('post', net.url, reqs.join(net.delimiter), null, onResponse, net)
console.debug('reqs: '+JSON.stringify(reqs))
        }
        window.clearInterval(net.beatId)
        net.beatId = 0
        return
    }
},
formation = function(form, dst, prefix){
    if (!form || !(form instanceof HTMLFormElement)) return
    prefix = prefix || ''

    var
    append = dst instanceof FormData ? appendFD : appendObj,
    elements = form.elements,
    field, fieldType, f, fl

    for (var i=0, l=elements.length; i<l; i++) {
        field = elements[i]
        if (!field.hasAttribute('name')) continue
        fieldType = field.nodeName.toUpperCase() === 'INPUT' ? field.getAttribute('type').toUpperCase() : 'TEXT'
        if (fieldType === 'FILE') {
            for (f = 0, fl=field.files.length; f<fl; append(dst, prefix+field.name, field.files[f++]));
        } else if ((fieldType !== 'RADIO' && fieldType !== 'CHECKBOX') || field.checked) {
            append(dst, prefix+field.name, field.value)
        }
    }

    return form.action.substr(form.baseURI.length)
},
netConfig = function(net, cfg){
    net.url = cfg.url || net.cfg
    net.secretKey = cfg.secretKey || net.secretKey
    net.cullAge = cfg.cullAge || net.cullAge || 0
    net.delimiter = cfg.delimiter ? JSON.stringify(cfg.delimiter) : net.delimiter || JSON.stringify(['&'])
    net.beatRate = !cfg.beatRate || cfg.beatRate < 100 ? net.beatRate || 5000 : cfg.beatRate
}

window.addEventListener('online', function(e){isOnline = true})
window.addEventListener('offline', function(e){isOnline = false})

function Net(cfg){
    if (!cfg.url){
        return console.error('url is not set')
    }
    netConfig(this, cfg)
    this.reqId = 1 + Floor(Random() * 1000)
    this.inbox = []
    this.outbox = []
    this.uploads = []
    this.callbacks = {}
    this.acks = []
    this.reqs = []
    this.resEndPos = 0
    this.channel = '',
    this.serverTime = 0
    this.serverTimeAtClient = 0
    this.beatId = 0
}

Net.prototype = {
    reconnect: function(cfg, cb){
        netConfig(this, cfg)
        this.outbox.length = 0
        timeSync(this, function(err){
            cb(err, this)
        })
    },
    submit: function(form, cb){
        if (!form || !(form instanceof HTMLFormElement)) return console.error('No HTMLFormElement submitted')

        var reqId = 0

        if (cb){
            reqId = this.reqId++
            this.callbacks[reqId] = cb
        }

        var fd = new FormData()

        fd.append('api', formation(form, fd, 'data/'))
        fd.append('reqId', reqId)

        this.uploads.push(fd)
        if (!this.beatId) this.beatId = window.setInterval(onBeat, this.beatRate, this)
    },
    request: function(api, data, cb){
        if (data instanceof Function){
            cb = data
            data = undefined
        }else if (data instanceof HTMLFormElement){
            var obj = {}
            api = formation(data, obj)
            data = obj
        }
        if (!api) return console.error('Missing api,  data['+JSON.stringify(data)+']')

        var queue = this.acks
        if (api !== API_ACK){
            queue = this.outbox
            if (queue.length){
                var lastReq = queue.shift()
                if (api !== lastReq.api){
                    queue.unshift(lastReq)
                }
            }
        }

        var reqId = 0
        if (cb){
            reqId = this.reqId++
            this.callbacks[reqId] = cb
        }

        var dataList=[]

        if (data){
            json = data.json
            delete data.json
            dataList.push(JSON.stringify(data))
            if (json){
                if (!json.length){
                    dataList.push(json)
                }else{
                    Array.prototype.push.apply(dataList, json)
                }
            }
        }

        if (dataList.length && this.secretKey){
            var
            t = this.getServerTime(),
            hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.MD5, this.secretKey+t)

            //key: CryptoJS.HmacMD5(JSON.stringify(data), this.secretKey+t).toString(CryptoJS.enc.Base64),
            for(var i=0,l=dataList.length; i<l; i++){
                hmac.update(dataList[i])
            }

            dataList.unshift(JSON.stringify({
                api: api,
                reqId: reqId,
                len:dataList.length,
                date: t,
                key: hmac.finalize().toString(CryptoJS.enc.Base64)
            }))
        }else{
            dataList.unshift(JSON.stringify{
                api: api,
                reqId: reqId,
                len:dataList.length
            }))
        }
        queue.push(dataList.join(this.delimiter))

        if (!this.beatId) this.beatId = window.setInterval(onBeat, this.beatRate, this)
    },
    getServerTime: function(){
        return this.serverTime + (Date.now() - this.serverTimeAtClient)
    }
}

me.create = function(cfg, cb){
    var net = new Net(cfg)
    timeSync(net, function(err){
        cb(err, net)
    })
}
