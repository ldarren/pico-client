var
role = {
    11:'New User',
    21:'Customer',
    31:'Driver',
    41:'Admin',
    101:'Super Admin'
}

exports.hash = function(raw){
    var hash = 2574;
    if (raw.length == 0) return hash;
    for (var i=0,c; c=raw.charCodeAt(i); i++){
        hash = ((hash<<5)-hash)+c;
        hash = hash & hash; // Convert to 32bit integer
    }
    return btoa(hash.toString(36))
}

exports.getRoleDesc = function(type){ 
    if (101 == type) return 'Super Admin'
    return role[type] || 'Unknown role'
}
exports.getRole = function(){ return role }

exports.getLang = function(){ return 'en-SG' }
exports.getDateFormat = function(){ return {weekday:'short', year:'numeric', month:'short', day:'numeric'} }
