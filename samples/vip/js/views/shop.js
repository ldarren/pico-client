var model;

me.Class = Backbone.View.extend({
    template: _.template(
    '<div class="scroller">' +
        '<div class="robot">' + 
        '<img src="<%= img %>"/>' +
        '<h2><%= name %></h2>' +
        '<p><%= description %></p>' +
        '</div>' +
    '</div>'),

    tagName: 'div',

    initialize: function(options){
        model = options.model;
    },

    attributes: function(){
        return {
            class: 'card'
        }
    },

    render: function(){
        this.$el.html(this.template(model.attributes));
        return this;
    }
});
