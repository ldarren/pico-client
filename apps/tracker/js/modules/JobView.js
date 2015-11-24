var
Module = require('Module'),
Router = require('Router'),
tpl = require('@html/View.html'),
common = require('modules/common')

exports.Class = Module.Class.extend({
    create: function(spec){
        var
        job = this.require('job').value,
        data = this.require('data').value,
        detail = job.get('json'),
        fields = [], actions = []

        this.job = job 
        this.data = data 
        fields.push({label:'Customer', value:common.userDesc(data,job.get('createdBy'))}) 
        fields.push({label:'Pickup', value:detail.pickup}) 
        fields.push({label:'Date',  value:detail.date}) 
        fields.push({label:'Time', value:detail.time}) 
        fields.push({label:'Reason', value:common.jobTypeDesc(detail.reason)}) 
        fields.push({label:'Dropoff', value:detail.dropoff}) 
        fields.push({label:'Payment', value:common.paymentTypeDesc(detail.payment)}) 
        fields.push({label:'Charge', value:detail.charge}) 
        fields.push({label:'Vehicle', value:common.vehicleDesc(data, detail.vehicle)}) 
        fields.push({label:'Driver', value:common.userDesc(data,detail.driver)}) 
        fields.push({label:'Status', value:common.jobStateDesc(job.get('job'))}) 
        fields.push({label:'Code', value:job.get('code')}) 

        actions.push({icon:'btn-negative', name:'forget', text:'Forget'})

        this.$el.html(_.template(tpl.text, {fields:fields, actions:actions}))
    },
    events: {
        'click button[name=forget]': 'forget'
    },
    forget: function(e){
        this.data.remove(this.job.id)
        Router.instance.back()
    }
})
