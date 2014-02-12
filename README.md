pico-client
===========

pico html5 framework

##Browser Compatibility
 * Android Browser: Fully
 * Mobile Chrome: Fully
 * Mobile Safari: Fully
 * Mobile Firefox: Fully
 * Mobile IE 10: Mostly
 * Mobile IE 9: Mostly
 * Mobile IE 7: only pico.js is compatible, most of the addons/lib are not compatible

##piDataModel
client side model name (modelId) must same as server side session name,
AND api name equal session name + method. server side session name equal client model name

##piDataNet
###setup api
```javascript
piNetData.setup({
    rate:3000,
    pushURL: http://xxxx:xxxx,
    pullURL: http://xxxxx:xxxx
});
```
