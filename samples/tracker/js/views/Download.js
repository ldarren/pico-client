var item = '<li class="table-view-cell"><a class="glyph glyph-right icon-download" href="URL">Download invoice</a></li>';
me.Class = Backbone.View.extend({
    template: _.template('<div class="card"><ul class="table-view"></ul></div>'),

    getHeader: function(){
        return{
            title: 'Download',
            left: 'left-nav'
        }
    },

    render: function(){
        var $el = this.$el;

        $el.html(this.template({}));
        var $ul = $el.find('ul');
        $ul.append(item.replace('URL', 'dat/invoice.xlsx'));

        return this;
    }
});
