pico.def('piSocials', function(){
    var
    me = this,
    GRAPH_DOMAIN = 'https://graph.facebook.com',
    FB_PROFILE_URL = GRAPH_DOMAIN+'/USER_ID/picture?width=W&height=H&access_token=TOKEN',
    FB_SCORE = '/USER_ID/scores',
    FB_ACHIEVEMENTS = '/ID/achievements',
    fbFriends = [],
    fbAppRequests = [],
    fbAppId, fbApi, fbCallback, fbUserId, fbAppToken, fbUserToken,
    dummyCB = function(res) {console.log(JSON.stringify(res))},
    getFBRecurse = function(query, container, limit, cb){
        FB.api(query, function(res){
            Array.prototype.push.apply(container, res.data);
            if (container.length >= limit) return cb(container);
            var paging = res.paging;
            if (paging && paging.next) getFBRecurse(paging.next.substr(GRAPH_DOMAIN.length), container, limit, cb);
            else return cb(container);
        });
    };

    me.fbProfile = function(id, width, height){
        width = width || 32;
        height = height || width;
        return FB_PROFILE_URL.replace('W', width).replace('H', height).replace('USER_ID', id).replace('TOKEN',fbUserToken);
    };

    me.fbUserId = function(){return fbUserId;};
    me.fbAccessToken = function(){return fbUserToken;};

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
                js.src = "//connect.facebook.net/en_US/all.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    };

    window.fbAsyncInit = function() {
        if (!fbAppId) return console.warn('window.fbAsyncInit without appid');
        if ('Phonegap' === pico.states.browser){
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

    me.fbLogin = function(permission){
        if ('Phonegap' === pico.states.browser){
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
        if (1 > arguments.length){
            FB.api(FB_ACHIEVEMENTS.replace('ID', arguments[0]), arguments[1]);
        }else{
            FB.api(FB_ACHIEVEMENTS.replace('ID', fbAppId), 'GET', {access_token: fbAppToken}, arguments[0]);
        }
    };

    me.fbWriteAchievement = function(url, cb){
        FB.api('/me/achievements', 'POST', {achievement:url}, cb || dummyCB);
    };

    me.fbDeleteAchievement = function(){
        if (2 > arguments.length){
            FB.api(FB_ACHIEVEMENTS.replace('ID', arguments[0]), 'DELETE', {achievement:arguments[1]}, arguments[2]);
        }else{
            FB.api(FB_ACHIEVEMENTS.replace('ID', fbAppId), 'DELETE', {achievement:arguments[0], access_token:fbAppToken}, arguments[1]);
        }
    };
});
