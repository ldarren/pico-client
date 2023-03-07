#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const Transform = require('stream').Transform
const util = require('util')
const argv=process.argv
const me = argv[1]

// eslint-disable-next-line
if (3 > argv.length) return console.log(`USAGE: ${me} path [project_name] [display_name]`)

const projPath = argv[2]
const projName = argv[3] || path.basename(projPath)
const dispName = argv[4] || projName
const replace = []

function ReplaceTransform(options){
	if (!(this instanceof ReplaceTransform)) return new ReplaceTransform(options)

	replace.push(/PROJ_NAME/g, projName)
	replace.push(/DISP_NAME/g, dispName)

	Transform.call(this, options)
}
util.inherits(ReplaceTransform, Transform)

ReplaceTransform.prototype._transform = function(chunk, encoding, cb){
	let str = 'string' === typeof chunk ? chunk : chunk.toString()
	for(let i=0,l=replace.length; i<l; i+=2){
		str = str.replace(replace[i], replace[i+1])
	}
	this.push(Buffer.from(str), encoding)
	cb(null)
}

function symlink(fs, from, to, ln){
	fs.symlinkSync(path.relative(to,from), path.resolve(to, ln))
}

function nearest(searchPath, target, cb){
	fs.access(path.resolve(searchPath, target), fs.constants.R_OK, err => {
		if (err) return nearest(path.resolve(searchPath, '..'), target, cb)
		cb(searchPath)
	})
}

fs.readlink(me, (err, realPath)=>{
	if (err) realPath = me
	if (!path.isAbsolute(realPath)) realPath = path.resolve(path.dirname(me), realPath)
	realPath=path.dirname(realPath)
	const sdkDir = path.resolve(realPath,'sdk')
	fs.mkdir(projPath, 0o755, ()=>{
		(function(dirs, cb){
			if (!dirs.length) return cb()
			const next = arguments.callee
			fs.mkdir(path.resolve(projPath,dirs.shift()), 0o755, ()=>{
				next(dirs, cb)
			})
		})(['mod','main','cfg','lib','bin','dat'], ()=>{
			(function(files, cb){
				if (!files.length) return cb()
				const
					fname = files.shift(),
					dest = path.resolve(projPath, files.shift(), files.shift()||fname)
				fs.createReadStream(path.resolve(sdkDir,fname))
					.pipe(new ReplaceTransform({decodeStrings:false}))
					.pipe(fs.createWriteStream(dest))
				arguments.callee(files, cb)
			})([
				'index.html','',null,
				'project.json','cfg', `${projName}.json`,
				'env.json','cfg', `${projName}.dev.json`,
				'main.js','main',`${projName}.js`
			], ()=>{
				const projLib=path.resolve(projPath,'lib')
				symlink(fs, path.resolve(realPath,'lib'), projLib, 'pico')

				const NODE_MOD = 'node_modules'
				nearest(projPath, path.join(NODE_MOD, 'lean-wrap', 'bin'), nodePath => {
					if (!nodePath) return console.error(`failed to get ${NODE_MOD} dir`)
					symlink(fs, path.resolve(nodePath, NODE_MOD, 'lean-wrap', 'bin'), projLib, 'lean')
					symlink(fs, path.resolve(nodePath, NODE_MOD, 'pico-common', 'bin'), projLib, 'common')
					symlink(fs, path.resolve(nodePath, NODE_MOD, 'pojs', 'lib'), projLib, 'pojs')
					// eslint-disable-next-line
					console.log('Done')
				})
			})
		})
	})
})
