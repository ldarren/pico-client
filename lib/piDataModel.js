pico.def('piDataModel', function(){
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

        var arr;
        for (var key in localStorage){
            arr = key.split('.'); // key|bufferId = modelId . method : reqId
            if (1 < arr.length && modelId  === arr[0]){
                pico.outbox[key] = JSON.parse(localStorage.getItem(key));
            }
        }

        this.constructData();
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
            index = this.constructIndex(res.data),
            apiArr = res.api.split('.'),
            method = '.'+apiArr[1];

            switch(method){
                case G_CONST.INIT:
                case G_CONST.CREATE:
                    dataSvr[index] = res.data;
                    delete dataCli[index];
                    break;
                case G_CONST.ACK:
                    break;
                case G_CONST.READ:
                case G_CONST.UPDATE:
                    var
                    rowSvr = dataSvr[index] || {},
                    rowCli = dataCli[index] || {},
                    update = res.data;
                    for (var key in update){
                        rowSvr[key] = update[key];
                        delete rowCli[key];
                    }
                    dataSvr[index] = rowSvr;
                    dataCli[index] = rowCli;
                    break;
                case G_CONST.DELETE:
                    delete dataSvr[index];
                    delete dataCli[index];
                    break;
            }
        }

        storage.removeItem(bufferId);
        delete pico.outbox[bufferId];
        storage.setItem(this.keyServer, JSON.stringify(dataSvr));
        storage.setItem(this.keyClient, JSON.stringify(dataCli));
        this.constructReq(G_CONST.ACK, {resId: res.resId});
        this.constructData();
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

        switch(method){
            case G_CONST.CREATE:
                dataCli[index] = update;
                break;
            case G_CONST.UPDATE:
                var row = dataCli[index];
                if (!row) break;
                for (var k in update){
                    row[k] = update[k];
                }
                break;
            case G_CONST.DELETE:
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
        this.constructReq(G_CONST.DELETE, keys);
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

        this.signal('update');
        return data;
    };
    this.constructReq = function(method, data){
        var req = {
                api: this.modelId + method,
                reqId: Date.now()
            };
        switch(method){
            case G_CONST.INIT:
            case G_CONST.ACK:
            case G_CONST.CREATE:
            case G_CONST.UPDATE:
                req.data = data;
                break;
            case G_CONST.READ:
            case G_CONST.DELETE:
                var
                indexKeys = this.indexKeys,
                reqData = {},
                key;
                for(var i=0,l=indexKeys.length; i<l; i++){
                    key = indexKeys[i];
                    reqData[key] = data[key];
                }
                req.data = reqData;
                break;
        }
        if (G_CONST.ACK === method){
            pico.acks.push(req);
        }else{
            var bufferId = this.constructBufferId(req);
            this.localStorage.setItem(bufferId, JSON.stringify(req));
            pico.outbox[bufferId] = req;
        }
        return req;
    };
    this.constructBufferId = function(req){
        return req.api + ':' + req.reqId;
    };
});
