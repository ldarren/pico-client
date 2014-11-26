var
role = {
    11:'New User',
    21:'Customer',
    31:'Driver',
    41:'Admin',
//    101:'Super Admin'
},
jobType = {
    1: 'Arrival',
    2: 'Departure',
    3: 'Disposal',
    4: 'Events',
    5: 'Fit',
    6: 'Group Tour',
    7: 'Transfer',
    8: 'Wedding',
    9: 'World Holiday',
    10: 'Others',
},
jobState = {
    10: 'Open',
    20: 'Scheduled',
    30: 'Started',
    40: 'Stopped',
    50: 'Closed',
    100: 'Canceled',
},
paymentType = {
    1: 'Cash',
    2: 'Credit'
}
invoiceType = {
    1: 'View Invoice',
    2: 'Download Invoice',
    3: 'Download Report'
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

exports.roleDesc = function(type){ 
    if (101 == type) return 'Super Admin'
    return role[type] || 'Unknown role'
}
exports.getJobState = function(state, role){
    switch(parseInt(role)){
    case 21:
        switch(state){
        case 10: return {10:jobState[10],100:jobState[100]}
        case 20: return {20:jobState[20],100:jobState[100]}
        case 30: return {30:jobState[30]}
        case 40: return {40:jobState[40]}
        default: return {}
        }
        break
    case 31:
        switch(state){
        case 20: return {20:jobState[20],30:jobState[30]}
        case 30: return {30:jobState[30],40:jobState[40]}
        case 40: return {40:jobState[40]}
        default: return {}
        }
        break
    case 41:
    case 101:
        switch(state){
        case 10: return {10:jobState[10], 20:jobState[20], 100:jobState[100]}
        case 20: return {20:jobState[20], 30:jobState[30], 100:jobState[100]}
        case 30: return {30:jobState[30], 40:jobState[40], 100:jobState[100]}
        case 40: return {40:jobState[40], 50:jobState[50]}
        default: return {}
        }
        break
    default: return {}
    }
}
exports.jobStateDesc = function(state){ return jobState[state]}
exports.getJobType = function(){ return jobType }
exports.jobTypeDesc = function(type){ return jobType[type] }
exports.getPaymentType = function(){ return paymentType }
exports.paymentTypeDesc = function(type){ return paymentType[type] }
exports.getRole = function(){ return role }
exports.getVehicles = function(data){
    var v = {}
    data.where({type:'vehicle'}).forEach(function(m){
        v[m.id] = m.get('json').tag
    })
    return v
}
exports.vehicleDesc = function(data, id){
    var m = data.get(id)
    if (!m) return ''
    return m.get('json').tag
}
exports.getDrivers = function(data){
    var d = {}
    data.where({type:'user', user:'31'}).forEach(function(m){
        d[m.id] = m.get('json').name
    })
    return d
}
exports.driverDesc = function(data, id){
    var d = data.get(id)
    if (!d) return ''
    return d.get('json').name
}
exports.isCustomer = function(role){ return 21 == role }
exports.isAdminAbove = function(role){ return role > 40 }
exports.isDriverAbove = function(role){ return role > 30 }
exports.isSuperAbove = function(role){ return role > 100 }
exports.viewableRoles = function(role){
    switch(parseInt(role)){
    case 31: return [31, 41]
    case 41:
    case 101: return [11, 21, 31, 41, 101]
    default: return [41]
    }
}
exports.viewablePages = function(role){
    switch(parseInt(role)){
    case 21:
    case 31: return ['users','jobs','jobHistory','settings'] 
    case 41: 
    case 101: return ['users','jobs','jobHistory','vehicles','expenses','invoice/pick','settings']
    default: return ['users','jobs', 'settings']
    }
}
exports.getInvoiceType = function(){
    return invoiceType
}
exports.getLang = function(){ return 'en-SG' }
exports.getDateFormat = function(){ return {weekday:'short', year:'numeric', month:'short', day:'numeric'} }
