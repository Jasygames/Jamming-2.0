let accessToken;
const clientID = "f179a0c3958648daa378c8902a973d27";
const redirectUrl = "http://localhost:3000";

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // Check the URL for access token and expiry time
        const tokenInURL = window.location.href.match(/access_token=([^&]*)/);
        const expiryTime = window.location.href.match(/expires_in=([^&]*)/);

        if (tokenInURL && expiryTime) {
            // Set the access token and expiration time
            accessToken = tokenInURL[1];
            const expiresIn = Number(expiryTime[1]);

            // Reset the access token after it expires
            window.setTimeout(() => (accessToken = ""), expiresIn * 1000);

            // Clear the token from the URL to prevent security risks
            window.history.pushState("Access Token", null, "/");

            return accessToken;
        }

        // Redirect to Spotify authorization if no token is found
        const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
        window.location = redirect;
    },

    search(term) {
        // Ensure access token is available before making the request
        const token = this.getAccessToken();
        if (!token) {
            console.error('Access token is missing or invalid');
            return Promise.reject('No access token available');
        }

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },  // Ensure token is fetched properly
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Spotify API request failed');
            }
            return response.json();
        })
        .then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return []; // Return empty array if no tracks are found
            }

            return jsonResponse.tracks.items.map(t => ({
                id: t.id,
                name: t.name,
                artist: t.artists[0].name,
                album: t.album.name,
                uri: t.uri,
            }));
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    },

    savePlaylist(name,trackURIs) {
        if (!name ||!trackURIs) return;
        const aToken = Spotify.getAccessToken();
        const header = { 'Authorization': `Bearer ${aToken}` };
        let userId;
        return fetch('https://api.spotify.com/v1/me', { headers: header })
        .then((response) => response.json())
        .then((jsonResponse) => {
            userId = jsonResponse.id;
            let playlistId;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: header,
                method: 'POST',
                body: JSON.stringify(name),
            })
             .then((response) => response.json())
             .then((jsonResponse) => {
                 playlistId = jsonResponse.id;
                 return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    headers: header,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackURIs }),
                    });
             });
        });  
    },
};

export { Spotify };