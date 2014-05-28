var ShopBriefView = Backbone.View.extend({
    template: _.template(
    '<a class="glyph glyph-right icon-right-nav" href="<%= url %>">'+
    '<img class="media-object pull-left" src="<%= img %>">'+
    '<div class="media-body"><%= name %><p><%= tags %></p>'+
    '<% if (news) { %>'+
    '<span class="badge"><%= news %></span>'+
    '<% } %>'+
    '</div></a>'),
    model: null,
    tagName: 'li',
    className: 'table-view-cell media',
    initialize: function(options){
        this.model = options.model;
    },
    render: function(){
        var model = this.model;
        this.$el.html(this.template(_.extend({url:'#shop/'+model.id, img:'dat/img/VDL.jpg', tags:'fashion', news:3},this.model.attributes)));
        return this;
    }
});

var
captureTpl =
'<li class="table-view-cell media">'+
'<a class="glyph glyph-right icon-plus" href=#shop/capture>'+
'<div class="media-body">Add</div></a></li>',
searchPhase = '';

me.Class = Backbone.View.extend({
    template: _.template('<div class="card"><ul class="table-view"></ul></div>'),
    collection: null,
    initialize: function(collection){
        this.collection = collection;
    },

    getHeader: function(){
        return{
            left: null,
            title: searchPhase || 'All Organizations',
            right: 'search',
            options:{
                user: 'User Profile',
                'shop/create': 'Create a new shop'
            }
        }
    },

    render: function(){
        var
        $el = this.$el,
        models,view;

        if (searchPhase){
            var s = searchPhase.toLowerCase();
            models = this.collection.filter(function(m){
                return -1 !== m.get('name').toLowerCase().indexOf(s)
            });
        }else{
            models = this.collection.models;
        }

        $el.html(this.template({}));
        var $ul = $el.find('ul');

        for(var i=0, l=models.length; i<l; i++){
            view = new ShopBriefView({model: models[i]});
            $ul.append(view.render().el);
        }
        $ul.append($(captureTpl));
        return this;
    },

    events: {
        'find': function(e){
            searchPhase = e._args[0];
            this.render();
        }
    }
});
