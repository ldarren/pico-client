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
                type: 4,
                from: params[0],
                to: params[1]
            },
            success: function(coll, raw){
                self.$el.append(linkTpl.replace('URL', raw).replace('ICON', 'file-excel').replace('TITLE', 'Download income report').replace('DESC', 'Save as excel spreadsheet'))
            }
        })
    }
})
