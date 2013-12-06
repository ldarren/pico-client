pico.def('piDataNet', function(){

    var
    me = this,
    acknowledge = function(net, resId){
        var data = JSON.stringify({resId:resId});

        if (net.secretKey){
            var date = Date.now();
            net.acks.push({
                api: 'ack',
                reqId: 0,
                date: date,
                key: CryptoJS.HmacMD5(data, net.secretKey+date).toString(CryptoJS.enc.Base64),
                data: data
            });
        }else{
            net.acks.push({
                api: 'ack',
                reqId: 0,
                data: data
            });
        }
    },
    timeSync = function(net, cb){
        pico.ajax('trace', net.url, net.reqs, null, function(err, xhr){
            if (err) return cb(err);
            net.serverTime = parseInt(xhr.responseText);
            net.serverTimeAtClient = Date.now();
        });
    },
    onResponse = function(err, xhr, net){
        // schedule next update
        if (!net.beatId && 4 === xhr.readyState){
            var channel = xhr.getResponseHeader('Pragma');
            if (channel){
                var idPass = channel.split(' ');
                net.channelId = idPass[0];
                net.channelPass = idPass[1];
            }
            net.beatId = setTimeout(onBeat, net.beatRate, net);
        }

        var reqId, cb;
        if (err) {
            for (var i=0,l=net.reqs.length; i<l; i++){
                reqId = net.reqs[i].reqId;
                cb = net.callbacks[reqId];
                if (!cb) continue;
                delete net.callbacks[reqId];
                cb(err);
            }
            return console.error(err);
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
        }catch(exp){
            // incomplete json, return first
            return;
        }
        net.resEndPos = xhr.responseText.length;

        if (!res || !res.reqId) return console.error('incomplete response header: '+JSON.stringify(res));

        net.input.push(res);
    },
    onBeat = function(net){
        net.beatId = 0;

        if (net.inbox.length){
            var
            inbox = net.inbox,
            callbacks = net.callbacks,
            res, resId, cb;

            for(var i=0,l=inbox.length; i<l; i++){
                res = inbox.pop();
console.log('res: '+JSON.stringify(res));
                resId = res.resId;
                if (resId){
                    acknowledge(net, resId);
                }

                if (net.secretKey){
                    if (res.key !== CryptoJS.HmacMD5(res.data, this.secretKey+res.date).toString(CryptoJS.enc.Base64)){
                        console.error('invalid server key: '+JSON.stringify(res));
                    }
                    if (60000 < Math.abs(res.date - net.getTime())){
                        console.error('invalid server key: '+JSON.stringify(res));
                    }
                    net.setTime(res.date);
                }

                cb = callbacks[reqId];
                if (cb){
                    res.data = JSON.parse(res.data);
                    delete callbacks[reqId];
                    cb(null, res);
                }
            }
        }

        // post update tasks
        if (net.outbox.length || net.acks.length){

            net.reqs = net.acks.concat(net.outbox),
            net.acks.length = 0;
            net.outbox.length = 0;

            var headers;
            if (net.channelId && net.channelPass){
                headers = {
                    'Pragma': ''+net.channelId+' '+net.channelPass
                }
            }

            net.resEndPos = 0;

console.log('reqs: '+JSON.stringify(net.reqs));
            pico.ajax('post', net.url, net.reqs, headers, onResponse, net);
            return;
        }
        net.beatId = setTimeout(onBeat, net.beatRate, net);
    };

    function PicoNet(cfg){
        if (!cfg.url){
            return console.error('url is not set');
        }
        this.url = cfg.url;
        this.secretKey = cfg.secretKey;
        this.delimiter = cfg.delimiter;
        this.reqId = Math.floor(Math.random() * 1000);
        this.inbox = [];
        this.outbox = [];
        this.callbacks = {};
        this.acks = [];
        this.reqs = [];
        this.resEndPos = 0;
        this.channelId = null;
        this.channelPass = null;
        this.serverTime = 0;
        this.serverTimeAtClient = 0;
        this.beatRate = cfg.beatRate || 5000;
        this.beatId = setTimeout(onBeat, this.beatRate, this);
    }

    PicoNet.prototype.request = function(api, data, cb){
        if (this.outbox.length){
            var lastReq = this.outbox.shift();
            if (api !== lastReq.api){
                this.outbox.unshift(lastReq);
            }
        }
        if (this.secretKey){
            var date = Date.now();

            this.outbox.push({
                api: api,
                reqId: ++this.reqId,
                date: date,
                key: CryptoJS.HmacMD5(data, this.secretKey+date).toString(CryptoJS.enc.Base64),
                data: data
            });
        }else{
            this.outbox.push({
                api: api,
                reqId: ++this.reqId,
                data: data
            });
        }
        if (cb) this.callbacks[this.reqId] = cb;
        if (!this.beatId){
            this.beatId = setTimeout(onBeat, this.beatRate, this);
        }
    };

    PicoNet.prototype.getTime(){
        return this.serverTime + (Date.now() - this.serverTimeAtClient);
    };

    me.create = function(cfg, cb){
        var net = new PicoNet(cfg);
        timeSync(net, function(err){
            return cb(err, net);
        });
    };
});

pico.def('piDataModel', function(){

    Object.defineProperty(this, 'UPDATE', {value:this.moduleName+'.update', writable:false, configurable:false, enumerable:true});

    this.use('piDataNet');
    this.storage = window.localStorage;

    var
    MODEL_SEP = G_CCONST.MODEL_SEP,
    BUFFER_SEP = '`',
    me = this,
    callbacks = {},
    constructModelKey = function(modelId, index){ return modelId + MODEL_SEP + index; },
    encodeBufferId = function(req){ return req.api + BUFFER_SEP + req.reqId; },
    decodeBufferId = function(key){
        var i = key.indexOf(MODEL_SEP);

        if (-1 === i) return key;

        var
        id = {modelId: key.substring(0, i)},
        index = key.substring(i+1);

        if (-1 === index.indexOf(BUFFER_SEP)){ // key = modelId.index
            id.index = index;
        }else{ // key = modelId.method`reqId
            var arr = index.split(BUFFER_SEP);
            id.method = MODEL_SEP+arr[0];
            id.reqId = arr[1];
        }

        return id;
    },
    constructIndex = function(indexKeys, data){
        var
        indexKeys = indexKeys,
        index = [],
        value;
        for (var i=0, l=indexKeys.length; i<l; i++){
            value = data[indexKeys[i]];
            if (!value) return 'all'; // no index
            index.push(value);
        }
        return JSON.stringify(index);
    },
    constructReq = function(modelId, method, data, cb){
        var req = {
                api: modelId + method,
                reqId: Date.now(),
                data: data
            };
        if (G_CCONST.ACK === method){
            me.piDataNet.addAck(req);
        }else{
            var bufferId = encodeBufferId(req);
            me.storage.setItem(bufferId, JSON.stringify(req));
            me.piDataNet.addOutbox(bufferId, req);
            if (cb) callbacks[bufferId] = cb;
        }
        return req;
    };

    // modelId = 'players'
    // index = ['playerId']
    // storage = window.sessionStorage or window.localStorage (default)
    this.init = function(modelId, indexKeys, storage){

        this.modelId = modelId;
        this.indexKeys = indexKeys;
        if (storage) this.storage = storage;
        else storage = this.storage;

        var
        UPDATE = G_CCONST.UPDATE,
        net = this.piDataNet,
        id, json, updates = [], coll = {};

        for (var key in storage){
            id = decodeBufferId(key);
            if (id.modelId !== modelId) continue;

            json = JSON.parse(storage.getItem(key));
            if (id.index){
                coll[id.index] = json;
            }else{
                if (UPDATE === id.method) updates.push(json);
                net.addOutbox(key, json);
            }
        }

        var index, data, src, dst;
        for(var i=0,l=updates.length; i<l; i++){
            data = updates[i].data;
            for(index in data){
                src = data[index];
                dst = coll[index] || {};
                for(key in src){
                    dst[key] = dst[key];
                }
            }
        }
        this.collection = coll;
        this.signal(this.UPDATE, [G_CCONST.INIT, this.collection]);
    };
    this.sync = function(res){
        if (!res || !res.api) return;

        var
        net = this.piDataNet,
        storage = this.storage,
        indexKeys = this.indexKeys,
        modelId = this.modelId,
        bufferId = encodeBufferId(res),
        cb = callbacks[bufferId];

        if (res.error){ // never return here.
            console.error(res.error);
            if (cb) cb(res.error);
            else alert(res.error);
        }else{
            var
            apiArr = res.api.split(MODEL_SEP),
            method = MODEL_SEP+apiArr[1],
            retVal = {},
            rowSvr, key, value, index;

            if (G_CCONST.UPDATE === method){
                var
                buffer = net.getOutbox(bufferId),
                data = buffer.data,
                modelKey;

                for(var k in data){
                    value = data[k];
                    index = constructIndex(indexKeys, value);
                    modelKey = constructModelKey(modelId, index);

                    rowSvr = storage.getItem(modelKey);
                    rowSvr = rowSvr ? JSON.parse(rowSvr) : {};
                    for (key in value){
                        rowSvr[key] = value[key];
                    }
                    storage.setItem(modelKey, JSON.stringify(rowSvr));
                    retVal[index] = rowSvr;
                }
            }else{
                var
                data = res.data,
                coll = this.collection;

                for(var k in data){
                    value = data[k];
                    index = constructIndex(indexKeys, value);
                    modelKey = constructModelKey(modelId, index);

                    switch(method){
                        case G_CCONST.INIT:
                        case G_CCONST.CREATE:
                            coll[index] = value;
                            storage.setItem(modelKey, JSON.stringify(value));
                            retVal[index] = value;
                            break;
                        case G_CCONST.ACK:
                            break;
                        case G_CCONST.READ:
                            rowSvr = coll[index] || {};
                            for (key in value){
                                rowSvr[key] = value[key];
                            }
                            coll[index] = rowSvr;
                            storage.setItem(modelKey, JSON.stringify(rowSvr));
                            retVal[index] = rowSvr;
                            break;
                        case G_CCONST.DELETE:
                            delete coll[index]; // just in case it is still there
                            storage.removeItem(modelKey);
                            retVal[index] = null;
                            break;
                    }
                }
            }
            if (cb) cb(null, retVal);
        }

        storage.removeItem(bufferId);
        net.delOutbox(bufferId);
        delete callbacks[bufferId];

        this.request(G_CCONST.ACK, {resId: res.resId});

        if (method !== G_CCONST.ACK) this.signal(this.UPDATE, [method, data]);
    };
    this.requestOnce = function(method, update, cb){
        if (this.piDataNet.searchOutbox(this.modelId + method)) return;
        this.request(method, update, cb);
    };
    this.request = function(method, update, cb){
        if (0 === Object.keys(update).length) return cb('update has 0 data');
        constructReq(this.modelId, method, update, cb);
    };
    this.get = function(condition, keys){
        var
        condition = condition || 'all',
        ret = [],
        rows = [],
        coll = this.collection,
        key;

        if ('all' === condition){
            for (key in coll){
                rows.push(coll[key]);
            }
        }else{
            var
            index = constructIndex(this.indexKeys, condition),
            row = coll[index];
            if (row) rows.push(coll[index]);
        }

        if (keys && keys.length){
            var row, collRow, i, l;
            for(var j=0, rl=rows.length; j<rl; j++){
                collRow = {};
                row = rows[j];
                for(i=0,l=keys.length; i<l; i++){
                    key = keys[i];
                    collRow[key] = row[key];
                }
                ret.push(collRow);
            }
        }else{
            ret = rows;
        }
        Object.freeze(ret);
        return ret;
    };
    this.remove = function(keys){
        this.request(G_CCONST.DELETE, keys);
    };
    this.isValid = function(){
        var keys = Object.keys(this.collection);
        return keys && keys.length;
    };
});
