// TODO: add save and load methods
var
dummyCB=function(err){if(err)return console.error(err)},
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

return {
	// config is always initialized by bb, config.comparator is consumed by bb
    initialize: function(models, config, name){
        this.name=name
        this.url = config.list
        this.lazy = config.lazy
		this.store=__.store(),
        this.model = Backbone.Model.extend({
            idAttribute: config.idAttribute || 'id',
            sync: function(method, model, options){
                if(!options.url) options.url=config[method]
                if (options.url) return Backbone.sync(method, model, options)
                return options.error(name+'.'+method+' undefined')
            }
        })
        if (config.preload) this.fetch()
    },
	load: function(key,cb){
		cb=cb||dummyCB
		var coll = this
		this.store.getItem(this.name+key,function(err,json){
			if(err) return cb(err)
			if(!json) return cb()
			try{ coll.add(JSON.parse(json)) }
			catch(exp){ return cb(exp) }
			cb(null,coll)
		})
	},
	save: function(key,cb){
		cb=cb||dummyCB
		if (!this.length) return cb()
		this.store.setItem(this.name+key, JSON.stringify(this.toJSON()),cb)
	},
	unsave: function(key,cb){
		this.store.removeItem(this.name+key,cb)
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

		if (0 === nf.length) return cb(null, coll)

		coll.fetch({
			data:{ set: nf, field:field },
			remove: false,
			success: function(coll, res){cb(null, coll, res)},
			error: function(coll, res){cb(res)}
		})
    },
    read: function(data, cb){
        var
        self=this,
        model=new this.model
        model.fetch({
            data:data,
            success:function(model, res){
                self.add(model)
                cb(null, model, res)
            },
            error:function(model, res){
                cb(res)
            }
        })
    }
}
