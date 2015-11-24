var
Module = require('Module'),
common = require('modules/common'),
linkTpl =
'<div class=card><ul class=table-view>'+
'<li class="table-view-cell media"><a class="navigate-right" href=URL><span class="media-object pull-left icon icon-ICON"></span>'+
'<div class="media-body">TITLE<p>DESC</p></div></a></li>'+
'</ul></div>'

exports.Class = Module.Class.extend({
    create: function(spec, params){
        var self = this
        this.require('invoice').value.fetch({
            data:{
                type: 5,
                from: params[0],
                to: params[1],
                userId: params[2]
            },
            success: function(coll, raw){
                self.$el.append(linkTpl.replace('URL', raw).replace('ICON', 'file-word').replace('TITLE', 'Download invoice').replace('DESC', 'Save as word document'))
            }
        })
    }
})
