pico.def('piSocials', function(){
    var
    me = this,
    GRAPH_DOMAIN = 'https://graph.facebook.com',
    FB_PROFILE_URL = 'https://graph.facebook.com/USER_ID/picture?width=W&height=H&access_token=TOKEN',
    fbFriends = [],
    fbAppRequests = [],
    fbAppId, fbApi, fbCallback, fbUserId, fbToken,
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
        return FB_PROFILE_URL.replace('W', width).replace('H', height).replace('USER_ID', id).replace('TOKEN',fbToken);
    };

    me.fbUserId = function(){return fbUserId;};
    me.fbAccessToken = function(){return fbToken;};

    me.fbInit = function(appId, api, cb){
        fbAppId = appId;
        fbApi = api;
        fbCallback = cb;

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
                fbToken = auth.accessToken;
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

    me.fbLogin = function(){
        if ('Phonegap' === pico.states.browser) FB.login(null, {scope:''});
        else FB.login();
    };

    me.fbLogout = function(){
        FB.logout();
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
    };
});
