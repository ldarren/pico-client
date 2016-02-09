#!/usr/bin/env node

const
VALID_TYPE=['ctrl','view'],
SPEC=2, PANE=3,
ID=0,TYPE=1,VALUE=2,EXTRA=3

var
fs=require('fs'),
pico=require('pico'),
projName = process.argv[2],
projConfig=`../cfg/${projName}.json`,
getPath=(spec, include)=>{
    if (-1 === VALID_TYPE.indexOf(spec[TYPE])) return false
    var path=spec[EXTRA]||spec[ID]
    if (Array.isArray(path)) path.forEach((p)=>{include.add(p)})
    else include.add(path)
    return true
},
scan=(arr, include, cb)=>{
    if (!arr || !arr.length) return cb(null, include)
    var spec=arr.pop()
    if (getPath(spec, include)){
        scan(spec[VALUE], include, (err, include)=>{
            if (err) return console.error(err)
            scan(arr, include, cb)
        })
    }else{
        scan(arr, include, cb)
    }
},
scanPane=(keys, panes, include, cb)=>{
    if (!keys || !keys.length) return cb(null, include)
    var pane=panes[keys.pop()]
    if (!pane) return scanPane(keys, panes, include, cb)
    scan(pane, include, (err, include)=>{
        if (err) return console.error(err)
        scanPane(keys, panes, include, cb)
    })
}

fs.readFile(`../cfg/${projName}.json`, 'utf8', (err, json)=>{
    if (err) return console.error(err)
    try{var config=JSON.parse(json)}
    catch(exp){return console.error(exp)}

    scan(config[SPEC], new Set, (err, include)=>{
        if (err) return console.error(err)
        console.log('spec',include)
        var
        panes=config[PANE],
        keys=Object.keys(panes)

        scanPane(keys, panes, include, (err, include)=>{
            if (err) return console.error(err)
            console.log('pane',include)

            pico.build({
                entry:'../mod/main.js',
                output:`../dist/${projName}.js`,
                include:include,
                exclude:['./bundle.js'] 
            })
        })
    })
})

