
export const getAccessToken = async () => {
    const api = "http://localhost:3000/auth/spotify/access-token";
    const response = await fetch(api, { credentials: "include" });
    const json = await response.json();
    return json.access_token;
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
    if (response.status === 400) {
        console.log('invalid room #')
    }
}

export const exitRoom = async () => {
    const api = "http://localhost:3000/rooms/exit";
    await fetch(api, {
        method: "PUT",
        credentials: "include"
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
    const response = await fetch(api, { credentials: "include"});
    const json = await response.json();
    return json;
}

const reqPlayer = async (device_id, endpoint, method, room_id) => {
    const api = `http://localhost:3000/api/spotify/me/player/${endpoint}/?device_id=${device_id}&room=${room_id}`;
    await fetch(api, {
        method: method,
        credentials: "include"
    });
}

export const resumeSong = async (device_id, room_id) => {
    // no uri sent so this resumes the song
    await reqPlayer(device_id, "play", "PUT", room_id)
}

export const pauseSong = async (device_id, room_id) => {
    await reqPlayer(device_id, "pause", "PUT", room_id)
}

export const nextSong = async (device_id, room_id, song_info) => {
    const api = `http://localhost:3000/api/spotify/me/player/next?device_id=${device_id}&room=${room_id}`;
    await fetch (api, {
        method: "POST",
        body: JSON.stringify(song_info),
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
    });
}

export const previousSong = async (device_id, room_id) => {
    await reqPlayer(device_id, "previous", "POST", room_id)
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

export const addToQueue = async (device_id, song_info, room_id) => {
    const api = `http://localhost:3000/api/spotify/me/player/queue?device_id=${device_id}&uri=${song_info.uri}&room=${room_id}`;
    await fetch (api, {
        method: "POST",
        body: JSON.stringify(song_info),
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
    });
}

export const startSong = async (device_id, song_info, room_id) => {
    // sending uri with request starts the song
    const api = `http://localhost:3000/api/spotify/me/player/play/?device_id=${device_id}&room=${room_id}`;
    await fetch (api, {
        method: method,
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
