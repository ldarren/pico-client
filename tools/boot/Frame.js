var
Router = require('Router'),
tpl = require('@html/frame.html')

me.Class = Backbone.View.extend({
    el: 'body',
    project: null,
    initialize: function(args){
        this.el.innerHTML = tpl.text

        var 
        p = this.project = args.project,
        r = Router.instance = new Router.Class(p.routes)

        r.on('route', this.changeRoute, this)

        Backbone.history.start()
    },

    changeRoute: function(path, params){
        this.render()
    },

    render: function(){
    }
})
