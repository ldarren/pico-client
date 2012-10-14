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
  onStart = function(){
      var
      holders = document.getElementsByClassName('holder'),
      holder;

      for(var i=0, l=holders.length; i<l; i++){
          holder = holders[i];
          pico.embed(holder, 'views/'+holder.getAttribute('templ')+'.html');
      }

      document.addEventListener("deviceready", function(){
          document.addEventListener("menubutton", onMenuBtn, false);
          document.addEventListener("backbutton", onBackBtn, false);
          document.addEventListener("searchbutton", onSearchBtn, false);
          document.addEventListener("online", onOnline, false);
          document.addEventListener("offline", onOffline, false);
          document.addEventListener("pause", onPause, false);
          document.addEventListener("resume", onResume, false);
      }, false);
  },
  onMenuBtn = function(){ alert('menu'); },
  onBackBtn = function(){ console.log('back'); },
  onSearchBtn = function(){ console.log('search'); },
  onOnline = function(){ console.log('online123'); },
  onOffline = function(){ console.log('offline'); },
  onPause = function(){ console.log('pause'); },
  onResume = function(){ console.log('resume'); };

  pico.slot('load', onStart);

  me.pushMsg = pushMessage;
  me.popMsg = popMessage;
});
