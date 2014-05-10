var
ACCURACY = 15,
watchId,
geohashes,
optionHi = {maximumAge:1000, timeout:30000, enableHighAccuracy:false},
optionLo = {maximumAge:1000, timeout:30000, enableHighAccuracy:false};

// latlong to binary
function reduce(input, output){
    var center = (input[1] + input[2]) * 0.5;
    
    if (input[0] > center){
        output.push(1);
        input[1] = center;
        return 1;
    }
    output.push(0);
    input[2] = center;
    return 0;
}
// base32hex
function stringify(bitfield){
    for(var i=bitfield.length-1, c=0, value=0, text=''; i>-1; c++, i--){
        value += bitfield[i] << c;
        if (29 === c){
            text = value.toString(32) + text;
            c = -1;
            value = 0;
        }
    }
    if (value){
        text = value.toString(32) + text;
    }
    return text;
}
function stringifyAll(mat){
    geohashes = [];
    var
    row, vec, x, xl;

    for(var y=0, yl=mat.length; y<yl; y++){
        vec = mat[y];
        row = [];
        for(x=0,xl=vec.length; x<xl; x++){
            row.push(stringify(vec[x]));
        }
        geohashes.push(row);
    }
    return geohashes;
}
// latitude then longitude
// position=1, negative=0
function hash(lat, lng, accuracy){
    var
    bitfield=[],
    data = [ [lat, -90, 90], [lng, -180, 180] ];
    
    for(var i=0; i<accuracy; i++){
        reduce(data[0], bitfield);
        reduce(data[1], bitfield);
    }
    
    return bitfield;
}
// return top, left, height, width
function boundary(lat, lng, accuracy){
    var
    bitfield=[],
    data = [ [lat, -90, 90], [lng, -180, 180] ],
    dataLat = data[0],
    dataLng = data[1];
    
    for(var i=0; i<accuracy; i++){
        reduce(dataLat, bitfield);
        reduce(dataLng, bitfield);
    }
    
    return [dataLat[2], dataLng[1], dataLat[2]-dataLat[1], dataLng[2]-dataLng[1]];
}
function peer(bitfield, relLat, relLng){
    var
    lng = bitfield.pop(),
    lat = bitfield.pop(),
    maskLat = 1 < relLat,
    maskLng = 1 < relLng,
    b = bitfield;
    
    if ((!maskLat && relLat === lat) || (!maskLng && relLng === lng)){
        // relative only maintain if lat and lng all changed
        b = peer(bitfield, lat === relLat ? relLat : 2, lng === relLng ? relLng : 2);
    }
    b.push(maskLat ? lat : (lat ? 0 : 1));
    b.push(maskLng ? lng : (lng ? 0 : 1));
    return b;
}

// enlarge grid, range(1),mat[[]]
function scale(range, mat, cb){
    if (!range) return cb(null, mat);
    range--;
    
    var
    hl = mat.length,
    h = hl - 1,
    vec = mat[0],
    wl = vec.length,
    w = wl - 1,
    row;
    
    // both sides
    for(var y=0; y<hl; y++){
        row = mat[y];
        row.push(peer(row[w].slice(), 2, 1));
        row.unshift(peer(row[0].slice(), 2, 0));
    }
    wl = row.length;
    w = wl - 1;
    
    // bottom row
    row = mat[h];
    vec = [peer(row[1].slice(), 0, 0)];
    for(var x=1; x<wl; x++){
        vec.push(peer(row[x].slice(), 0, 2));
    }
    mat.push(vec);
    
    // top row
    row = mat[0];
    vec = [peer(row[1].slice(), 1, 0)];
    for(var x=1; x<wl; x++){
        vec.push(peer(row[x].slice(), 1, 2));
    }
    mat.unshift(vec);
    
    scale(range, mat, cb);
};

function getPositions(range, pos, cb){
    var
    lat = pos.coords.latitude,
    lng = pos.coords.longitude,
    bitfield = hash(lat, lng, ACCURACY);

    scale(range, [[bitfield]], function(err, mat){
        if (cb) cb(err, err ? undefined : stringifyAll(mat), lat, lng);
    });
}

function getError(err){
    var
    code = err ? err.code : 500,
    msg;

    switch(code) {
        case err.PERMISSION_DENIED:
            msg='User denied the request for Geolocation.';
            break;
        case err.POSITION_UNAVAILABLE:
            msg='Location information is unavailable.';
            break;
        case err.TIMEOUT:
            msg='The request to get user location timed out.';
            break;
        case err.UNKNOWN_ERROR:
            msg='An unknown err occurred.';
            break;
        default:
            code = 500;
            msg = 'Is time to upgrade urself';
            break;
    }
    return {code:code, msg:msg};
}

me.getBoundary = function(lat, lng){
    return boundary(lat, lng, ACCURACY);
};

me.get = function(range, cb){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
        function(pos){
            getPositions(range, pos, cb);
        }, 
        function(err){
            cb(getError(err));
        }, optionHi);
    }else{
        cb(getError());
    }
};

me.getLast = function(){
    return geohashes;
};

me.startWatch = function(range, cb){
    if (navigator.geolocation){
        if (watchId) navigator.geolocation.clearWatch(watchId);
        watchId = navigator.geolocation.watchPosition(
        function(pos){
            getPositions(range, pos, cb);
        }, 
        function(err){
            var errObj = getError(err);
            if (cb) cb(errObj);
        }, optionLo);
    }else{
        var errObj = getError(err);
        if (cb) cb(errObj);
    }
};

me.stopWatch = function(){
    if (watchId) navigator.geolocation.clearWatch(watchId);
    watchId = 0;
};
