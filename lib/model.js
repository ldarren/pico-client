pico.def('picoModel', function(){
    this.init = function(name, properties){
        var
        name = this.name = name,
        latestKey = this.latestKey = name + ':latest',
        localStorage = this.localStorage = window.localStorage,
        data = localStorage.getItem(name),
        latest = localStorage.getItem(latest);

        this.data = data ? JSON.parse(data) : {};
        this.latest = latest ? JSON.parse(latestKey) : {};

        for (var key in properties){
            this[key] = properties[key];
        }
    };
    this.isValid = function(){
        var keys = Object.keys(this.data);
        return keys && keys.length;
    };
    this.refresh = function(cb){
        pico.outbox.push();
        this.signal('refresh');
    };  
    this.commit = function(name, cb){
        console.log(name);
    };
    this.set = function(update){
        var
        data = this.data,
        latest = this.latest,
        storage = this.localStorage,
        value;

        for(var key in update){
            value = update[key];
            if (!data[key]) data[key] = value;
            latest[key] = value;
        }
        storage.setItem(this.name, JSON.stringify(data));
        storage.setItem(this.latestKey, JSON.stringify(latest));
    };
    this.get = function(keys){
        var
        ret = {},
        latest = this.latest,
        key;

        if (!keys || !keys.length) return ret;

        for(var i=0,l=keys.length; i<l; i++){
            key = keys[i];
            if (latest[key]){
                ret[key] = latest[key];
                continue;
            }
            ret[key] = this.data[key];
        }
        return ret;
    };
});
