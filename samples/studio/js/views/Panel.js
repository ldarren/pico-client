me.Class = Backbone.View.extend({
    tagName: 'div',
    className: 'panel',
    editor: null,
    initialize: function(args){
        this.editor = args.editor
    }
})
