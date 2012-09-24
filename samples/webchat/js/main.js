pico.def('memolize', function(me){

  var
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
});
