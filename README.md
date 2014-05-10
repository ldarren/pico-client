pico-client
===========

pico html5 framework

##Browser Compatibility
 * Android Browser: Fully compatible
 * Mobile Chrome: Fully compatible
 * Mobile Safari: Fully compatible
 * Mobile Firefox: Fully compatible
 * Mobile IE 11: Fully compatible
 * Mobile IE 10: Mostly compatible
 * Mobile IE 9: Mostly compatible
 * Mobile IE 7 and below: not compatible

##Asynchronous module definition
```javascript
inherit('pico/base');
var dep1 = require('vendorA/dep1');
var dep2 = require('vendorB/dep2');

function onLoad(){
    dep1.doSeomthing();
    dep2.doSomething();
}

pico.slot(pico.LOAD, onLoad);
```
Features
* support circular dependencies
* support javascript in file or embeded to html
* similar to common.js or node.js

##Reactor Programming

##Optimised for canvas
