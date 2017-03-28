//TODO: streaming data from store, use for large collection
var
store=__.store(),
fetch=function(coll,set,idx,cb){
	if (idx<0) return cb(null,set)
	coll.lazyFetch(set[idx--],function(err,model){
		if (err) return cb(err)
		if (!model) return fetch(coll,set,idx,cb)
		set.splice(idx+1,1)
		coll.add(model)
		fetch(coll,set,idx,cb)
	})
},
lazyFetch=function(valid,coll,set,cb){
	if (!valid) return cb(null,set)
	fetch(coll,set,set.length-1,cb)
}

function LazyModels(opt){
}           

_.extend(LazyModels.prototype, Backbone.Events, {
	lazyFetch: function(id,cb){
		cb()
    },
	//TODO: read from lazy fetch b4 reading from network
    retrieve: function(ids, field, cb){
		var id=this.model.idAttribute
		switch(arguments.length){
		case 3: break
		case 2:
			cb=field
			field=id
			break
		default: return console.error('invalid args',arguments)
		}

        var
        coll = this,
        criteria = {},
        search = (field === id) ? function(n){return !coll.get(n)} : function(n){criteria[field] = n; return !coll.findWhere(criteria)},
        nf = _.filter(_.without(_.uniq(ids), undefined, null), search)

		lazyFetch(coll.lazy===field,coll,nf,function(err,set){
			if (err) return cb(err)
			if (0 === set.length) return cb(null, coll)

			coll.fetch({
				data:{ set: set, field:field },
				remove: false,
				success: function(coll, res){cb(null, coll, res)},
				error: function(coll, res){cb(res)}
			})
		})
    }
})

return LazyModels
