pico-client
===========
pico app framework

##Browser Compatibility
 * Android Browser: compatible
 * Chrome/Chromium: compatible
 * Safari: compatible
 * Safari ios: compatible
 * Firefox: compatible
 * IE 11: compatible
 * IE 10 and below: not compatible

##Project Configuration
```json
[
    [
        "<JAVASCRIPT DEPENDENCIES>"
    ],[
        "<CSS DEPENDENCIES>"
    ],[
        "<FRAME MODULES DECLARATION>"
    ],{
        "<PANE NAME>":[
            [
                "<PANE MODULES DECLARATION>"
            ]
        ]
    },
	[
		["<PAGE ROUTE>,"<PANE NAME 1>",...,"<PANE NAME n>"]
	]
]
```

##Asynchronous module definition
```javascript
var
dep1 = require('vendorA/dep1'),
dep2 = require('vendorB/dep2')

this.load=function(){
    dep1.doSeomthing()
    dep2.doSomething()
}
```
##Caveat
###sub-module readiness
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
##Features
* support circular dependencies
* syntax similar to commonjs and amd, easy to pickup
* support static and dynamic javascript loading
* data driven architecture
