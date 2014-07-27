#!/usr/local/bin/node

var
fs = require('fs'),
path = require('path'),
Transform = require('stream').Transform,
util = require('util'),
srcDir = path.dirname(process.argv[1])+'/boot/',
projDir = process.argv[2],
projId = process.argv[3],
projName = process.argv[4],
projURL = process.argv[5],
projLib = process.argv[6]

if (!projDir || !projId || !projName || !projSvr || !projLib)
    return console.log('USAGE: '+process.argv[1]+' dir_name projId projName lib_path')

function ReplaceTransform(options){
    if (!(this instanceof ReplaceTransform)) return new ReplaceTransform(options)

    this.replace = {
        PROJ_NAME: projName,
        PROJ_ID: projId,
        PROJ_URL: projURL
    }

    Transform.call(this, options)
}
util.inherits(ReplaceTransform, Transform)

ReplaceTransform.prototype._transform = function(chunk, encoding, cb) {
    console.log('chunk: '+chunk.length)
    this.push(chunk, encoding)
    cb(null)
}

fs.mkdir(projDir, 0777, function(){
    (function(dirs, cb){
        if (!dirs.length) return cb()
        var next = arguments.callee
        fs.mkdir(projDir+'/'+dirs.shift(), 0777, function(){
            next(dirs, cb) 
        })
    })(['js', 'html', 'css', 'dat','js/modules'], function(){
        (function(files, cb){
            if (!files.length) return cb()
            var
            fname = files.shift()
            dest = projDir + path.sep + files.shift() + path.sep + fname
            fs.createReadStream(srcDir+fname)
            .pipe(new ReplaceTransform({decodeStrings:false}))
            .pipe(fs.createWriteStream(dest))
            arguments.callee(files, cb)
        })([
            'index.html','',
            'main.js','js',
            'network.js','js',
            'Router.js','js',
            'Frame.js','js',
            'Page.js','js',
            'Module.js','js',
            'spec.js','js',
            'Model.js','js',
            'frame.html','html'
            ], function(){
            fs.symlink(projLib, projDir+'/lib', function(){
                console.log('done')
            })
        })
    })
})
