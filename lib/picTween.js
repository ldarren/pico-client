/*
component format:
{
    picRect: { // current value, content auto generated
        x: 0,
        head: 0
    },
    @picRect: { // rate of changing, '@' auto added
        x: 1,
        head: 0.5
    },
    picAudio: {
        volume: 1
    },
    @picAudio: {
        volume: 0.1
    }
}
 */
pico.def('picTween', 'picBase', function(){
    var
    me = this,
    PREFIX = '@',
    name = me.moduleName,
    updatedEntities = [];

    me.create = function(ent, com){
console.log('picTween.me.create');
        var
        keys = Object.keys(com),
        targetName, target, paramKeys, params, paramName, currentValues,
        j, jl;

        for (var i=0, l=keys.length; i<l; i++){
            targetName = keys[i];
            params = com[targetName];
            if ('object' !== (typeof params)){
                console.error(name+'. param: '+targetName+' is not an object. type:'+(typeof params));
                continue;
            }
            paramKeys = Object.keys(params); 
            currentValues = {};
            target = ent.getComponent(targetName);

            if (!target) {
                console.error(name+'. component: '+targetName+' not found');
                continue;
            }

            for(j=0, jl=paramKeys.length; j<jl; j++){
                paramName = paramKeys[j];
                currentValues[paramName] = target[paramName];
            }
            com[targetName] = currentValues;
            com[PREFIX+targetName] = params;
        }
        return com;
    };

    // key = 'picAudio'
    me.getByEntity = function(ent, key){
console.log('picTween.me.getByEntity');
        var  com = ent.getComponent(name);
        return me.get(com, key);
    };

    me.get = function(com, key){
console.log('picTween.me.get');
        return com[key];
    };

    me.update = function(elapsed, evt, entities){
console.log('picTween.me.update');
        var
        time = elapsed * 0.001,
        e, tweenOpt, keys,
        targetName, targetOpt, dirty,
        params, paramName, n, nl, pk, p, pl, sign, current, target, rates, rate, delta;

        updatedEntities.length = 0;

        for (var i=0, l=entities.length; i<l; i++){
            e = entities[i];
            tweenOpt = e.getComponent(name);
            if (!tweenOpt) continue;
            dirty = false;
            keys = Object.keys(tweenOpt);
            for(n=0, nl=keys.length; n<nl; n++){
                targetName = keys[n];
                if (PREFIX === targetName.charAt(0)) continue; // rate value
                params = tweenOpt[targetName];
                rates = tweenOpt[PREFIX + targetName];
                pk = Object.keys(params);

                targetOpt = e.getComponent(targetName);

                for(p=0,pl=pk.length; p<pl; p++){
                    paramName = pk[p];
                    current = params[paramName];
                    target = targetOpt[paramName];
                    rate = rates[paramName];
                    delta = target - current;
                    if (delta*delta <= rate) {
                        current = target;
                        continue;
                    }
                    sign = target > current ? 1 : -1;
                    current += sign * rate * time;
                    if (sign !== (target > current ? 1 : -1)){
                        current = target;
                    }
                    params[paramName] = current;
                    dirty = true;
                }
                if (!dirty) me.signal('stop', [this, e, evt, targetName]);
            }
            if (dirty) updatedEntities.push(e);
        }
        return updatedEntities;
    };
});
