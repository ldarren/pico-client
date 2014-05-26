me.Class = Backbone.View.extend({
    template: _.template('<div class="card"><ul class="table-view"></ul></div>'),
    initialize: function(){
    },

    render: function(){
        var
        $el = this.$el,
        view;

        $el.html(this.template({}));
        var $ul = $el.find('ul');
        return this;
    }
});
