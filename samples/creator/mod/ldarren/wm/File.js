var
Module = require('Module'),
tpl = '<div class=icon draggable=true></div><div class=name></div>'

exports.Class = Module.Class.extend({
    className: 'file',
    signals: ['open'],
    deps:{
        file:'model'
    },
    create: function(deps, params){
        var file = deps.file.v
        this.el.innerHTML = tpl
        this.el.setAttribute('fileid', file.id)
        this.$('.icon').addClass('icon-'+file.icon)
        this.$('.name').text(file.name)

        this._dragging = false
    },
    events:{
        click: function(){
            this.signals.open(this.el.getAttribute('fileid')).send(this.host)
        },
        dragstart: function(e){
            e.dataTransfer.effectAllowed = 'link'
            e.dataTransfer.setData('fileid', this.el.getAttribute('fileid'))

            this.el.classList.add('dragging')
        },
        dragend: function(e){
            this._dragging = false 
            this.el.classList.remove('dragging')
        },
        dragenter: function(e){
            if (this.el.classList.contains('dragging')) return
            e.stopPropagation()
            this.el.classList.add('dragover')
        },
        dragover: function(e){
            if (this.el.classList.contains('dragging')) return
            e.preventDefault()
            e.stopPropagation()
            e.dataTransfer.dropEffect = 'link'
        },
        dragleave: function(e){
            if (this.el.classList.contains('dragging') || $(e.target).closest('.dragover').length) return
            e.stopPropagation()
            this.el.classList.remove('dragover')
        },
        drop: function(e){
            if (this._dragging) return
            e.stopPropagation()
            this.el.classList.remove('dragover')
            this.signals.open(this.el.getAttribute('fileid')+'-'+e.dataTransfer.getData('fileid')).send(this.host)
        }
    },
    slots:{
        dragleave: function(sender, e){
            if (this.el.classList.contains('dragging')) return
            this.el.classList.remove('dragover')
        }
    }
})
