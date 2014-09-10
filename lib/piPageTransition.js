// query = tag#id
exports.addFrame: function(query, url, holder){
    holder = holder || document.body
    var frame = holder.querySelector(query)
    if (!frame){
        var tagid = query.split('#')
        frame = document.createElement(tagid[0])
        frame.id = tagid[1]
        holder.appendChild(frame)
    }
    this.embed(frame, url)
}
// effects = {opacity:[0,1,'1s'], left:['0%','100%','0.1s'], property:[startVal, endVal,duration,timing-function,delay]}
exports.changeFrame: function(query, url, effects, holder){
    holder = holder || document.body
    var
    frame = holder.querySelector(query),
    te = envs.transitionEnd

    if (!frame || !te) return this.addFrame(query, url, holder)

    var
    style = frame.style,
    keys = Object.keys(effects),
    properties=[],durations=[],tfuncs=[],delays=[],
    vl,key,value,
    onTransitEnd = function(evt){
        frame.removeEventListener(te, onTransitEnd)

        pico.embed(frame, url, function(err){
            if (err) return console.error(err)

            for(var i=0,l=keys.length; i<l; i++){
                key = keys[i]
                value = effects[key]
                style[key] = value[1]
            }
        })
    }

    frame.addEventListener(te, onTransitEnd, false)

    for(var i=0,l=keys.length; i<l; i++){
        key = keys[i]
        value = effects[key]
        vl = value.length
        if (vl < 3) {
            frame.removeEventListener(te, onTransitEnd)
            return console.error('invalid effect:'+value)
        }
        style[key] = value[0]
        properties.push(key)
        durations.push(value[2])
        if (vl > 3) tfuncs.push(value[3]) 
        if (vl > 4) delays.push(value[4]) 
    }
    
    style['-webkit-transition-property'] = style['transition-property'] = properties.join(' ')
    style['-webkit-transition-duration'] = style['transition-duration'] = durations.join(' ')
    if (tfuncs.length) style['-webkit-transition-timing-function'] = style['transition-timing-function'] = tfuncs.join(' ')
    if (delays.length) style['-webkit-transition-delay'] = style['transition-delay'] = delays.join(' ')
}
