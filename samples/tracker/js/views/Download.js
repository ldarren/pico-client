var item = '<li class="table-view-cell"><a class="glyph glyph-right icon-download" href="URL">Save Invoice As File</a></li>';
me.Class = Backbone.View.extend({
    template: _.template('<div class="card"><ul class="table-view"></ul></div>'),

    initialize: function(options){
        var
        $el = this.$el,
        model = options.model

        $el.html(this.template({}))
        var $ul = $el.find('ul')

        model.fetch({
            url: 'tracker/invoice/download',
            data:{
                startDate: options.start,
                endDate: options.end,
            },
            success: function(model, data){
                $ul.append(item.replace('URL', data.url))
            }
        })

    },

    getHeader: function(){
        return{
            title: 'Download',
            left: 'left-nav'
        }
    },

    render: function(){
        return this;
    }
})
