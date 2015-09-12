pico-client
===========
pico web app framework

##Browser Compatibility
 * Android Browser: compatible
 * Chrome/Chromium: compatible
 * Safari: compatible
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
        "<PAGE ROUTE>":[
            [
                "<PAGE MODULES>"
            ],{
                "<PAGE SELECTOR>":"<CSS CUSTOMIZATION>"
            }
        ]
    }
]
```

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
