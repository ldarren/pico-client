var
trigger = {trigger:true},
triggerReplace = {trigger:true, replace:true},
context, dirList, lastIndex, index, currPath,
changeRoute = function(path){
    currPath = path
    lastIndex = index 
    if (path === dirList[index-1]){
        index = index-1
    }else{
        dirList.length = index+1
        dirList.push(path)
        index = dirList.length-1
    }
},
inst = {
    go: function(url, replace){
        window.setTimeout(function(){
            // BUG: android reverse the replace url
            // http://stackoverflow.com/questions/15193359/does-android-support-window-location-replace-or-any-equivalent
            context.navigate(url, trigger)//, replace ? triggerReplace : trigger)
        }, 0)
    },
    back: function(step){
        window.history.go(step || -1)
    },
    home: function(replace){ inst.go('', replace) },
    currPath: function(){ return currPath },
    isBack: function(){ return index < lastIndex }
}

Object.freeze(inst)

// keep this instance clean, any method name used in route will be called
module.exports={
    Class: Backbone.Router.extend({
        initialize: function(paths){
            context = this
            dirList = []
            lastIndex = index = -1
            this.on('route', changeRoute)
            for(var i=0,p; p=paths[i]; i++){
                context.route(p, p)
            }
        }
    }),

    instance: inst
}
