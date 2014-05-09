var
Abs = Math.abs,Floor=Math.floor,Random=Math.random,
API_ACK = 'ack',
isOnline = true,
stdCB = function(err){if (err) console.error(err);},
timeSync = function(net, cb){
    cb = cb || stdCB;
    pico.ajax('get', net.url, net.reqs, null, function(err, xhr){
        if (err) return cb(err);
        if (4 !== xhr.readyState) return;
        var st = parseInt(xhr.responseText);
        if (isNaN(st)) return cb('invalid timesync response');
        net.serverTime = st;
        net.serverTimeAtClient = Date.now();
        cb();
    });
},
onResponse = function(err, xhr, net){
    // schedule next update
    if (2 === xhr.readyState){
        net.channelId = xhr.getResponseHeader('Pragma');
    } else if (!net.beatId && 4 === xhr.readyState){
        net.beatId = window.setInterval(onBeat, net.beatRate, net);
    }

    if (err) {
        // network or auth error, abort all requests
        var
        reqs = net.reqs,
        reqId, cb;
        for (var i=0,l=reqs.length; i<l; i++){
            reqId = reqs[i].reqId;
            cb = net.callbacks[reqId];
            if (!cb) continue;
            delete net.callbacks[reqId];
            cb(err);
        }
        timeSync(net); // sync time, in case it was due to time error
        return;
    }

    try{
        var text = xhr.responseText.substr(net.resEndPos);
        if (net.delimiter){
            var jsons = text.split(net.delimiter);
            if (!jsons.length) return;
            var res = JSON.parse(jsons[0]);
        }else{
            var res = JSON.parse(text);
        }
    
        net.resEndPos = xhr.responseText.length;

        if (!res || !res.reqId) return console.error('incomplete response header: '+JSON.stringify(res));

        if (res.resId){
            net.request(API_ACK, {resId:res.resId});
        }

        if (net.cullAge && res.data && net.cullAge < Abs(net.getServerTime()-res.data)) return console.error('invalid server time: '+JSON.stringify(res)+' '+net.getServerTime());

        net.inbox.push(res);
    }catch(exp){
        // incomplete json, return first
        return;
    }
},
onBeat = function(net){
    if (net.inbox.length){
        var
        inbox = net.inbox,
        callbacks = net.callbacks,
        res, reqId, payload, cb;

        for(var i=0,l=inbox.length; i<l; i++){
            res = inbox.pop();
            payload = res.data || res.error;
console.debug('res: '+JSON.stringify(res));

            if (net.secretKey){
                if (res.key !== CryptoJS.HmacMD5(payload, net.secretKey+res.date).toString(CryptoJS.enc.Base64)){
                    console.error('invalid server key: '+JSON.stringify(res));
                    continue;
                }
            }

            reqId = res.reqId;
            cb = callbacks[reqId];
            if (cb){
                delete callbacks[reqId];
                if (res.error) cb(JSON.parse(payload));
                else cb(null, JSON.parse(payload));
            }
        }
    }

    // post update tasks, buffer data in memory network offline
    if (isOnline && (net.outbox.length || net.acks.length)){

        net.reqs = net.acks.concat(net.outbox),
        net.acks.length = 0;
        net.outbox.length = 0;

        var headers;
        if (net.channelId){
            headers = {
                'Pragma': net.channelId
            }
        }

        net.resEndPos = 0;

console.debug('reqs: '+JSON.stringify(net.reqs));
        pico.ajax('post', net.url, net.reqs, headers, onResponse, net);
        window.clearInterval(net.beatId);
        net.beatId = 0;
        return;
    }
};

window.addEventlistener('online', function(e){isOnline = true;});
window.addEventlistener('offline', function(e){isOnline = false;});

function PicoNet(cfg){
    if (!cfg.url){
        return console.error('url is not set');
    }
    this.url = cfg.url;
    this.secretKey = cfg.secretKey;
    this.cullAge = cfg.cullAge || 0;
    this.delimiter = cfg.delimiter;
    this.reqId = 1 + Floor(Random() * 1000);
    this.inbox = [];
    this.outbox = [];
    this.callbacks = {};
    this.acks = [];
    this.reqs = [];
    this.resEndPos = 0;
    this.channelId = 0,
    this.serverTime = 0;
    this.serverTimeAtClient = 0;
    this.beatRate = !cfg.beatRate || cfg.beatRate < 100 ? 5000 : cfg.beatRate;
    this.beatId = window.setInterval(onBeat, this.beatRate, this);
}

PicoNet.prototype = {
    request: function(api, data, cb){
        if ('function' === typeof data){
            cb = data;
            data = {};
        }
        if (!api || !data) return console.error('Not enough request parameters api['+api+'] data['+JSON.stringify(data)+']');
        if (api !== API_ACK && this.outbox.length){
            var lastReq = this.outbox.shift();
            if (api !== lastReq.api){
                this.outbox.unshift(lastReq);
            }
        }
        var
        json = JSON.stringify(data),
        queue = API_ACK === api ? this.acks : this.outbox,
        reqId = 0;

        if (cb){
            reqId = this.reqId++;
            this.callbacks[reqId] = cb;
        }

        if (this.secretKey){
            var t = this.getServerTime();
            queue.push({
                api: api,
                reqId: reqId,
                date: t,
                key: CryptoJS.HmacMD5(json, this.secretKey+t).toString(CryptoJS.enc.Base64),
                data:json 
            });
        }else{
            queue.push({
                api: api,
                reqId: reqId,
                data:json 
            });
        }
    },
    getServerTime: function(){
        return this.serverTime + (Date.now() - this.serverTimeAtClient);
    }
};

me.create = function(cfg, cb){
    var net = new PicoNet(cfg);
    timeSync(net, function(err){
        return cb(err, net);
    });
};
