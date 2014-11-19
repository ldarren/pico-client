var
Module = require('Module'),
tpl = require('@ld/wm/window.html'),
open = function(){
    var self = this
    this.$el.show();
    this.$el.addClass('opening');
    this.$el.bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
        self.$el.removeClass('opening');
        focus.call(self)
    });
},
close = function(){
    var self = this
    this.blur()
    this.$el.addClass('closing');
    this.$el.bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
        self.$el.removeClass('closing');
        self.$el.addClass('closed');
        self.$el.hide();

        //self.$content.html('');
    });
},
focus = function(){
    this.signals.focus().send(this.host);
    this.$el.addClass('active');
    this.$el.removeClass('inactive');
},
blur = function(){
    this.signals.blur().send(this.host);
    this.$el.removeClass('active');
    this.$el.addClass('inactive');
}

exports.Class = Module.Class.extend({
    className: 'wm-window',
    signals: ['focus', 'blur'],
    deps:{
        title: 'title',
        width: 'width',
        height: 'height',
        x: 'x',
        y: 'y',
        z: 'z',
        content: 'content',
        movable: 'movable',
        resizable: 'resizable',
        widget: 'widget',
        titlebar: 'titlebar'
    },
    create: function(deps, params){
        this.title = deps.title.v || 'Untitle Window'
        this.el.innerHTML = tpl.text.replace('TITLE', this.title)

        this.$el.width(deps.width.v || 400)
        this.$el.height(deps.height.v || 200)

        this.$el.css('left', deps.x.v || 0)
        this.$el.css('top', deps.y.v || 0)
        this.$el.css('z-index', deps.z.v || 10000)

        this.content = deps.content.v || ''
        this.movable = deps.movable.v || true
        this.resizable = deps.resizable.v || true
        this.widget = deps.widget.v || false
        this.titlebar = deps.titlebar.v || true
        this._active = false

        open.call(this)
    },
    slots:{
        open: open,
        close: close,
        focus: focus,
        blur: blur
    }
})
