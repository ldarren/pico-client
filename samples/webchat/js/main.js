pico.def('memolize', function(){

  var
  me = this,
  messages = [],
  pushMessage = function(msg){
    messages.push(msg);
    me.signal('message');
  },
  popMessage = function(){
    return messages.pop();
  },
  main = function(){
      var
      holders = document.getElementsByClassName('holder'),
      holder;

      for(var i=0, l=holders.length; i<l; i++){
          holder = holders[i];
          pico.embed(holder, 'views/'+holder.getAttribute('templ')+'.html');
      }
  };

  pico.slot('load', main);

  me.pushMsg = pushMessage;
  me.popMsg = popMessage;
});
