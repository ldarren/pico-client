me.Class = Backbone.View.extend({
    editor: null,
    initialize: function(options){
        var editor = ace.edit(options.id)
        editor.setTheme(options.theme || 'ace/theme/monokai')
        this.editor = editor
    },

    load: function(text, type){
        this.editor.setSession(ace.createEditSession(text, 'ace/mode/'+type))
    },

    read: function(){
        return this.editor.getSession().toString()
    }
})
