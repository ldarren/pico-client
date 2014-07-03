var
Abs = Math.abs,Floor=Math.floor,Random=Math.random,
API_ACK = 'ack',
isOnline = true,
stdCB = function(err){if (err) console.error(err)},
appendFD = function(fd, name, value){ fd.append(name, value) },
appendObj = function(obj, name, value){ obj[name] = value },
timeSync = function(net, cb){
    cb = cb || stdCB
    pico.ajax('get', net.url, net.reqs, null, function(err, xhr){
        if (err) return cb(err)
        if (4 !== xhr.readyState) return
        var st = parseInt(xhr.responseText)
        if (isNaN(st)) return cb('invalid timesync response')
        net.serverTime = st
        net.serverTimeAtClient = Date.now()
        cb()
    })
},
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
        reqId, cb
        for (var i=0,l=reqs.length; i<l; i++){
            reqId = reqs[i].reqId
            cb = net.callbacks[reqId]
            if (!cb) continue
            delete net.callbacks[reqId]
            cb(err)
        }
        timeSync(net) // sync time, in case it was due to time error
        return
    }

    try{
        var
        startPos = net.resEndPos, endPos = -1,
        text = xhr.responseText,
        sep = net.delimiter,
        json

        while(true){
            endPos = text.indexOf(sep, startPos)
            if (-1 === endPos) break

            json = JSON.parse(text.substring(startPos, endPos))
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
        net.resEndPos = startPos
    }catch(exp){
        // incomplete json, return first
        return
    }
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
            net.reqs = net.acks.concat(net.outbox)
            net.reqs.unshift([net.channel])
            net.acks.length = 0
            net.outbox.length = 0

            pico.ajax('post', net.url, net.reqs, null, onResponse, net)
console.debug('reqs: '+JSON.stringify(net.reqs))
        }
        window.clearInterval(net.beatId)
        net.beatId = 0
        return
    }
}

window.addEventListener('online', function(e){isOnline = true})
window.addEventListener('offline', function(e){isOnline = false})

function Net(cfg){
    if (!cfg.url){
        return console.error('url is not set')
    }
    this.url = cfg.url
    this.secretKey = cfg.secretKey
    this.cullAge = cfg.cullAge || 0
    this.delimiter = JSON.stringify(cfg.delimiter)
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
    this.beatRate = !cfg.beatRate || cfg.beatRate < 100 ? 5000 : cfg.beatRate
    this.beatId = window.setInterval(onBeat, this.beatRate, this)
}

Net.prototype = {
    formation: function(form, dst, prefix){
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
    submit: function(form, cb){
        if (!form || !(form instanceof HTMLFormElement)) return console.error('No HTMLFormElement submitted')

        var reqId = 0

        if (cb){
            reqId = this.reqId++
            this.callbacks[reqId] = cb
        }

        var fd = new FormData()

        fd.append('api', this.formation(form, fd, 'data/'))
        fd.append('reqId', reqId)

        this.uploads.push(fd)
        if (!this.beatId) this.beatId = window.setInterval(onBeat, this.beatRate, this)
    },
    request: function(api, data, cb){
        if (data instanceof Function){
            cb = data
            data = {}
        }else if (data instanceof HTMLFormElement){
            var obj = {}
            api = this.formation(data, obj)
            data = obj
        }
        if (!api || !data) return console.error('Not enough request parameters api['+api+'] data['+JSON.stringify(data)+']')
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

        var json = JSON.stringify(data)

        if (this.secretKey){
            var t = this.getServerTime()
            queue.push({
                api: api,
                reqId: reqId,
                date: t,
                key: CryptoJS.HmacMD5(json, this.secretKey+t).toString(CryptoJS.enc.Base64),
                data:json 
            })
        }else{
            queue.push({
                api: api,
                reqId: reqId,
                data:json 
            })
        }

        if (!this.beatId) this.beatId = window.setInterval(onBeat, this.beatRate, this)
    },
    getServerTime: function(){
        return this.serverTime + (Date.now() - this.serverTimeAtClient)
    }
}

me.create = function(cfg, cb){
    var net = new Net(cfg)
    timeSync(net, function(err){
        return cb(err, net)
    })
}
