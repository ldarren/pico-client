function send(){
    for(var i=0,m; m=this.modules[i]; i++){
        if (-1 === this.excludes.indexOf(m)) console.log(m, this.api, arguments)
    }
}

var Com = {
    signals: ['popup', 'invalidate'],
    modules: ['a','b','c'],
    signal: function(excludes){
        return this.signals
    },
    create: function(){
        var
        temp = this.signals,
        signals = {},
        x

        for(var i=0,s; s=temp[i]; i++){
            x = function(excludes){
                arguments.callee.excludes = excludes
                return arguments.callee
            }
            x.modules = this.modules
            x.api = s
            x.send = send
            signals[s] = x
        }
        this.signals = signals
    },
    action: function(){
        this.signals.popup(['a']).send('arg1', 'arg2')
        this.signals.invalidate(['b']).send('arg1', 'arg2')
        this.signals.actions(['c']).send('arg1', 'arg2')
        // this.send(excludes, api, arguments)
    }
}

Com.create()
Com.action()
