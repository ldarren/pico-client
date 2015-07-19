var
onStateChange = function(evt){
    pico.signal(pico.STATE_CHANGE, [pico.getState(), evt.state])
},
onHashChange = function(evt){
    var newHash='', oldHash=''
    if (evt.oldURL) oldHash = evt.oldURL.substring(1) || ''
    if (evt.newURL) newHash = evt.newURL.substring(1) || ''
    else newHash = window.location.hash.substring(1) || ''
    pico.signal('hashChange', [oldHash, newHash])
}

me.changeState= function(uri, desc, userData){
    var search = '?'
    for (var key in uri){
        if (!key) continue
        search += key + '=' + uri[key] + '&'
    }
    // remove last & symbol
    history.pushState(userData, desc, search.substr(0, search.length-1))
    if ('webkitTransitionEnd' !== __.env.transitionEnd){
        onStateChange({})
    }
}
me.getState= function(){
    var
    search = location.search.substring(1), // remove leading ?
    pairs = search.split('&'),
    pair, obj={}
    for (var i=0, l=pairs.length; i<l; i++){
        pair = pairs[i].split('=')
        if (!pair[0]) continue
        obj[pair[0]] = pair[1]
    }
    return obj
}
me.changeHash= function(hash){
    window.location.hash = '#' + hash
}

window.addEventListener('popstate', onStateChange, false)
window.addEventListener('hashchange', onHashChange, false)
