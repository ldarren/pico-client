var tpl = require('@mod/Edit.html')

exports.Class = {
    signals: [],
    deps: {
        owner:'models'
    },
    tagName: 'form',
    create: function(deps){
        var fields = []

        fields.push({label:'Username', type:'text'})
        fields.push({label:'Password', type:'password'})
        fields.push({label:'Confirm password', type:'password'})
        fields.push({label:'Name', type:'text'})
        fields.push({label:'Tel', type:'tel'})
        fields.push({label:'Email', type:'email'})

        this.el.innerHTML = _.template(tpl.text, {fields:fields, hidden:hidden})
    },
    slots: {
        'ok': function(e){
            alert('ok')
        },
        'cancel': function(e){
            alert('cancel')
        }
    }
}
