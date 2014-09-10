var
trigger = {trigger:true},
triggerReplace = {trigger:true, replace:true},
changeRoute = function(path){
    lastIndex = index 
    if (path === dirList[index-1]){
        index = index-1
    }else{
        dirList.length = index+1
        dirList.push(path)
        index = dirList.length-1
    }
},
inst, dirList, lastIndex, index

exports.Class = Backbone.Router.extend({
    initialize: function(){
        inst = this
        dirList = []
        lastIndex = index = -1
        this.on('route', changeRoute)
    },
    nav: function(url, replace){
        setTimeout(function(context){
            context.navigate(url, replace ? triggerReplace : trigger)
        }, 0, this)
    },
    home: function(replace){
        this.nav('', replace)
    },
    isBack: function(){
       return index < lastIndex 
    }
})
exports.instance = function(){return inst}
Object.freeze(exports)
