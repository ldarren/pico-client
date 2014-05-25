var ShopBriefView = Backbone.View.extend({
    template: _.template(
    '<a class="navigate-right" href="<%= url %>">'+
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

var createButton =
'<li class="table-view-cell media">'+
'<a class="navigate-right" href=#newShop>'+
'<span class="media-object pull-left icon icon-plus"></span>'+
'<div class="media-body">Create</div></a></li>';

me.Class = Backbone.View.extend({
    template: _.template('<div class="card"><ul class="table-view"></ul></div>'),
    collection: null,
    initialize: function(collection){
        this.collection = collection;
    },

    render: function(){
        var
        $el = this.$el,
        models = this.collection.models,
        view;

        $el.html(this.template({}));
        var $ul = $el.find('ul');

        for(var i=0, l=models.length; i<l; i++){
            view = new ShopBriefView({model: models[i]});
            $ul.append(view.render().el);
        }
        $ul.append($(createButton));
        return this;
    }
});
