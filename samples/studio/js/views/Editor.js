me.Class = Backbone.View.extend({
    editor: null,
    initialize: function(args){
        var editor = ace.edit(args.id)
        editor.setTheme(args.theme || 'ace/theme/monokai')
        this.editor = editor
    },

    load: function(text, type){
        this.editor.setSession(ace.createEditSession(text, 'ace/mode/'+type))
    },

    read: function(){
        return this.editor.getSession().toString()
    },

    insert: function(text){
        var e = this.editor
        e.getSession().insert(e.getCursorPosition(), text)
    }
})
