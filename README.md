# pico-client
pico app framework

## Example
[An obligatory Todo App](https://cdn.rawgit.com/ldarren/pico-example-todo/master/bin/todo/index.html) to demotrate the framework. The example source code can be found [here](https://github.com/ldarren/pico-example-todo)

## Browser Compatibility
 * Android Browser: compatible
 * Chrome/Chromium: compatible
 * Safari: compatible
 * Safari ios: compatible
 * Firefox: compatible
 * IE 11: compatible
 * IE 10 and below: not compatible

## Features
### Data Driven
A pico client is data driven, meaning that the application structure is not defined by script but by data. The data file is in json file format. The data file format is closely assemble to lisp syntax. for example

```json
["name", "type", "content", "meta data"]
```

and the example of a complete project file
```json
[
    ["component1", "view", [
    	["moduleA", "view", []],
	["moduleB", "view", []]
    ]],
    ["component2", "view", []]
]
```

### Lazy Load At Component Level
```javascript
var
dep1 = require('vendorA/dep1'),
dep2 = require('vendorB/dep2')

this.load=function(){
    dep1.doSeomthing()
    dep2.doSomething()
}
```

### Decentralized Configuration
pico archieved decentralized configuration by making spec files joinable during runtime.

A spec file with a entry point (a special js file) can be compiled to a bundle file, the build script generate single .js file based on the configuration file and the entry point

to add external spec to current spec, use dynamic `require` load the external spec and `spawn` to render it

```javascript
require('/path/to/external/spec', (err, spec) => {
	if (err) return console.error(err)
	this.spawn(specMgr.create('id-here', 'view', [], spec))
})
```

Complete example at `example/bundle`

#### Create bundle
```
npx pclient-build
```

### Manage environment config with dependency injection
move environment dependant config to a separate config file, inject the env config to main config in the main js file
```javascript
    var specMgr= require('p/specMgr')
    var View= require('p/View')
    var project = require('cfg/xin.json')
    var env = require('cfg/dev.json')
    var main

    return function(){
        specMgr.load(null, null, project, function(err, spec){
            if (err) return console.error(err)
            main = new View
            main.spawnBySpec(spec, null, env)
        })
    }
```

### Code Spliting
Code spliting is done at the project file level, each bundle can hae it own project file and project can be load lazily during runtime

### Support circular dependencies
pico-client supported asynchronous module loading, therefore no circular dependencies issue

### Syntax similar to commonjs and amd, easy to pickup
syntax of pico-client is heavely burrow from commonjs and amd to reduce learning curve

### Support recursive view component
for recursive view component such tree view
```javascript
// tree-node.js
return {
	deps: {
		'tree_node': 'view', // self referencing
	},
	create(deps, params){
		this.spawn(deps.tree_node) // or, this.spawn(deps.tree_node, null, [deps.tree_node.splice(0, 3)]]
	}
}
```

## Caveat
### sub-module readiness
pico modules are loaded in series orderly, what it means is module declared at top always load first and pico ensure it is loaded completely before loading the next module.
One caveat is submodule may not ready during event call. for example project configuration as follow
```json
[
	["modA","view",[
		["modA-subA","view",[]]
	]],
	["modB","view",[]]
]
```
if modB event call modA immediately in create function, modA-subA may not ready when modA receive the event. modA should listen to moduleAdded emitted by modA-subA before using any functionality from modA-subA

### External editable static property
ModuleA
```javascript
var obj={
	a:1,
	print:function(){
		console.log(obj.a)
	}
}
return obj
```
if ModuleA.print method was call in ModuleB
```javascript
var modA=require('ModuleA')
modA.print() // 1
```
what if ModuleA.a was changed in ModuleB?
```javascript
var modA=require('ModuleA')
modA.a='hello'
modA.print() // 1
```
print result is still 1, that's because 'hello' is set on modA placeholder, to make ModuleA.a an editable property, make this changes to ModuleA
```javascript
var modA=require('ModuleA')
var obj={
	a:1,
	print:function(){
		console.log(modA.a)
	}
}
return obj
```
