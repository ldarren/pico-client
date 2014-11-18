var Module = require('Module')

exports.Class = Module.Class.extend({
    className: 'window',
    signals: [],
    deps:{
        title: 'title',
        width: 'width',
        height: 'height',
        x: 'x',
        y: 'y',
        content: 'content',
        movable: 'movable',
        resizable: 'resizable',
        widget: 'widget',
        titlebar: 'titlebar'
    },
    create: function(deps, params){
        this.title: deps.title.v || 'Untitle Window',
        this.width: deps.width.v || 400,
        this.height: deps.height.v || 200,
        this.x: deps.x.v || 0,
        this.y: deps.y.v || 0,
        this.content: deps.content.v || '',
        this.movable: deps.movable.v || true,
        this.resizable: deps.resizable.v || true,
        this.widget: deps.widget.v || false,
        this.titlebar: deps.titlebar.v || true
    },
    slots:{
    }
})
