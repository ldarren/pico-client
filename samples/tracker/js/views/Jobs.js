var
CONST = require('const'),
JobSummary = Backbone.View.extend({
    template: _.template(
    '<a class="glyph glyph-right icon-right-nav" href="#job/details/<%= id %>">'+
    '<div><%=(new Date(date)).toLocaleDateString()%> <%=time%></div>'+
    '<p><%=DRIVERS[driver]%> (<%=VEHICLES[vehicle]%>)<br>'+
    '<%=caller%>: <%=mobile%></p>'+
    '<div class=pickup><%=pickup%></div>'+
    '<div class=dropoff><%=dropoff%></div>'
    ),
    model: null,
    tagName: 'li',
    className: 'table-view-cell',
    initialize: function(options){
        this.model = options.model;
    },
    render: function(){
        var model = this.model;
        this.$el.html(this.template(_.extend(_.clone(CONST), this.model.attributes)));
        return this;
    }
}),
jobTpl = '<li class="table-view-cell"><a class="glyph glyph-right icon-right-plus" href="#job/create">Add a new job</a></li>',
searchPhase = ''

me.Class = Backbone.View.extend({
    template: _.template('<ul class="table-view zebra"></ul>'),
    collection: null,
    initialize: function(collection){
        this.collection = collection;

        this.listenTo(collection, 'sync', this.render);

        collection.fetch({
            url: 'tracker/job/read',
            data:{
                list: []
            }
        })
    },

    header: function(){
        return{
            title: searchPhase || 'All',
            left: ['left-nav'],
            right: ['search','plus'],
            options:[
                'job/create'
            ]
        }
    },

    render: function(){
        var
        $el = this.$el,
        models,view;

        if (searchPhase){
            var s = searchPhase.toLowerCase();
            models = this.collection.filter(function(m){
                return -1 !== m.get('pickup').toLowerCase().indexOf(s) || -1 !== m.get('dropoff').toLowerCase().indexOf(s)
            })
        }else{
            models = this.collection.models;
        }

        $el.html(this.template({}));
        var $ul = $el.find('ul');

        for(var i=0, l=models.length; i<l; i++){
            view = new JobSummary({model: models[i]});
            $ul.append(view.render().el);
        }
        $ul.append($(jobTpl));
        return this;
    },

    events: {
        'find': function(e){
            searchPhase = e._args[0];
            this.render();
        }
    }
})
