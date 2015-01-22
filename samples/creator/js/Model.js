exports.Class = Backbone.Collection.extend({
    initialize: function(models, config){
        this.config = config
        this.model = Backbone.Model.extend({
            idAttribute: config.idAttribute || 'id',
            sync: this.sync
        })
        if (config.preload) this.fetch()
    },
    sync: function(method, cont, options){
        var c = this.config || this.collection.config
        options.channel = c.channel
        var url = options.url || cont.model ? c.list : c[method]
        if (url){
            options.url = url
            return Backbone.sync(method, cont, options)
        }
        return options.success()
    },
    retrieve: function(ids, cb){
        var
        coll = this,
        nf = _.filter(_.without(_.uniq(ids), undefined), function(n){return !coll.get(n)})
        if (0 === nf.length) return cb(null, coll)
        coll.fetch({
            data:{ set: nf },
            remove: false,
            success: function(coll, raw){cb(null, coll)},
            error: function(coll, raw){cb(raw)}
        })
    }
})
