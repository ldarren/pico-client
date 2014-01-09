var
clientId = '1077407597406.apps.googleusercontent.com',
apiKey = 'AIzaSyADjtX4Umj6oV9pNuj_1WEFOIPja45Jyx4',
scopes = 'https://www.googleapis.com/auth/analytics.readonly';

function handleClientLoad(){
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 1);
}

function checkAuth(){
    gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: true},
        function(result){
            if (result){
                loadAnalytics`
            }else{
            }
        });
}
