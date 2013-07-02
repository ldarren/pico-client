/*
component format:
{
    picRect: {
        x: [0, 1], // current Value and rate
        head: [0, 0.5]
    },
    picAudio: {
        volume: [1, 0.1]
    }
}
 */
pico.def('picTween', 'picBase', function(){
    var
    me = this,
    VALUE = 0,
    RATE = 1,
    myName = me.moduleName,
    updatedEntities = [],
    picBase = Object.getPrototypeOf(me);

    // key = 'picAudio'
    me.getValues = function(ent, key){
        var  com = ent.getComponent(myName);
        return com[key];
    };

    me.update = function(elapsed, evt, entities){
        var
        e, tweenOpt, keys,
        targetName, targetOpt, dirty,
        params, n, nl, p, pl, sign, current, oldCurrent, target, rate;

        updatedEntities.length = 0;

        for (var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            tweenOpt = e.getComponent(myName);
            dirty = false;
            keys = Object.keys(tweenOpt);
            for(n=0, nl=keys.length; n<nl; n++){
                targetName = keys[n];
                params = tweenOpt[targetName];

                targetOpt = e.getComponent(targetName);

                for(p=0,pl=params.length; p<pl; p++){
                    paramName = params[p];
                    param = targetOpt[paramName];
                    current = oldCurrent = param[CURRENT];
                    target = param[TARGET];
                    if (current === target) continue;
                    rate = param[RATE];
                    sign = target > current ? 1 : -1;
                    current += sign * rate * elapsed;
                    if (sign !== target > current ? 1 : -1){
                        current = target;
                    }
                    picBase.signal(picBase.DISPLAY_UPDATE, [e, myName, paramName, current, oldCurrent]);
                    param[CURRENT] = current;
                    dirty = true;
                }
            }
            if (dirty) updatedEntities.push(e);
        }
        return updatedEntities;
    };
});
