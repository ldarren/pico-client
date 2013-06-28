pico.def('picTween', 'picBase', function(){
    var
    me = this,
    myName = me.moduleName,
    picBase = Object.getPrototypeOf(me);

    me.update = function(elapsed, entities){
        var
        e, tweenOpt, keys,
        targetName, targetOpt,
        params, n, nl, p, pl, sign, current, oldCurrent, target, rate;

        for (var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            tweenOpt = e.getComponent(myName);

            keys = Object.keys(tweenOpt);
            for(n=0, nl=keys.length; n<nl; n++){
                targetName = keys[n];
                params = tweenOpt[targetName];

                targetOpt = e.getComponent(targetName);

                for(p=0,pl=params.length; p<pl; p++){
                    paramName = params[p];
                    param = targetOpt[paramName];
                    current = oldCurrent = param[0];
                    target = param[1];
                    if (current === target) continue;
                    rate = param[2];
                    sign = target > current ? 1 : -1;
                    current += sign * rate * elapsed;
                    if (sign !== target > current ? 1 : -1){
                        current = target;
                    }
                    picBase.signal(picBase.DISPLAY_UPDATE, [e, myName, paramName, current, oldCurrent]);
                    param[0] = current;
                }
            }
        }
    };
});
