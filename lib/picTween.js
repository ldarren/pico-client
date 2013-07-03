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
    updatedEntities = [];

    // key = 'picAudio'
    me.getValues = function(ent, key){
        var  com = ent.getComponent(myName);
        return com[key];
    };

    me.update = function(elapsed, evt, entities){
        var
        time = elapsed * 0.001,
        e, tweenOpt, keys,
        targetName, targetOpt, dirty,
        params, paramName, n, nl, pk, p, pl, sign, current, target;

        updatedEntities.length = 0;

        for (var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            tweenOpt = e.getComponent(myName);
            dirty = false;
            keys = Object.keys(tweenOpt);
            for(n=0, nl=keys.length; n<nl; n++){
                targetName = keys[n];
                params = tweenOpt[targetName];
                pk = Object.keys(params);

                targetOpt = e.getComponent(targetName);

                for(p=0,pl=pk.length; p<pl; p++){
                    paramName = pk[p];
                    param = params[paramName];
                    target = targetOpt[paramName];
                    current = param[VALUE];
                    if (current === target) continue;
                    sign = target > current ? 1 : -1;
                    current += sign * param[RATE] * time;
                    if (sign !== (target > current ? 1 : -1)){
                        current = target;
                    }
                    param[VALUE] = current;
                    dirty = true;
                }
            }
            if (dirty) updatedEntities.push(e);
        }
        return updatedEntities;
    };
});
