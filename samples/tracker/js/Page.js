var Module = require('Module')

exports.Class = Module.Class.extend({
    create: function(spec, params){
        for(var i=0,s; s=spec[i]; i++){
            if ('module' === s.type) {
                this.proxy(s, params, this)
            }
        }
    },
    render: function(){
        return this.el
    },
    moduleEvents: function(){
        var params = Array.prototype.slice.call(arguments)

        switch(params[0]){
        case 'invalidate': this.drawModule.apply(this, params.slice(1)); break
        default:
            var sender = params.splice(1, 1)
            this.triggerAll(params, sender)
            break
        }
    },
    drawModule: function(mod){
        if (!mod) return

        var 
        $el = this.$el,
        r = this.readiness,
        ms = this.modules,
        index = ms.indexOf(mod),
        i,l

        r[index] = 1
        // all previous modules readied?
        for(i=0,l=index+1; i<l; i++){
            if (undefined === r[i]) return
        }
        // render all readied modules in seq
        for(i=0,l=r.length; i<l; i++){
            switch(r[i]){
            case 0: break
            case 1:
                r[i] = 0
                $el.append(ms[i].render())
                break
            default: return
            }
        }
    }
})
