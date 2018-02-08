var querystring = require('querystring');
let accessToken;
let client_id = ''; //client_id removed from GitHub version
let redirect_uri = 'http://GuitarSongList.surge.sh/' 
//'http://localhost:3000/';
let stateKey = 'spotify_auth_state';

let Spotify = {

    /**
    * Obtains parameters from the hash of the URL
    * @return Object
    */
    getHashParams() {
        const hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        // eslint-disable-next-line    
        while ( e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    },

    /**
     * Generates a random string containing numbers and letters
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    generateRandomString: (length) => {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },

    getAccessToken() { // get access token from URL

        if (accessToken) { //Token exists 
            //console.log('Token exists ' + accessToken)
            return accessToken;
        }
        
        var params = Spotify.getHashParams();
        var state = params.state,
            storedState = localStorage.getItem(stateKey);
        
        let returnURI = window.location.href;
        const accessTokenMatch = returnURI.match(/access_token=([^&]*)/);
        const expiresInMatch = returnURI.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch && (state !== null || state === storedState)) {
            //If the access Token is not already set, check the URL to see if it has just been obtained.
            localStorage.removeItem(stateKey);
            //console.log("Access token is not already set!")
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;

        } else { //  access token variable is empty and is not in the URL, need to log in - redirect to the login page
            //console.log("Access token variable is empty and is not in the URL, Need to Login")
            let state = Spotify.generateRandomString(16);
            localStorage.setItem(stateKey, state);
            const params = querystring.stringify({
                response_type: 'token',
                client_id: encodeURIComponent(client_id),
                scope: encodeURIComponent('playlist-modify-public'),
                redirect_uri: redirect_uri,
                state: encodeURIComponent(state)
            })
            const accessUrl = `https://accounts.spotify.com/authorize?${params}`;
            window.location = accessUrl;
            // login successfuly will redirect to localhost port 3000 with get parameters in the url
        }
    },

    async search(searchTerm) {
        const accessToken = await Spotify.getAccessToken();
        if (accessToken) {
            try {
                return await fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
                ).then(response => {
                    return response.json()
                }).then(jsonResponse => {
                    if (!jsonResponse.tracks) {
                        return [{
                            name: 'Search did not return results',
                            artist: 'Try some different Search Terms',
                            album: ' ',
                        }];
                    }
                    return jsonResponse.tracks.items.map(track => ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }))
                })
            } catch (error) { console.log(error); }
        }
    },

    async savePlaylist(playlistName, trackURIs) {

        const accessToken = Spotify.getAccessToken();
        const spotifyHeader = { Authorization: `Bearer ${accessToken}` }
        let userID;

        if (playlistName && trackURIs.length) {
            try {
                return await fetch('https://api.spotify.com/v1/me', {
                    headers: spotifyHeader
                }
                ).then(response => response.json()
                    ).then(jsonResponse => {
                        if (jsonResponse.id.length > 0) {
                            userID = jsonResponse.id;
                            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                                headers: spotifyHeader,
                                method: 'POST',
                                body: JSON.stringify({ name: playlistName })
                            }).then(response => response.json()
                                ).then(jsonResponse => {
                                    if (jsonResponse) {
                                        const playlistID = jsonResponse.id;
                                        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                                            headers: spotifyHeader,
                                            method: 'POST',
                                            body: JSON.stringify({ uris: trackURIs })
                                        });
                                    }
                                })
                        } else {
                            return [];
                        }
                    })
            } catch (error) { console.log(error); }
        } else {
            return
        }

    }

}

export default Spotify