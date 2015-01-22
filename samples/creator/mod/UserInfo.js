var
tpl = require('@mod/View.html')

exports.Class = {
    signals: [],
    deps: {
        owner:'models',
        data:'models'
    },
    create: function(deps){
        var
        fields = [],
        info = deps.data.get(deps.owner.at(0).id).get('json')

        fields.push({label:'Name', value:info['name']})
        fields.push({label:'Tel', value:info['tel']})
        fields.push({label:'Email', value:info['email']})

        this.el.innerHTML = _.template(tpl.text, {fields:fields, actions:[]})
    },
    slots: {
    }
}
