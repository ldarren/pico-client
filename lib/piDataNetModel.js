pico.def('piDataNet', function(){

    var
    beatId = 0,
    config = {},
    outbox = {},
    acks = [],
    onBeat = function(delay, startTime){
        var
        outboxKeys = Object.keys(outbox),
        endPos = 0;

        beatId = 0;
        pico.signal('piDataNet.beat');

        // post update tasks
        if (outboxKeys.length || acks.length){
            var req = acks.slice(0);
            acks.length = 0;
            outboxKeys.sort();
            for (var i=0, l=outboxKeys.length; i<l; i++){
                req.push(outbox[outboxKeys[i]]);
            }
console.log('req',req);
            pico.ajax('post', config.pushURL, req, null, function(err, xhr){
                // schedule next update
                if (!beatId && 4 === xhr.readyState){
                    beatId = setTimeout(onBeat, delay, delay, Date.now());
                }

                if (err) return console.error(err);

                try{
                    var
                    json = xhr.responseText.substr(endPos),
                    res = JSON.parse(json);
                }catch(exp){
                    // incomplete json, return first
                    return;
                }
                endPos = xhr.responseText.length;
                if (!res || !res.modelId) return console.error(res);

                model = pico.modules[res.modelId];
                model.sync(res);
                console.log('res', res);
            });
        }else{
            beatId = setTimeout(onBeat, delay, delay, Date.now());
        }
    };

    this.init = function(cfg){
        for (var key in cfg){
            config[key] = cfg[key];
        }
        config.beatRate = config.beatRate || 1000;
        if (beatId) clearTimeout(beatId);
        beatId = setTimeout(onBeat, 1000, config.beatRate, Date.now());
    };


    this.addOutbox = function(key, data){
        outbox[key] = data;
    };

    this.searchOutbox = function(api){
        for (var key in outbox){
            if (api === outbox[key].api) return key;
        }
        return;
    };

    this.delOutbox = function(key){
        delete outbox[key];
    };

    this.addAck = function(obj){
        acks.push(obj);
    };
});

pico.def('piDataModel', function(){

    this.use('piDataNet');

    // modelId = 'players'
    // index = ['playerId']
    this.init = function(modelId, indexKeys){
        var
        localStorage = this.localStorage = window.localStorage,
        keySvr = this.keyServer = modelId,
        keyCli = this.keyClient = modelId + ':cli',
        dataSvr = localStorage.getItem(keySvr), // contain server side value
        dataCli = localStorage.getItem(keyCli); // contain all the changes

        this.modelId = modelId;
        this.indexKeys = indexKeys;
        this.dataServer = dataSvr ? JSON.parse(dataSvr) : {};
        this.dataClient = dataCli ? JSON.parse(dataCli) : {};
        this.data = {};

        var arr, net = this.piDataNet;
        for (var key in localStorage){
            arr = key.split('.'); // key|bufferId = modelId . method : reqId
            if (1 < arr.length && modelId  === arr[0]){
                net.addOutbox(key, JSON.parse(localStorage.getItem(key)));
            }
        }

        this.constructData();
    };
    this.syncData = function(method, data){
        if (!data) return;
        var
        dataSvr = this.dataServer,
        dataCli = this.dataClient,
        rowSvr, rowCli, key, value, index;

        for(var k in data){
            value = data[k];
            index = this.constructIndex(value);

            switch(method){
                case G_CCONST.INIT:
                case G_CCONST.CREATE:
                    dataSvr[index] = value;
                    delete dataCli[index];
                    break;
                case G_CCONST.ACK:
                    break;
                case G_CCONST.READ:
                case G_CCONST.UPDATE:
                    rowSvr = dataSvr[index] || {};
                    rowCli = dataCli[index] || {};
                    for (key in value){
                        rowSvr[key] = value[key];
                        delete rowCli[key];
                    }
                    dataSvr[index] = rowSvr;
                    dataCli[index] = rowCli;
                    break;
                case G_CCONST.DELETE:
                    delete dataSvr[index];
                    delete dataCli[index];
                    break;
            }
        }
    };
    this.sync = function(res){
        if (!res || !res.api) return;

        var
        dataSvr = this.dataServer,
        dataCli = this.dataClient,
        storage = this.localStorage,
        bufferId = this.constructBufferId(res);

        if (res.error){
            alert(res.error);
        }else{
            var
            apiArr = res.api.split('.'),
            method = '.'+apiArr[1],
            data = res.data;
            this.syncData(method, data);
        }

        storage.removeItem(bufferId);
        this.piDataNet.delOutbox(bufferId);
        storage.setItem(this.keyServer, JSON.stringify(dataSvr));
        storage.setItem(this.keyClient, JSON.stringify(dataCli));
        this.constructReq(G_CCONST.ACK, {resId: res.resId});
        this.constructData();
    };
    this.requestOnce = function(method, update){
        if (this.piDataNet.searchOutbox(this.modelId + method)) return;
        this.request(method, update);
    };
    this.request = function(method, update){
        this.set(method, update);

        this.constructReq(method, update);
    };
    this.set = function(method, update){
        var
        dataCli = this.dataClient,
        storage = this.localStorage,
        index = this.constructIndex(update);
        if (false === index) return;

        switch(method){
            case G_CCONST.CREATE:
                dataCli[index] = update;
                break;
            case G_CCONST.UPDATE:
                var row = dataCli[index];
                if (!row) break;
                for (var k in update){
                    row[k] = update[k];
                }
                break;
            case G_CCONST.DELETE:
                delete dataCli[index];
                break;
        }

        storage.setItem(this.keyClient, JSON.stringify(dataCli));
        this.constructData();
    };
    this.get = function(condition, keys){

        var
        condition = condition || 'all',
        ret = [],
        rows = [],
        data = this.data,
        key;

        if ('all' === condition){
            for (key in data){
                rows.push(data[key]);
            }
        }else{
            var index = this.constructIndex(condition);
            rows.push(data[index]);
        }

        if (keys && keys.length){
            var row, dataRow;
            for(var j=0, rl=rows.length; j<rl; j++){
                dataRow = {};
                row = rows[j];
                for(var i=0,l=keys.length; i<l; i++){
                    key = keys[i];
                    dataRow[key] = row[key];
                }
                ret.push(dataRow);
            }
        }else{
            ret = rows;
        }
        Object.freeze(ret);
        return ret;
    };
    this.remove = function(keys){
        this.constructReq(G_CCONST.DELETE, keys);
    };
    this.isValid = function(){
        var keys = Object.keys(this.data);
        return keys && keys.length;
    };
    this.constructIndex = function(data){
        var
        indexKeys = this.indexKeys,
        index = [],
        value;
        for (var i=0, l= indexKeys.length; i<l; i++){
            value = data[indexKeys[i]];
            if (!value) return false;
            index.push(value);
        }
        return JSON.stringify(index);
    };
    this.constructData = function(){
        var
        dataCli = this.dataClient,
        dataSvr = this.dataServer,
        data = this.data,
        index, obj, key, value;

        for (index in dataSvr){
            obj = dataSvr[index];
            value = {};
            for (key in obj){
                value[key] = obj[key];
            }
            data[index] = value; 
        }

        for (index in dataCli){
            obj = dataCli[index];
            data[index] = value = data[index] || {};
            for (key in obj){
                value[key] = obj[key];
            }
        }

        this.signal('piDataModel.update');
        return data;
    };
    this.constructReq = function(method, data){
        var req = {
                api: this.modelId + method,
                reqId: Date.now(),
                data: data
            };
        if (G_CCONST.ACK === method){
            this.piDataNet.addAck(req);
        }else{
            var bufferId = this.constructBufferId(req);
            this.localStorage.setItem(bufferId, JSON.stringify(req));
            this.piDataNet.addOutbox(bufferId, req);
        }
        return req;
    };
    this.constructBufferId = function(req){
        return req.api + ':' + req.reqId;
    };
});
