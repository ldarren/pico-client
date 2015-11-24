var
Module = require('Module'),
Router = require('Router'),
tpl = require('@html/View.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    create: function(spec){
        var
        user = this.require('user').value.attributes,
        owner = this.require('owner').value,
        data = this.require('data').value,
        mi = data.get(owner.models[0].id),
        detail = user.json,
        fields = [], actions = []

        if (mi.id === user.id || (common.isAdminAbove(mi.get('user')) && !common.isSuperAbove(user.user))) this.triggerHost('changeHeader', {title:detail.name, right:['edit']})

        this.user = user
        this.owner = owner
        fields.push({label:'Name', value:detail.name}) 
        fields.push({label:'Phone', value:detail.tel, url:'tel:'+detail.tel}) 
        fields.push({label:'Email', value:detail.email, url:'mailto:'+detail.email}) 
        fields.push({label:'Role', value:common.roleDesc(user.user)}) 
        fields.push({label:'Join Date', value:(new Date(user.createdAt)).toLocaleDateString(common.getLang(), common.getDateFormat())})

        if (mi.id === user.id) actions.push({icon:'btn-negative', name:'signout', text:'Sign out'})

        this.$el.html(_.template(tpl.text, {fields:fields, actions:actions}))
    },
    moduleEvents: function(evt, sender){
        switch(evt){
        case 'edit': Router.instance.go('user/edit/'+this.user.id); break
        default: Module.Class.prototype.moduleEvents.apply(this, arguments)
        }
    },
    events: {
        'click button[name=signout]': 'signout'
    },
    signout: function(e){
        if (this.user.id === this.owner.models[0].id) this.owner.reset()
    }
})
