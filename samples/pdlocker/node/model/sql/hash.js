var READ = 'SELECT `id`, `k` FROM `hash`;';

var
sc =require('pico/obj'),
KEYS, VALS,
client

module.exports = {
    setup: function(context, cb){
        client=context.mainDB
        client.query(READ, function(err, result){
            if (err) return cb(err)
            KEYS = sc.keyValues(result, 'id', 'k')
            VALS = sc.keyValues(result, 'k', 'id')
            cb()
        })
    },
    toKey: function(v){ return KEYS[v] },
    toVal: function(k){ return VALS[k] },
    keys: function(){ return KEYS },
    vals: function(){ return VALS },
    verify: function(keys, index){
        var unknown=[]
        for(var i=0,k; k=keys[i]; i++){
            if(VALS[k]) continue
            if (-1 !== index.indexOf(k)) unknown.push(k)
        }
        return unknown
    }
}
