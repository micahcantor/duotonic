const apiRequest = async (method, params, query, body) => {
    const base = process.env.GATSBY_API_URL;
    const url = base + params + query;
    let options = { method, credentials: "include" }
    if (body) {
        options.body = JSON.stringify(body);
        options.headers = { "Content-Type": "application/json" }
    }
    const response = await fetch(url, options);
    return response;
}

export const getAccessToken = async () => {
    const response = await apiRequest("GET", "/auth/spotify/access-token", "", null);
    const json = await response.json();
    return json.access_token;
}

export const setUsernameInDB = async (username) => {
    await apiRequest("POST", "/users/set-username", `?username=${encodeURIComponent(username)}`, null);
}

export const getUsernameFromDB = async () => {
    const response = await apiRequest("GET", "/users/get-username", "", null);
    const json = await response.json();
    return json;
}

export const getCurrentPlaybackState = async (roomID) => {
    const response = await apiRequest("GET", "/rooms/current-playback", `?room=${roomID}`, null);
    const json = await response.json();
    return json;
}

export const getRoomID = async () => {
    const response = await apiRequest("GET", "/rooms/share-link", "", null);
    const json = await response.json();
    return json.room_id;
}

export const enterRoom = async (roomID) => {
    const response = await apiRequest("PUT", "/rooms/enter", `?room=${roomID}`, null);
    if (response.status === 500) {
        return { msg: "error" }
    }
    return { msg: "success" }
}

export const exitRoom = async (roomID) => {
    await apiRequest("PUT", "/rooms/exit", `?room=${roomID}`, null);
}

export const updateHistoryInRoom = async (song, roomID) => {
    await apiRequest("POST", "/rooms/history", `?room=${roomID}`, song);
}

export const enterQueue = async () => {
    await apiRequest("PUT", "/rooms/queue/enter", "", null);
}

export const exitQueue = async () => {
    await apiRequest("PUT", "/rooms/queue/exit", "", null);
}

export const findPartner = async () => {
    const response = await apiRequest("PUT", "/rooms/queue/pair", "", null);
    const json = await response.json();
    return json;
}

export const sendChat = async (message, room_id) => {
    await apiRequest("POST", "/rooms/chat/new-message", `?room=${room_id}`, message);
}

export const resumeSong = async (device_id, room_id, broadcast) => {
    // no uri sent so this resumes the song
    const query = `?device_id=${device_id}&room=${room_id}&broadcast=${broadcast}`;
    await apiRequest("PUT", "/api/spotify/me/player/play", query, null);
}

export const pauseSong = async (device_id, room_id, broadcast) => {
    const query = `?device_id=${device_id}&room=${room_id}&broadcast=${broadcast}`;
    await apiRequest("PUT", "/api/spotify/me/player/pause", query, null);
}

export const nextSong = async (device_id, song_info, room_id, broadcast) => {
    const query = `?device_id=${device_id}&room=${room_id}&broadcast=${broadcast}`;
    await apiRequest("POST", "/api/spotify/me/player/next", query, song_info);
}

export const previousSong = async (device_id, room_id) => {
    const query = `?device_id=${device_id}&room=${room_id}&broadcast=${false}`;
    await apiRequest("POST", "/api/spotify/me/player/previous", query, null);
}

export const setVolume = async (device_id, volume_percent) => {
    const query = `?device_id=${device_id}&volume_percent=${volume_percent}`;
    await apiRequest("PUT", "/api/spotify/me/player/volume", query, null);
}

export const setSongPosition = async (device_id, position_ms, room_id, broadcast) => {
    const query = `?device_id=${device_id}&position_ms=${position_ms}&room=${room_id}&broadcast=${broadcast}`;
    await apiRequest("PUT", "/api/spotify/me/player/seek", query, null);
}

export const getDevices = async () => {
    const response = await apiRequest("GET", "/api/spotify/me/player/devices", "", null);
    const json = await response.json();
    return json.devices;
}

export const addToQueue = async (device_id, song_info, room_id, broadcast) => {
    const query = `?device_id=${device_id}&uri=${song_info.uri}&room=${room_id}&broadcast=${broadcast}`;
    await apiRequest("POST", "/api/spotify/me/player/queue", query, song_info);
}

export const startSong = async (device_id, song_info, room_id, broadcast) => {
    // sending uri with request starts the song
    const query = `?device_id=${device_id}&room=${room_id}&broadcast=${broadcast}`;
    await apiRequest("PUT", "/api/spotify/me/player/play", query, song_info);
}

export const searchSpotify = async (input) => {
    const query = `?q=${encodeURIComponent(input)}&type=track&limit=10`;
    const response = await apiRequest("GET", "/api/spotify/search", query, null);
    const json = await response.json();
    return json;
}
