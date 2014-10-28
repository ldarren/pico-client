var Module = require('Module')

exports.Class = Module.Class.extend({
    className: 'ldwmIcon icon',
    tagName:'li',
    signals: [],
    requires:{
        'icon':'icon'
    },
    create: function(requires, params){
    },
    slots:{
    }
})
