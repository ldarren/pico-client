var
GRAPH_DOMAIN = 'https://graph.facebook.com',
FB_PROFILE_URL = GRAPH_DOMAIN+'/USER_ID/picture?width=W&height=H&access_token=TOKEN',
FB_SCORE = '/USER_ID/scores',
FB_ACHIEVEMENTS = '/ID/achievements',
fbFriends = [],
fbAppRequests = [],
fbAppId, fbApi, fbCallback, fbUserId, fbAppToken, fbUserToken,
dummyFB = {
    login: function(){},
    logout: function(){fbUserId=undefined;},
    api: function(){
        var cb = arguments[arguments.length-1];
        if ('function' === typeof cb) cb();
    },
    ui: this.ui
},
dummyCB = function(res) {console.log(JSON.stringify(res))},
getFBRecurse = function(query, container, limit, cb){
    FB.api(query, function(res){
        if (!res) return cb(container);
        Array.prototype.push.apply(container, res.data);
        if (container.length >= limit) return cb(container);
        var paging = res.paging;
        if (paging && paging.next) getFBRecurse(paging.next.substr(GRAPH_DOMAIN.length), container, limit, cb);
        else return cb(container);
    });
},
GOOG = window.GOOG,
googStateConfig, googCB, googState,
googUpdate = function(err, result){
    if (!googCB) return;
    if (err) return googCB(err);

    var
    gms = GOOG.gms,
    appState = GOOG.appState;

    switch(result.type){
    case gms.GMS_SIGNIN:
        if (result && !result.signin) return googCB(result.reason);

        appState.getMaxNumKeys(function(err, slotCount){
            if (err) return googCB(err);
            appState.getMaxStateSize(function(err, slotSize){
                if (err) return googCB(err);
                googStateConfig = [slotCount, slotSize];
                googCB(null, googStateConfig);
            });
        });
        break;
    case gms.STATE_LOADED:
        googCB(null, result);
        break;
    case gms.STATE_LIST_LOADED:
        googCB(null, result);
        break;
    case gms.STATE_CONFLICTED:
        if (!googState) return console.error('State conflict without state data');
        var
        asResolvedVersion = result.version,
        asResolvedData = result.serverData,
        asResolvedKey = result.stateKey;
        appState.resolveState(asResolvedKey, asResolvedVersion, googState);
        break;
    case gms.STATE_DELETED:
        cb(null, result);
        break;
    }
};

me.googInit = function(code, extra){
    if (!GOOG) return;
    GOOG.gms.setup(code, extra, googUpdate);
};

me.googLogin = function(cb){
    if (!GOOG) return cb();
    googCB = cb;
    GOOG.gms.signin();
};

me.googStateLoad = function(key, cb){
    if (!googStateConfig) {
        return cb(null, {data: window.localStorage.getItem(fbUserId+key)});
    }
    googCB = cb;
    GOOG.appState.loadState(key);
};

me.googStateUpdate = function(key, state){
    console.log('googStateUpdate, state bytes: '+(2*state.length));
    if (!googStateConfig) {
        return window.localStorage.setItem(fbUserId+key, state);
    }
    googState = state;
    GOOG.appState.updateState(key, state);
};

me.fbProfile = function(id, width, height){
    width = width || 32;
    height = height || width;
    return FB_PROFILE_URL.replace('W', width).replace('H', height).replace('USER_ID', id).replace('TOKEN',fbUserToken);
};

me.fbUserId = function(){return fbUserId};
me.fbAccessToken = function(){return fbUserToken};

me.fbInit = function(appId, api, cb){
    fbAppId = appId;
    fbApi = api;
    fbCallback = cb;

    if (fbUserId) return fbCallback(fbUserId);

    if (window.FB){
        // Use phonegap facebook plugin
        window.fbAsyncInit();
    }else{
        // Load the SDK asynchronously
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.addEventListener('error', function(){
                window.FB = dummyFB; // in case FB fails to load
                fbUserId=-1;
                fbCallback(fbUserId);}
            );
            js.src = "//connect.facebook.net/en_US/all.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
};


me.fbLogin = function(permission){
    if ('Phonegap' === pico.getEnv('browser')){
        permission = permission || {};
        if (!permission.scope) permission.scope = '';
    }
    if (permission) FB.login(null, permission);
    else FB.login();
};

me.fbLogout = function(){
    FB.logout();
};

me.fbAppToken = function(secret, cb){
    cb = cb || dummyCB;
    if (fbAppToken) return cb(fbAppToken);
    pico.ajax('get', GRAPH_DOMAIN+'/oauth/access_token',
    {
        client_id: fbAppId,
        client_secret: secret,
        grant_type:'client_credentials'
    }, null, function(err, xhr){
        if (err) {
            console.error(JSON.stringify(err));
            return cb();
        }
        if (4 !== xhr.readyState) return;
        fbAppToken = xhr.responseText.split('=')[1];
        cb(fbAppToken);
    });
};

me.fbFriends = function(limit, cb){
    limit = limit || 10000;
    if (fbFriends.length) return cb(fbFriends.slice());
    getFBRecurse('/me/friends?fields=id,name,installed&limit=100', fbFriends, limit, cb);
};

me.fbReadRequests = function(limit, cb){
    limit = limit || 10000;
    if (fbAppRequests.length) return cb(fbAppRequests);
    getFBRecurse('/me/apprequests?limit=100', fbAppRequests, limit, cb);
};

// filters, exclude_ids, max_recipients are not supported on mobile sdk
me.fbWriteRequests = function(msg, to, data, cb){
    FB.ui({
        method:     'apprequests',
        message:    msg,
        to:         'string' === typeof to ? to : to.join(','),
        data:       data,
    }, function(res){
        cb(res.to);
    });
};

me.fbDeleteRequests = function(id, cb){
    FB.api(id, 'delete', cb || dummyCB);
};

me.fbReadScore = function(id, cb){
    FB.api(FB_SCORE.replace('USER_ID', id), function(res){
        if (!res) return cb();
        var data = res.data;
        if (data.length){
            var entry = data[0];
            cb(entry.user, entry.score);
        }else{
            cb();
        }
    });
};

me.fbWriteScore = function(score, cb){
    FB.api(FB_SCORE.replace('USER_ID', fbUserId), 'POST', {score: score}, cb || dummyCB);
};

me.fbDeleteScore = function(id, cb){
    FB.api(FB_SCORE.replace('USER_ID', id), 'DELETE', cb || dummyCB);
};

me.fbClearAllScores = function(cb){
    FB.api(FB_SCORE.replace('USER_ID', fbAppId), 'DELETE', cb || dummyCB);
};

me.fbCreateAchievement = function(url, cb){
    cb = cb || dummyCB;
    pico.ajax('post', GRAPH_DOMAIN+FB_ACHIEVEMENTS.replace('ID', fbAppId), 
    'achievement='+encodeURIComponent(url)+'&access_token='+fbAppToken, null, function(err, xhr){
        if (err){
            console.error(JSON.stringify(err));
            return cb('false');
        }
        if (4 !== xhr.readyState) return;
        cb(xhr.responseText);
    });
};

me.fbReadAchievements = function(){
    if (1 < arguments.length){
        FB.api(FB_ACHIEVEMENTS.replace('ID', arguments[0]), arguments[1]);
    }else{
        FB.api(FB_ACHIEVEMENTS.replace('ID', fbAppId), 'GET', {access_token: fbAppToken}, arguments[0]);
    }
};

me.fbWriteAchievement = function(url, cb){
    FB.api('/me/achievements', 'POST', {achievement:url}, cb || dummyCB);
};

me.fbDeleteAchievement = function(){
    if (2 < arguments.length){
        FB.api(FB_ACHIEVEMENTS.replace('ID', arguments[0]), 'DELETE', {achievement:arguments[1]}, arguments[2]);
    }else{
        FB.api(FB_ACHIEVEMENTS.replace('ID', fbAppId), 'DELETE', {achievement:arguments[0], access_token:fbAppToken}, arguments[1]);
    }
};

window.fbAsyncInit = function() {
    if (!fbAppId) return console.warn('window.fbAsyncInit without appid');
    if ('Phonegap' === pico.getEnv('browser')){
        FB.init({
            appId:                  fbAppId,
            nativeInterface:        fbApi,
            frictionlessRequests:   false,
            useCachedDialogs:       false,
        });
    }else{
        // init the FB JS SDK
        FB.init({
            appId:                  fbAppId,   // App ID from the app dashboard
            channelUrl:             fbApi,     // Channel file for x-domain comms
            frictionlessRequests:   false,
            status:                 true,      // Check Facebook Login status
            cookie:                 true,      // enable cookies to allow the server to access the session
            xfbml:                  true,      // Look for social plugins on the page
        });
    }

    // Additional initialization code such as adding Event Listeners goes here
    FB.getLoginStatus(function(res){
        switch(res.status){
        case 'connected':
            // do it in authResponseChange
            break;
        case 'not_authorized':
        case 'unknown':
        default:
            fbCallback();
            break;
        }
    });

    // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
    // for any authentication related change, such as login, logout or session refresh. This means that
    // whenever someone who was previously logged out tries to log in again, the correct case below 
    // will be handled. 
    FB.Event.subscribe('auth.authResponseChange', function(res) {
        switch(res.status){
        case 'connected':
            var auth = res.authResponse;
            fbUserId =auth.userId || auth.userID;
            fbUserToken = auth.accessToken;
            fbCallback(fbUserId);
            break;
        case 'not_authorized':
        case 'unknown':
        default:
            console.warn('Facebook authorization cancelled?');
            fbCallback();
            break;
        }
    });
};
