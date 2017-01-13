const
READ = 'SELECT `v`, `k` FROM `hash`;',
pObj =require('pico/obj')

let KEYS, VALS, client

module.exports = {      
    setup(context, cb){
        client=context.mainDB
        client.query(READ, function(err, result){
            if (err) return cb(err)
            KEYS = pObj.keyValues(result, 'v', 'k')
            VALS = pObj.keyValues(result, 'k', 'v')
            cb()
        })              
    },
    key(v){ return KEYS[v] },
    val(k){ return VALS[k] },
    keys(vals){
		const ret=[]
		for(let i=0,v; v=vals[i]; i++){
			ret.push(KEYS(v))
		}
		return ret
	},
    vals(keys){
		const ret=[]
		for(let i=0,k; k=keys[i]; i++){
			ret.push(VALS(k))
		}
		return ret
	},
    replace(arr1, arr2){
        return pObj.map(arr1.concat(arr2),KEYS,'k','v')
    },
    verify(keys, index){
        const unknown=[]  
        for(let i=0,k; k=keys[i]; i++){
            if(VALS[k]) continue
            if (-1 !== index.indexOf(k)) unknown.push(k)
        }
        return unknown  
    }
}
