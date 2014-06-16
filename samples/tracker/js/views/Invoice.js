var Transaction = Backbone.View.extend({
    template: _.template(
    '<div><span><%=time%></span><span>$<%=charge%></span></div>'+
    '<div><span><%=pickup%></span><span><%=dropoff%></span></div>'
    ),
    model: null,
    tagName: 'li',
    className: 'table-view-cell',
    initialize: function(options){
        this.model = options.model;
    },
    render: function(){
        var model = this.model;
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

var
route = require('route'),
dayTpl = '<div class="card"><ul class="table-view"><li class="table-view-cell table-view-divider">DATE</li></ul></div>',
searchPhase = '';

me.Class = Backbone.View.extend({
    template: _.template('<div class="card"><ul class="table-view"></ul></div>'),
    startDate: null,
    endDate: null,
    initialize: function(options){
        var self = this;
        self.startDate = options.start;
        self.endDate = options.end;
        options.collection.fetch({
            data:{
                start: options.start,
                end: options.end,
            },
            success: function(collections, data){
                var
                $el = self.$el,
                models = collections.models,
                view;

                $el.html(self.template({}));
                var $ul = $el.find('ul');

                for(var i=0, l=models.length; i<l; i++){
                    view = new Transaction({model: models[i]});
                    $ul.append(view.render().el);
                }
            }
        })
    },

    getHeader: function(){
        return {
            title: 'Invoice',
            left: 'left-nav',
            options:['#download']
        }
    },

    render: function(){
        return this
    },

    events: {
        'download': function(e){
            route.instance.navigate('report/invoice/download/'+this.startDate+'/'+this.endDate, {trigger:true});
        }
    }
})
