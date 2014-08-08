var
attachDeps = function(deps, cb){
    if (!deps || !deps.length) return cb()
    pico.attachFile(deps.shift(), 'js', function(){ attachDeps(deps, cb) })
},
attachStyles = function(styles, cb){
    if (!styles || !styles.length) return cb()
    var s = styles.shift()
    if ('string' === typeof s) {
        pico.attachFile(s, 'css', function(){ attachStyles(styles, cb) })
    }else{
        restyle(s, ['webkit'])
        attachStyles(styles, cb)
    }
}

pico.start({
    name: 'PROJ_NAME',
    production: false,
    paths:{
        '*': 'js/',
        html: 'html/',
        modules: 'js/modules/',
        pico: 'lib/pico/lib/',
        pageslider: 'lib/pageslider/pageslider',
    }
},function(){
    require('Module')//preload
    var
    network = require('network'),
    spec = require('spec'),
    Frame = require('Frame')

    me.slot(pico.LOAD, function(){
        network.slot('connected', function(project){
            network.create(spec.find('projURL', project.spec).value, true, function(err){
                if (err) return console.error(err)
                attachDeps(project.deps, function(){
                    attachStyles(project.styles, function(){
                        new Frame.Class({project: project})
                    })
                })
            })
        })
    })
})
