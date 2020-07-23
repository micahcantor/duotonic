
export const searchSpotify = async (query) => {
    const api = "http://localhost:3000/api/spotify/search?q=";
    const url = api + encodeURIComponent(query) + "&type=track&limit=10";
    const response = await fetch(url, { credentials: "include" });
    const json = await response.json();
    console.log("response received for " + query)
    return json;
}

export const startSong = async (device_id, uri) => {
    const api = "http://localhost:3000/api/spotify/me/player/play?device_id=" + device_id;
    await fetch(api, { 
        method: "PUT", 
        body: JSON.stringify({ uris: [uri] }),
        credentials: "include" ,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const resumeSong = async (device_id) => {
    const api = "http://localhost:3000/api/spotify/me/player/play?device_id=" + device_id;
    await fetch(api, {
        method: "PUT",
        credentials: "include"
    })
}

export const pauseSong = async (device_id) => {
    const api = "http://localhost:3000/api/spotify/me/player/pause?device_id=" + device_id;
    await fetch(api, {
        method: "PUT",
        credentials: "include"
    });
}

export const getAccessToken = async () => {
    const api = "http://localhost:3000/auth/spotify/access-token";
    const response = await fetch(api, { credentials: "include" });
    const json = await response.json();
    return json.access_token;
}