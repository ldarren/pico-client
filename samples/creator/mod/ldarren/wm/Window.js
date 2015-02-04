var
tpl = require('@ld/wm/window.html'),
open = function(){
    var self = this
    this.$el.show();
    this.signals.opened().send(self.host);
    this.$el.addClass('opening');
    this.$el.bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
        self.$el.removeClass('opening');
    })
console.log('open window: '+this._id)
},
close = function(){
    var self = this
    this.$el.addClass('closing');
    this.$el.bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
        self.$el.removeClass('closing');
        self.$el.addClass('closed');
        self.$el.hide();
        self.signals.closed().send(self.host);

        //self.$content.html('');
    })
},
enable = function(){
    this.$el.removeClass('disabled')
},
disable = function(){
    this.$el.addClass('disabled')
},
focus = function(from, sender, index){
    this.setZ(index)
    this.$el.addClass('active')
    this.$el.removeClass('inactive')
    this.signals.focused().send(this.host)
},
blur = function(from, sender, index){
    this.setZ(index)
    this.$el.removeClass('active')
    this.$el.addClass('inactive')
    this.signals.blurred().send(this.host)
}

exports.Class = {
    className: 'wm-window',
    signals: ['opened', 'closed', 'focus', 'focused', 'blurred'],
    deps:{
        title: 'text',
        width: 'number',
        height: 'number',
        x: 'number',
        y: 'number',
        z: 'number',
        content: '*',
        pinned: 'bool',
        fixed: 'bool',
        widget: 'bool'
    },
    create: function(deps){
        this.el.innerHTML = tpl.text.replace('TITLE', deps.title || 'Untitle Window')

        this.instId = deps.instId

        this.setX(deps.x || 0)
        this.setY(deps.y || 0)
        this.setZ(deps.z || 10000)
        this.setW(deps.width || 400)
        this.setH(deps.height || 200)

        this.$content = this.$('.wm-content')
        this.$toolbar = this.$('header')
        if (deps.content) this.$content.append(deps.content)
        deps.widget ? this.$toolbar.addClass('hide') : this.$toolbar.removeClass('hide')
        deps.pinned ? this.$el.removeClass('movable') : this.$el.addClass('movable')
        deps.fixed ? this.$el.removeClass('resizable') : this.$el.addClass('resizable')

        this._resizing = null
        this._moving = null
    },
    slots:{
        open: open,
        close: close,
        enable: enable,
        disable: disable,
        focus: focus,
        blur: blur,
        mousemove: function(from, sender, e){
            if (this._moving){
                this.setX(e.pageX - this._moving[0])
                this.setY(e.pageY - this._moving[1])
            }
            if (this._resizing){
                this.setW(e.pageX + this._resizing[0])
                this.setH(e.pageY + this._resizing[1])
            }
        },
        mouseup: function(from, sender, e){
            if (this._moving){
                this._moving = null
                this.$el.removeClass('move')
            }
            if (this._resizing){
                this._resizing = null
                this.$el.removeClass('resizing')
            }
        }
    },
    events:{
        'click .wm-window-title button.wm-close': function(e){
            e.stopPropagation()
            e.preventDefault()
            close.call(this)
        },
        'mousedown': function(e){
            this.signals.focus().send(this.host)
        },
        'mousedown .wm-window-title': function(e){
            if(!this.isEnable() || !this.isMovable()) return

            this._moving = [
                e.pageX - this.getX(),
                e.pageY - this.getY()
            ]

            this.$el.addClass('move')

            e.preventDefault()
        },
        'mousedown button.wm-resize': function(e){
            if(!this.isEnable() || !this.isResizable()) return

            this._resizing = [
                this.getW() - e.pageX,
                this.getH() - e.pageY
            ]

            this.$el.addClass('resizing')

            e.preventDefault()
        }
    },

    getX: function(){ return parseInt(this.$el.css('left'), 10) },
    getY: function(){ return parseInt(this.$el.css('top'), 10) },
    getZ: function(){ return parseInt(this.$el.css('z-index'), 10) },
    getW: function(){ return this.$el.width() },
    getH: function(){ return this.$el.height() },
    setX: function(val){ this.$el.css('left', val) },
    setY: function(val){ this.$el.css('top', val) },
    setZ: function(val){ this.$el.css('z-index', val) },
    setW: function(val){ this.$el.width(val) },
    setH: function(val){ this.$el.height(val) },

    isFocus: function(){ return this.$el.hasClass('active') },
    isEnable: function(){ return !this.$el.hasClass('disable') },
    isMovable: function(){ return this.$el.hasClass('movable') },
    isResizable: function(){ return this.$el.hasClass('resizable') },
    isWidget: function(){ return this.$toolbar.hasClass('hide') },
}
