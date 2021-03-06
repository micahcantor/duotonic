'use strict';

const Axios = require('axios');
const Qs = require('qs');
const { ObjectId } = require('mongodb');
const Cookie = require('cookie');

const filterUpdateMessages = (path, message, options) => {
    /* sends the update only to users in the room that did not send it */

    const cookies = Cookie.parse(options.socket._cookies);
    if (options.internal) {
        return options.internal.id !== cookies.sessionId;
    }

    return false;
};

const requestSpotify = (endpoint, method, query, accessToken) => {

    return Axios({
        method,
        url: 'https://api.spotify.com/v1/' + endpoint,
        headers: { 'Authorization': `Bearer ${accessToken}` },
        params: query
    });
};

const requestSpotifyPayload = (endpoint, method, data, query, accessToken) => {

    return Axios({
        method,
        url: 'https://api.spotify.com/v1/' + endpoint,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        params: query,
        data
    });
};

const refreshAccessToken = async (db, id) => {

    const credsString = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
    const credsBase64 = Buffer.from(credsString).toString('base64');
    const sessionInfo = await db.collection('sessions').findOne({ _id: id });
    const userRefreshToken = sessionInfo.auth.artifacts.refresh_token;

    const response = await Axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: Qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: userRefreshToken
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credsBase64}`
        }
    });

    return response.data.access_token;
};

const shouldRefreshToken = async (db, id) => {

    const sessionInfo = await db.collection('sessions').findOne({ _id: id });
    const last_update = sessionInfo.last_update;
    const current_time = new Date().getTime();
    const ONE_HOUR = 3600 * 1000;

    if (current_time - last_update > ONE_HOUR) {
        return true;
    }

    return false;
};

const getUpdatedToken = async (db, id) => {

    let token;
    const shouldRefresh = await shouldRefreshToken(db, id);

    if (shouldRefresh) {
        token = await refreshAccessToken(db, id);
        const current_time = new Date().getTime();
        await db.collection('sessions').updateOne(
            { _id: id },
            { $set: {
                last_update: current_time,
                'auth.artifacts.access_token': token
            } }
        );
        console.log('refreshed access token');
    }
    else {
        const sessionInfo = await db.collection('sessions').findOne({ _id: id });
        token = sessionInfo.auth.artifacts.access_token;
    }

    return token;
};

const updateRoomState = async (db, roomID, request) => {

    let result; let type;
    console.log(request.params.endpoint);
    switch (request.params.endpoint) {
        case 'me/player/play':
            if (request.payload) {
                /* starting a song */
                result = await db.collection('rooms').findOneAndUpdate(
                    { _id: ObjectId(roomID) },
                    {
                        $push: { 'playback.queue': request.payload },
                        $set: { 'playback.current_song': request.payload, 'playback.isPaused': false }
                    },
                    { returnOriginal: false }
                );
                type = 'start';
            }
            else {
                /* resuming a song */
                result = await db.collection('rooms').findOneAndUpdate(
                    { _id: ObjectId(roomID) },
                    { $set: { 'playback.isPaused': false } },
                    { returnOriginal: false }
                );
                type = 'resume';
            }

            break;
        case 'me/player/pause':
            result = await db.collection('rooms').findOneAndUpdate(
                { _id: ObjectId(roomID) },
                { $set: { 'playback.isPaused': true } },
                { returnOriginal: false }
            );
            type = 'pause';
            break;
        case 'me/player/next' || 'me/player/previous':
            result = await db.collection('rooms').findOneAndUpdate(
                { _id: ObjectId(roomID) },
                {
                    $pop: { 'playback.queue': -1 }, // removes first element
                    $set: { 'playback.current_song': request.payload, 'playback.isPaused': false }
                },
                { returnOriginal: false }
            );
            type = request.params.endpoint.split('/')[2];
            console.log(type);
            break;
        case 'me/player/seek':
            result = await db.collection('rooms').findOneAndUpdate(
                { _id: ObjectId(roomID) },
                { $set: { 'playback.position_ms': request.query.position_ms } },
                { returnOriginal: false }
            );
            type = 'seek';
            break;
        case 'me/player/queue':
            result = await db.collection('rooms').findOneAndUpdate(
                { _id: ObjectId(roomID) },
                { $push: { 'playback.queue': request.payload } },
                { returnOriginal: false }
            );
            type = 'queue';
            break;
    }

    return { value: result.value.playback, type };
};

module.exports = { requestSpotifyPayload, requestSpotify, getUpdatedToken, updateRoomState, filterUpdateMessages };
