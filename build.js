#!/usr/bin/env node

const args = require('pico-args')

const defaults = {
	bundles:['proj:main,bundle1,bundle2','bundle name, comma separated if more than one'],
	wd:['.','working directory'],
	main:['main','path to main directory'],
	cfg:['cfg','path to configuration directory'],
	bin:['bin','path to binary/output directory'],
	lean:[true,'embed lean library'],
	pico:[true,'embed pico library'],
	help:[false,'show this help']
}
const opt = args.parse(defaults)
if (!opt || opt.help || !opt.bundles) return args.usage(defaults)
args.print('build options', opt)

const fs = require('fs')
const path = require('path')
const CleanCSS = require('clean-css')

const ID = 0, TYPE = 1, VALUE = 2, EXTRA = 3, EXTRA2 = 4
[
    srcDir,
    destDir,
    {
        entry: [mainDir, mainjs],
        deps: deps,
        include: include,
        exclude: exclude,
        replace: replace
    },
    {
        entry: [mainDir, bundlejs],
        deps: deps,
        include: include,
        exclude: exclude,
        replace: replace
    }
]
