var tpl = require('@mod/View.html')

exports.Class = {
    signals: [],
    deps: {
        owner:'models',
        data:'models'
    },
    create: function(deps){
        var
        fields = [], actions = [],
        info = deps.data.get(deps.owner.at(0).id).get('json')

        fields.push({label:'Name', value:info['name']})
        fields.push({label:'Tel', value:info['tel']})
        fields.push({label:'Email', value:info['email']})

        actions.push({name:'signout', icon:'', text:'Sign out'})

        this.el.innerHTML = _.template(tpl.text, {fields:fields, actions:actions})
    },
    slots: {
    },
    events: {
        'click button[name=signout]': function(e){
            if (confirm('Are you sure?')) this.deps.owner.reset()
        }
    }
}
