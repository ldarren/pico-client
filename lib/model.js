pico.def('picoModel', function(){
    this.refresh = function(cb){
        pico.outbox.push({});
    };  
    this.commit = function(name, cb){
        console.log(name);

    };
    this.set = function(update, cb){
    };
    this.get = function(keys, cb){
        var
        key;

        for(var i=0,l=keys.length; i<l; i++){
            key = keys[i];
        }
    };
});
