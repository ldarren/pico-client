#!/usr/bin/env node
const ID = 0,TYPE = 1,VALUE = 2,EXTRA = 3

const args = require('pico-args')

const defaults = {
	bundle:['', 'bundle name, comma separated if more than one, optional colon sperates input and output filename'],
	wd:['.','working directory'],
	out: ['', 'output directory'],
	main:['main','path to main directory'],
	cfg:['cfg','path to configuration directory'],
	env:['dev','environment file to be bundled'],
	bin:['bin','path to binary/output directory'],
	lean:[true,'embed lean library'],
	pico:[true,'embed pico library'],
	global:['', 'global variables, common separated if more than one'],
	help:[false,'show this help']
}
const opt = args.parse(defaults)
if (!opt || opt.help || !opt.bundle) return args.usage(defaults)
args.print('build options', opt)

const path = require('path')
const fs = require('fs')
const cwd = path.resolve(process.cwd(), opt.wd)

function setAdd(set, ele){
	if (!ele) return
	if (Array.isArray(ele)) ele.forEach(set.add)
	else set.add(ele)
}

/**
 * add file path to be included in bundle
 *
 * @param {array} spec - module spec
 * @param {array} include - file paths to be included
 * @returns {boolean} - true to drill down
 */
function getPath(spec, include){
	switch(spec[TYPE]){
	case 'file':
	case 'type':
		include.add(spec[VALUE])
		return false
	case 'view':
		setAdd(include, spec[EXTRA] || spec[ID])
		return true
	case 'list':
	case 'map':
	case 'model':
		return true
	default:
		setAdd(include, spec[EXTRA])
		return false
	}
}

function scanObj(obj, include, cb){
	if (!obj) return cb(null, include)

	const keys = Object.keys(obj)
	if (!keys.length) return cb(null, include)

	scan(keys.map(k => obj[k] ), include, cb)
}

function scan(arr, include, cb){
	if (!Array.isArray(arr) || !arr.length) return cb(null, include)

	const spec = arr.shift()
	if (!Array.isArray(spec) || !spec.length) return scan(arr, include, cb)

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
		try {
			fs.mkdirSync(curDir, access)
		} catch (exp) {
			if ('EEXIST' !== exp.code) throw exp
		}

		return curDir
	}, arr.shift())
}

function deps(){
	const deps = []
	opt.lean && deps.push(path.join('lib','lean','lean.min.js'))
	opt.pico && deps.push(path.join('lib','common','pico.min.js'))
	return deps
}

function addBundle(output, entry, deps, exclude){
	const json = fs.readFileSync(path.resolve(cwd, opt.cfg, entry[0] + '.env.json'))
	const spec = JSON.parse(json)

	scan(spec, new Set, (err, include) => {
		const json = fs.readFileSync(path.resolve(cwd, opt.cfg, entry[0] + '.json'))
		const spec = JSON.parse(json)

		scan(spec, include, (err, include) => {
			output.push({
				entry: entry[1],
				deps,
				include: [...include],
				exclude
			})
		})
	})
}

const bundleNames = opt.bundle.split(',')
const [mainCfg, mainEntry = mainCfg] = bundleNames.shift().split(':')

let out = [mainCfg, opt.main]
if (opt.out){
	out = opt.out.split(path.sep)
}
mkdirPSync([cwd, opt.bin, ...out], 0o755)

const output = [
	cwd,
	opt.main,
	path.join(opt.bin, ...out),
]

addBundle(output, [mainCfg, mainEntry], deps())

bundleNames.forEach(bundleName => {
	const [cfgName, entryName = cfgName] = bundleName.split(':')
	addBundle(output, [cfgName, entryName], void 0, [entryName])
})

const handler = {get(target,name){
	switch(name){
	case 'load':
	case 'ajax': return null
	case 'getElementById': return () => ({dataset:{ build: opt.env}})
	default: return () => {}
	}
}}

// global
pico = require('pico-common/bin/pico-cli')
__ = window = document = new Proxy({}, handler)
opt.global.split(',').forEach(g => {
	global[g] = __
})
const pBuild = pico.export('pico/build')
pBuild(output)
