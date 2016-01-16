var READ = 'SELECT `id`, `k` FROM `hash`;';

var
picoObj =require('pico/obj'),
KEYS, VALS,
client

return {
    setup: function(context, cb){
        client=context.mainDB
        client.query(READ, function(err, result){
            if (err) return cb(err)
            KEYS = picoObj.keyValues(result, 'id', 'k')
            VALS = picoObj.keyValues(result, 'k', 'id')
            cb()
        })
    },
    key: function(v){ return KEYS[v] },
    val: function(k){ return VALS[k] },
    keys: function(){ return KEYS },
    vals: function(){ return VALS },
    replace: function(arr1, arr2){
        return picoObj.map(arr1.concat(arr2),KEYS,'k','v')
    },
    verify: function(keys, index){
        var unknown=[]
        for(var i=0,k; k=keys[i]; i++){
            if(VALS[k]) continue
            if (-1 !== index.indexOf(k)) unknown.push(k)
        }
        return unknown
    }
}
