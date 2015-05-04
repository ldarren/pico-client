#!/usr/local/bin/node

var
fs = require('fs'),
path = require('path'),
Transform = require('stream').Transform,
util = require('util'),
projId = process.argv[2],
projName = process.argv[3],
projLib = process.argv[4],
replace = []

if (!projId || !projName || !projLib)
    return console.log('USAGE: '+process.argv[1]+' id name lib')

function ReplaceTransform(options){
    if (!(this instanceof ReplaceTransform)) return new ReplaceTransform(options)

    replace.push(/PROJ_ID/g, projId)
    replace.push(/PROJ_NAME/g, projName)

    Transform.call(this, options)
}
util.inherits(ReplaceTransform, Transform)

ReplaceTransform.prototype._transform = function(chunk, encoding, cb) {
    var str = 'string' === typeof chunk ? chunk : chunk.toString()
    for(var i=0,l=replace.length; i<l; i+=2){
        str = str.replace(replace[i], replace[i+1])
    }
    this.push(new Buffer(str), encoding)
    cb(null)
}

fs.readlink(process.argv[1], function(err, realPath){
    if (err) realPath = process.argv[1]
    var srcDir = path.dirname(realPath)+'/skeleton/'
    fs.mkdir(projId, 0777, function(){
        (function(dirs, cb){
            if (!dirs.length) return cb()
            var next = arguments.callee
            fs.mkdir(projId+'/'+dirs.shift(), 0777, function(){
                next(dirs, cb) 
            })
        })(['js', 'html', 'css', 'dat','js/modules'], function(){
            (function(files, cb){
                if (!files.length) return cb()
                var
                fname = files.shift()
                dest = projId + path.sep + files.shift() + path.sep + fname
                fs.createReadStream(srcDir+fname)
                .pipe(new ReplaceTransform({decodeStrings:false}))
                .pipe(fs.createWriteStream(dest))
                arguments.callee(files, cb)
            })([
                'index.html','',
                'project.json','',
                'main.js','js',
                'network.js','js',
                'Router.js','js',
                'Frame.js','js',
                'Module.js','js',
                'specMgr.js','js',
                'Model.js','js',
                ], function(){
                fs.symlink(projLib, projId+'/lib', function(){
                    console.log('done')
                })
            })
        })
    })
})
