exports.Class = Backbone.Collection.extend({
    initialize: function(models, config){
		config = config || {}
        var self = this
        this.url = config.list
        this.model = Backbone.Model.extend({
            idAttribute: config.idAttribute || 'id',
            comparator: config.comparator || 'id',
            sync: function(method, model, options){
                if (options.data && self.data){
                    options.data = _.extend(options.data, self.data)
                }
                var url = config[method]
                if (url){
                    options.url = url
                    return Backbone.sync(method, model, options)
                }
                return options.success()
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
            success: function(coll, raw){cb(null, coll, raw)},
            error: function(coll, raw){cb(raw)}
        })
    }
})
