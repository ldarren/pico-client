var Job = require('models/Job')

me.slot(pico.LOAD, function(){
    me.Class = Backbone.Collection.extend({
        model: Job.Class,
        url: 'tracker/job/read'
    })
})
