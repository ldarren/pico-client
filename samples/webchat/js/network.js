pico.def('memHttpClient', function(){

  var
  me = this,
  messages = [],
  pushMessage = function(msg){
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    messages.push(msg);
    me.signal('message');
  },
  popMessage = function(){
    return messages.pop();
  };

  me.pushMsg = pushMessage;
  me.popMsg = popMessage;
});
