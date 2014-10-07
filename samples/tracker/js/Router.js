var
trigger = {trigger:true},
triggerReplace = {trigger:true, replace:true},
context, inst, dirList, lastIndex, index, currPath,
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
    nav: function(url, replace){
        setTimeout(function(){
            context.navigate(url, replace ? triggerReplace : trigger)
        }, 0)
    },
    home: function(replace){ inst.nav('', replace) },
    currPath: function(){ return currPath },
    isBack: function(){ return index < lastIndex }
}

Object.freeze(inst)

// keep this instance clean, any method name used in route will be called
exports.Class = Backbone.Router.extend({
    initialize: function(){
        context = this
        dirList = []
        lastIndex = index = -1
        this.on('route', changeRoute)
    }
})

exports.instance = inst
