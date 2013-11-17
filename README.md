pico-client
===========

pico html5 framework

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
