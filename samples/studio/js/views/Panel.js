exports.Class = Backbone.View.extend({
    tagName: 'div',
    className: 'panel',
    initialize: function(args){
        this.editor = args.editor
    }
})
