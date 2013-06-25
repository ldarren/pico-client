pico.def('picTween', 'picBase', function(){
    var me = this;

    me.update = function(elapsed, entities){
        var
        myName = me.moduleName,
        e, tweenOpt, keys, targetName, targetOpt, params, n, nl, p, pl, sign, current, target, rate;

        for (var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            tweenOpt = e.getComponent(myName);

            keys = Object.keys(tweenOpt);
            for(n=0, nl=keys.length; n<nl; n++){
                targetName = keys[n];
                params = tweenOpt[targetName];

                targetOpt = e.getComponent(targetName);

                for(p=0,pl=params.length; p<pl; p++){
                    param = targetOpt[params[p]];
                    current = param[0];
                    target = param[1];
                    rate = param[2];
                    if (current === target) continue;
                    sign = target > current ? 1 : -1;
                    current += sign * rate * elapsed;
                    if (sign !== target > current ? 1 : -1){
                        current = target;
                    }
                    param[0] = current;
                }
            }
        }
    };
});
