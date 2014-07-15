#!/usr/local/bin/node

var
fs = require('fs'),
path = require('path'),
templDir = path.dirname(process.argv[1])+'/boot/',
projectName = process.argv[2]

fs.mkdir(projectName, 0777, function(){
    (function(dirs, cb){
        if (!dirs.length) return cb()
        var next = arguments.callee
        fs.mkdir(projectName+'/'+dirs.shift(), 0777, function(){
            next(dirs, cb) 
        })
    })(['js', 'html', 'css', 'dat','js/modules'], function(){
        (function(files, cb){
            if (!files.length) return cb()
            var
            fname = files.shift()
            dest = projectName + path.sep + files.shift() + path.sep + fname
            fs.createReadStream(templDir+fname).pipe(fs.createWriteStream(dest))
            arguments.callee(files, cb)
        })(['index.html','','main.js','js','network.js','js','Router.js','js','Page.js','js','Model.js','js','Frame.js','js','frame.html','html','main.css','css'], function(){
            console.log('done')
        })
    })
    fs.symlink('../lib/', projectName+'/lib', function(){
    })
})
