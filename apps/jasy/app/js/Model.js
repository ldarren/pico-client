return Backbone.Collection.extend({
	// config is always initialized by bb, config.comparator is consumed by bb
    initialize: function(models, config, name){
        this.name=name
        this.url = config.list
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
    retrieve: function(ids, field, cb){
        var
        coll = this,
        criteria = {},
        search
        
        if (3 === arguments.length){
            search = function(n){criteria[field] = n; return !coll.findWhere(criteria)}
        }else{
            cb = field
            field = 'id'
            search = function(n){return !coll.get(n)}
        }
        var nf = _.filter(_.without(_.uniq(ids), undefined, null), search)

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
})