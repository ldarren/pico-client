pico.def('picoModel', function(){
    // modelId = 'players'
    // index = ['playerId']
    // ref = {userId: 36546}, optional, player is depended on user
    this.init = function(modelId, indexKeys, ref){
        var
        localStorage = this.localStorage = window.localStorage,
        keySvr = this.keyServer = modelId,
        keyCli = this.keyClient = modelId + ':cli',
        dataSvr = localStorage.getItem(keySvr), // contain server side value
        dataCli = localStorage.getItem(keyCli); // contain all the changes

        this.indexKeys = indexKeys;
        this.dataServer = dataSvr ? JSON.parse(dataSvr) : {};
        this.dataClient = dataCli ? JSON.parse(dataCli) : {};
        this.data = {};
        this.ref = ref;

        if (ref){
            this.constructReq(G_CONST.INIT, this.ref);
        }

        this.constructData();
        this.signal('update');
    };
    this.sync = function(method, res){
        var
        indexKeys = this.indexKeys,
        dataSvr = this.dataServer,
        dataCli = this.dataClient,
        index = this.constructIndex(res),
        storage = this.localStorage,
        bufferId = this.constructBufferId(res);

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
                rowSvr = dataSvr[index],
                rowCli = dataCli[index],
                update = res.data;
                for (var key in update){
                    rowSvr[key] = update[key];
                    delete rowCli[key];
                }
                break;
            case G_CONST.DELETE:
                delete dataSvr[index];
                delete dataCli[index];
                break;
        }
        storage.deleteItem(bufferId);
        delete pico.outbox[bufferId];
        storage.setItem(this.keyServer, JSON.stringify(dataSvr));
        this.constructReq(G_CONST.ACK, {ack: res.res.Id});
        this.constructData();
    };
    this.request = function(method, update){
        var ret = this.set(method, update);
        if (!ret) return ret;

        this.constructReq(method, update);
    };
    this.set = function(method, update){
        var
        dataCli = this.dataClient,
        storage = this.localStorage,
        index = this.constructIndex(update),
        value;

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
        this.signal('update');
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
            rows.push(dataSvr[index]);
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
        for (var key in indexKeys){
            value = data[key];
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
        key, value;

        for (key in dataSvr){
            data[key] = dataSvr[key];
        }

        for (key in dataCli){
            data[key] = dataCli[key];
        }
        return data;
    };
    this.constructReq = function(method, data){
        var req = {
                modelId: this.modelId,
                method: method,
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
                data = {}
                for(var key in indexKeys){
                    data[key] = data[key];
                }
                break;
        }
        var bufferId = this.constructBufferId(req);
        this.localStorage.setItem(bufferId, JSON.stringify(req));
        pico.outbox[bufferId] = req;
        return req;
    };
    this.constructBufferId = function(req){
        return req.modelId + ':' + req.method + ':' + req.reqId;
    };
});
