
export const searchSpotify = async (query) => {
    const api = "http://localhost:3000/api/spotify/search?q=";
    const url = api + encodeURIComponent(query) + "&type=track&limit=10";
    const response = await fetch(url, { credentials: "include" });
    const json = await response.json();
    return json;
}

export const getAccessToken = async () => {
    const api = "http://localhost:3000/auth/spotify/access-token";
    const response = await fetch(api, { credentials: "include" });
    const json = await response.json();
    return json.access_token;
}

const reqPlayer = async (device_id, endpoint, method) => {
    const api = `http://localhost:3000/api/spotify/me/player/${endpoint}`;
    await fetch(api, {
        method: method,
        credentials: "include"
    });
}

const reqPlayerPayload = async (device_id, data, endpoint, method) => {
    const api = `http://localhost:3000/api/spotify/me/player/${endpoint}?device_id=${device_id}`;
    await fetch (api, {
        method: method,
        body: JSON.stringify(data),
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
    })
}

export const startSong = async (device_id, uri) => {
    // sending uri with request starts the song
    await reqPlayerPayload(device_id, { uris: [uri] }, "play", "PUT")
}

export const resumeSong = async (device_id) => {
    // no uri sent so this resumes the song
    await reqPlayer(device_id, "play", "PUT")
}

export const pauseSong = async (device_id) => {
    await reqPlayer(device_id, "pause", "PUT")
}

export const nextSong = async (device_id) => {
    await reqPlayer(device_id, "next", "POST")
}

export const previousSong = async (device_id) => {
    await reqPlayer(device_id, "previous", "POST")
}

export const setVolume = async (device_id, volume_percent) => {
    const api = `http://localhost:3000/api/spotify/me/player/volume?device_id=${device_id}&volume_percent=${volume_percent}`;
    await fetch (api, {
        method: "PUT",
        credentials: "include"
    })
}

export const getDevices = async () => {
    const response = await fetch("http://localhost:3000/api/spotify/me/player/devices", { credentials: "include" });
    const json = await response.json();
    return json.devices;
}

export const addToQueue = async (device_id, uri) => {
    const api = `http://localhost:3000/api/spotify/me/player/queue?device_id=${device_id}&uri=${uri}`;
    await fetch (api, {
        method: "POST",
        credentials: "include"
    })
}
