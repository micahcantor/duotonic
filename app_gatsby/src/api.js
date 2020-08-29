
export const getAccessToken = async () => {
    const api = "http://localhost:3000/auth/spotify/access-token";
    const response = await fetch(api, { credentials: "include" });
    const json = await response.json();
    return json.access_token;
}

export const setUsernameInDB = async (username) => {
    const api = `http://localhost:3000/users/set-username?username=${encodeURIComponent(username)}`;
    await fetch(api, {
        method: "POST",
        credentials: "include",
    });
}

export const getUsernameFromDB = async () => {
    const api = "http://localhost:3000/users/get-username";
    const response = await fetch(api, { credentials: "include" });
    const json = await response.json();
    return json;
}

export const getRoomPlayback = async (roomID) => {
    const api = `http://localhost:3000/rooms/current-playback?room=${roomID}`;
    const response = await fetch(api, { credentials: "include" });
    const json = await response.json();
    return json;
}

export const getRoomID = async () => {
    const api = "http://localhost:3000/rooms/share-link";
    const response = await fetch(api, { credentials: "include" });
    const json = await response.json();
    return json.room_id;
}

export const enterRoom = async (roomID) => {
    const api = `http://localhost:3000/rooms/enter?room=${roomID}`;
    const response = await fetch(api, {
        method: "PUT",
        credentials: "include"
    });
    if (response.status === 500) {
        return { msg: "error" }
    }
    return { msg: "success" }
}

export const exitRoom = async (roomID) => {
    const api = `http://localhost:3000/rooms/exit?room=${roomID}`;
    await fetch(api, {
        method: "PUT",
        credentials: "include"
    });
}

export const updateHistoryInRoom = async (song, roomID) => {
    const api = `http://localhost:3000/rooms/history?room=${roomID}`;
    await fetch(api, {
        method: "POST",
        body: JSON.stringify(song),
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });
}

export const enterQueue = async () => {
    const api = "http://localhost:3000/rooms/queue/enter";
    await fetch(api, {
        method: "PUT",
        credentials: "include"
    });
}

export const exitQueue = async () => {
    const api = "http://localhost:3000/rooms/queue/exit";
    await fetch(api, {
        method: "PUT",
        credentials: "include"
    });
}

export const findPartner = async () => {
    const api = "http://localhost:3000/rooms/queue/pair";
    const response = await fetch(api, { 
        method: "PUT",
        credentials: "include"
    });
    const json = await response.json();
    return json;
}

export const sendChat = async (message, room_id) => {
    const api = `http://localhost:3000/rooms/chat/new-message?room=${room_id}`
    await fetch(api, {
        method: "POST",
        body: JSON.stringify(message),
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
    });
}

const reqPlayer = async (device_id, endpoint, method, room_id, broadcast) => {
    const api = `http://localhost:3000/api/spotify/me/player/${endpoint}?device_id=${device_id}&room=${room_id}&broadcast=${broadcast}`;
    await fetch(api, {
        method: method,
        credentials: "include"
    });
}

export const resumeSong = async (device_id, room_id, broadcast) => {
    // no uri sent so this resumes the song
    await reqPlayer(device_id, "play", "PUT", room_id, broadcast)
}

export const pauseSong = async (device_id, room_id, broadcast) => {
    await reqPlayer(device_id, "pause", "PUT", room_id, broadcast)
}

export const nextSong = async (device_id, song_info, room_id, broadcast) => {
    console.log(broadcast)
    const api = `http://localhost:3000/api/spotify/me/player/next?device_id=${device_id}&room=${room_id}&broadcast=${broadcast}`;
    await fetch (api, {
        method: "POST",
        body: JSON.stringify(song_info),
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
    });
}

export const previousSong = async (device_id, room_id) => {
    await reqPlayer(device_id, "previous", "POST", room_id, false)
}

export const setVolume = async (device_id, volume_percent) => {
    const api = `http://localhost:3000/api/spotify/me/player/volume?device_id=${device_id}&volume_percent=${volume_percent}`;
    await fetch (api, {
        method: "PUT",
        credentials: "include"
    });
}

export const setSongPosition = async (device_id, position_ms, room_id, broadcast) => {
    const base = "http://localhost:3000/api/spotify/me/player/seek";
    const api = `${base}?device_id=${device_id}&position_ms=${position_ms}&room=${room_id}&broadcast=${broadcast}`;
    await fetch (api, {
        method: "PUT",
        credentials: "include"
    });
}

export const getDevices = async () => {
    const response = await fetch("http://localhost:3000/api/spotify/me/player/devices", { credentials: "include" });
    const json = await response.json();
    return json.devices;
}

export const addToQueue = async (device_id, song_info, room_id, broadcast) => {
    const base = "http://localhost:3000/api/spotify/me/player/queue";
    const api = `${base}?device_id=${device_id}&uri=${song_info.uri}&room=${room_id}&broadcast=${broadcast}`;
    await fetch (api, {
        method: "POST",
        body: JSON.stringify(song_info),
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
    });
}

export const startSong = async (device_id, song_info, room_id, broadcast) => {
    // sending uri with request starts the song
    const api = `http://localhost:3000/api/spotify/me/player/play?device_id=${device_id}&room=${room_id}&broadcast=${broadcast}`;
    await fetch (api, {
        method: "PUT",
        body: JSON.stringify(song_info),
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
    });
}

export const searchSpotify = async (query) => {
    const api = "http://localhost:3000/api/spotify/search?q=";
    const url = api + encodeURIComponent(query) + "&type=track&limit=10";
    const response = await fetch(url, { credentials: "include" });
    const json = await response.json();
    return json;
}
