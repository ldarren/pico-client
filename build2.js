#!/usr/bin/env node

const ID = 0,TYPE = 1,VALUE = 2,EXTRA = 3,EXTRA2 = 4

const args = require('pico-args')

const defaults = {
	bundle:['', 'bundle name, comma separated if more than one'],
	wd:['.','working directory'],
	main:['main','path to main directory'],
	cfg:['cfg','path to configuration directory'],
	bin:['bin','path to binary/output directory'],
	lean:[true,'embed lean library'],
	pico:[true,'embed pico library'],
	help:[false,'show this help']
}
const opt = args.parse(defaults)
if (!opt || opt.help || !opt.bundle) return args.usage(defaults)
args.print('build options', opt)

const path = require('path')
const fs = require('fs')
const CleanCSS = require('clean-css')
const cwd = path.resolve(process.cwd(), opt.wd)

function getPath(spec, include){
	switch(spec[TYPE]){
	case 'file':
		include.add(spec[VALUE])
		return false
	case 'view':
	case 'ctrl':
		const path = spec[EXTRA] || spec[ID]
		if (Array.isArray(path)) path.forEach(p => include.add(p))
		else include.add(path)
		return true
	case 'map':
	case 'list':
		return true
	}
	return false
}

function scanObj(obj, include, cb){
    if (!obj) return cb(null, include)
	
	const keys = Object.keys(obj)
    if (!keys.length) return cb(null, include)

	scan(keys.map(k => obj[k] ), include, cb)
}

function scan(arr, include, cb){
    if (!arr || !Array.isArray(arr) || !arr.length) return cb(null, include)

    const spec = arr.shift()

    if (getPath(spec, include)){
		if ('map' === spec[TYPE]){
			return scanObj(spec[VALUE], include, (err, include) => {
				if (err) return cb(err)
				scan(arr, include, cb)
			})
		}

        return scan(spec[VALUE], include, (err, include) => {
            if (err) return cb(err)
            scan(arr, include, cb)
        })
    }
    scan(arr, include, cb)
}

function mkdirPSync(arr, access) {
	arr.reduce((parentDir, childDir) => {
		const curDir = path.resolve(parentDir, childDir)
		try { fs.mkdirSync(curDir, access) }
		catch (exp) { if ('EEXIST' !== exp.code) throw exp }

		return curDir
	}, arr.shift())
}

function deps(){
	const deps = []
	opt.lean && deps.push(path.resolve(cwd,'lib','lean','lean.min.js'))
	opt.pico && deps.push(path.resolve(cwd,'lib','common','pico.min.js'))
	return deps
}

function addBundle(output, entry, deps, exclude){
	let json = fs.readFileSync(path.resolve(cwd, opt.cfg, entry[0] + '.json'))
	const spec = JSON.parse(json)
	json = JSON.stringify(spec)

	scan(spec, new Set, (err, include) => {
		output.push({
			entry,
			deps,
			include,
			exclude, 
			replace:{
				[ path.join(opt.cfg, entry[0] + '.json') ]: json
			}
		})
	})
}

const bundleNames = opt.bundle.split(',')
const [mainCfg, mainEntry = mainCfg] = bundleNames.shift().split(':')

mkdirPSync([cwd, opt.bin, mainCfg, opt.main], 0o755)

const output = [
	path.resolve(cwd, opt.main),
	path.resolve(cwd, opt.bin, mainCfg, opt.main),
]

addBundle(output, [mainCfg, mainEntry], deps())

bundleNames.forEach(bundleName => {
	const [cfgName, entryName = cfgName] = bundleName.split(':')
	addBundle(output, [cfgName, entryName])
})

const handler = {get(target,name){
	switch(name){
	case 'load':
	case 'ajax': return null
	default: return () => {}
	}
}}

// global
pico = require('pico-common/bin/pico-cli.js')
const pBuild = pico.export('pico/build')
__ = window = document = new Proxy({}, handler)

pBuild(output)
