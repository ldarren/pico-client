var item = '<li class="table-view-cell"><a class="glyph glyph-right icon-right-nav" href="<%= url %>">NAME</a></li>';
me.Class = Backbone.View.extend({
    template: _.template('<div class="card"><ul class="table-view"></ul></div>'),

    initialize: function(collection){
    },

    getHeader: function(){
        return{
            title: 'Main'
        }
    },

    render: function(){
        var $el = this.$el;

        $el.html(this.template({}));
        var $ul = $el.find('ul');
        $ul.append(item.replace('URL', 'job/list').replace('NAME', 'Jobs'));
        $ul.append(item.replace('URL', 'report/index').replace('NAME', 'Invoice'));

        return this;
    },

    events: {
    }
});
