var model;

me.Class = Backbone.View.extend({
    template: _.template(
        '<div class="card">'+
        '<ul class="table-view">'+
        '<li class="table-view-cell table-view-divider">Divider</li>'+
        '<li class="table-view-cell">Item 1</li>'+
        '<li class="table-view-cell">Item 2</li>'+
        '<li class="table-view-cell">Item 3</li>'+
        '<li class="table-view-cell">Item 4</li>'+
        '</ul>'+
        '</div>'),

    initialize: function(options){
        model = options.model;
    },

    getHeader: function(){
        return {
            left: 'left-nav',
            right: 'search',
            options: {
                Scan: 'OCR Scanner'
            }
        }
    },

    render: function(){
        this.$el.html(this.template(model.attributes));
        return this;
    }
});
