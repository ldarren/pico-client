var
sep = function(session, order, next){console.log('###'); return next()},
hello=function(session, order, next){
    console.log('Hello World')
    next()
}

module.exports= {
    setup: function(context, next){
        var
        sigslot=context.sigslot,
        web=context.webServer

        sigslot.slot('*', [hello])
        next()
    }
}
