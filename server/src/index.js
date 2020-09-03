'use strict';

require('dotenv').config();

const Path = require('path');
const Fs = require('fs');
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Bell = require('@hapi/bell');
const Nes = require('@hapi/nes');
const RequireHttps = require('hapi-require-https');
const ObjectId = require('mongodb').ObjectId;

const LoadDB = require('./db');
const { requestSpotifyPayload, requestSpotify, getUpdatedToken, updateRoomState, filterUpdateMessages } = require('./utils');

const tls = (process.env.TLS_ENABLED === 'true') ? {
    cert: Fs.readFileSync(Path.resolve(__dirname, '../ssl/localhost.crt')),
    key: Fs.readFileSync(Path.resolve(__dirname, '../ssl/localhost.key'))
} : undefined;

const init = async () => {

    const db = await LoadDB();

    /* CAREFUL drops db on startup
        await db.dropCollection('sessions');
        await db.dropCollection('rooms');
        */

    const server = Hapi.server({
        host: process.env.HOST,
        port: process.env.PORT,
        tls: (process.env.TLS_ENABLED === 'true') ? tls : false,
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            }
        }
    });

    // register plugins
    await server.register([Bell, Nes]);

    // web socket endpoints for publishing room updates
    server.subscription('/rooms/playback/{id}', { filter: filterUpdateMessages });
    server.subscription('/rooms/chat/{id}', { filter: filterUpdateMessages });

    server.state('sessionId', {
        isSecure: (process.env.TLS_ENABLED === 'true'),
        path: '/',
        domain: process.env.HOST
    });

    server.state('isAuthorized', {
        isSecure: (process.env.TLS_ENABLED === 'true'),
        isHttpOnly: false,
        path: '/',
        domain: process.env.HOST
    });

    server.state('showCookieBanner', {
        isSecure: (process.env.TLS_ENABLED === 'true'),
        isHttpOnly: false,
        path: '/',
        domain: process.env.HOST
    });

    if (process.env.TLS_ENABLED === 'true') {
        await server.register(RequireHttps);
    }

    server.auth.strategy('spotify', 'bell', {
        provider: 'spotify',
        password: process.env.COOKIE_PASSWORD,
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        isSecure: (process.env.TLS_ENABLED === 'true'),
        scope(request) {

            const scopes = ['user-read-private', 'user-modify-playback-state', 'user-read-playback-state'];
            if (request.query.wantsWebPlayback) {
                scopes.push('streaming');
            }

            return scopes;
        }
    });

    server.route({
        method: ['POST', 'GET'],
        path: '/auth/spotify',
        options: {
            auth: {
                mode: 'try',
                strategy: 'spotify'
            },
            handler: async (request, h) => {

                if (!request.auth.isAuthenticated) {
                    console.log(request.auth.error.message);
                    throw Boom.unauthorized();
                }

                let ttl = null;
                if (request.auth.credentials.query.remember === 'true') {
                    const SIX_MONTHS_MS = 15552000000;
                    ttl = SIX_MONTHS_MS;
                }

                const result = await db.collection('sessions').insertOne({
                    auth: request.auth,
                    last_update: new Date(),
                    in_queue: false,
                    last_partner: null, // last user who was paired with this user
                    username: 'DEFAULT_USERNAME',
                    remember: ttl ? true : false
                });

                if (result) {
                    const userID = result.ops[0]._id.toString();

                    h.state('sessionId', userID, { ttl });
                    h.state('isAuthorized', 'true', { ttl });

                    let roomID = '';
                    if (request.auth.credentials.query.room) {
                        roomID = `?room=${request.auth.credentials.query.room}`;
                    }

                    return h.redirect(`http://localhost:8080/${roomID}`);
                }

                throw Boom.badImplementation();
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/cookies/cookie-banner',
        handler: async (request, h) => {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('Must have a session cookie.');
            }

            try {
                const userID = ObjectId(request.state.sessionId);
                const user = await db.collection('sessions').findOne({ _id: userID });
                const SIX_MONTHS_MS = 15552000000;
                const ttl = user.remember ? SIX_MONTHS_MS : null;
                h.state('showCookieBanner', 'false', { ttl });
            }
            catch (error) {
                console.log(error);
                throw Boom.badImplementation('could not set cookie banner cookie');
            }

            return { message: 'success' };
        }
    });

    server.route({
        method: ['GET'],
        path: '/auth/spotify/access-token',
        handler: async (request, h) => {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('Must have a session cookie.');
            }

            const userID = ObjectId(request.state.sessionId);
            const token = await getUpdatedToken(db, userID);

            if (token) {
                return { access_token: token };
            }

            throw Boom.unauthorized('Session ID not found in database.');
        }
    });

    server.route({
        method: ['GET', 'PUT', 'POST'],
        path: '/api/spotify/{endpoint*}',
        handler: async function (request, h) {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('Must have a session cookie.');
            }

            const userID = ObjectId(request.state.sessionId);
            const roomID = request.query.room;
            const token = await getUpdatedToken(db, userID);

            if (token) {
                try {
                    let response;
                    if (request.payload && request.params.endpoint === 'me/player/play') {
                        const uris = { uris: [request.payload.uri] };
                        response = await requestSpotifyPayload(request.params.endpoint, request.method, uris, request.query, token);
                    }
                    else {
                        response = await requestSpotify(request.params.endpoint, request.method, request.query, token);
                    }

                    if (roomID && roomID !== 'null' && request.query.broadcast === 'true') {
                        console.log('request to broadcast from', userID, request.params);
                        const updated = await updateRoomState(db, roomID, request);
                        server.publish(`/rooms/playback/${roomID}`,
                            { updated: updated.value, type: updated.type },
                            { internal: { id: request.state.sessionId } }
                        );
                    }
                    else if (request.query.broadcast === 'false') {
                        console.log('update without broadcast from', userID, request.params);
                    }

                    if (response) {
                        return response.data;
                    }

                    throw Boom.badImplementation('could not handle spotify api request');
                }
                catch (error) {
                    console.log(error?.response?.data, request.params.endpoint, request?.payload);
                    throw Boom.badRequest('Third-party API request failed.');
                }
            }

            throw Boom.unauthorized('Session ID not found in database.');
        }
    });

    server.route({
        method: 'POST',
        path: '/users/set-username',
        handler: async (request, h) => {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            try {
                const userID = ObjectId(request.state.sessionId);
                await db.collection('sessions').updateOne(
                    { _id: userID },
                    { $set: { username: request.query.username } }
                );
            }
            catch (error) {
                console.log(error);
                throw Boom.badImplementation('could not update username in database');
            }

            return { message: 'success' };
        }
    });

    server.route({
        method: 'GET',
        path: '/users/get-username',
        handler: async (request, h) => {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            try {
                const userID = ObjectId(request.state.sessionId);
                const response = await db.collection('sessions').findOne({ _id: userID });
                if (response) {
                    return { username: response.username };
                }
            }
            catch (error) {
                console.log(error);
                throw Boom.badImplementation('could not find username in database');
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/rooms/current-playback',
        handler: async (request, h) => {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            try {
                const roomID = ObjectId(request.query.room);
                const room = await db.collection('rooms').findOne({ _id: roomID });
                if (room) {
                    return room.playback;
                }
            }
            catch (error) {
                console.log(error);
                throw Boom.badImplementation('could not find username in database');
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/rooms/enter',
        handler: async (request, h) => {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            try {
                const roomID = ObjectId(request.query.room);
                await db.collection('rooms').updateOne(
                    { _id: roomID },
                    { $addToSet: { user_ids: ObjectId(request.state.sessionId) } } // adds user id only if it is not in the room already
                );
                server.publish(`/rooms/chat/${roomID}`,
                    { message: 'user entered', type: 'enter' },
                    { internal: { id: request.state.sessionId } }
                );
            }
            catch (error) {
                console.log(error);
                throw Boom.badImplementation('user could not be added to room, or room not found');
            }

            return { message: 'success' };
        }
    });

    server.route({
        method: 'PUT',
        path: '/rooms/exit',
        handler: async (request, h) => {
            /* removes user from all rooms they are in
                if supplied with a room in query params, publishes an exit message to that room */

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            try {
                const userID = ObjectId(request.state.sessionId);
                await db.collection('rooms').updateMany(
                    { user_ids: userID }, // where user_ids list contains this user's id
                    { $pull: { user_ids: userID } } // remove user's id from list
                );

                if (request.query.room !== 'null') {
                    const roomID = ObjectId(request.query.room);
                    server.publish(`/rooms/chat/${roomID}`,
                        { message: 'user exited', type: 'exit' },
                        { internal: { id: request.state.sessionId } }
                    );
                }
            }
            catch (error) {
                console.log(error);
                throw Boom.badImplementation('user could not be removed from their room');
            }

            return { message: 'success' };
        }
    });

    server.route({
        method: 'POST',
        path: '/rooms/history',
        handler: async (request, h) => {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            try {
                const roomID = ObjectId(request.query.room);
                await db.collection('rooms').updateOne(
                    { _id: roomID },
                    { $push: { history: request.payload } }
                );

                console.log('updating room history for ', roomID);
            }
            catch (error) {
                console.log(error);
                throw Boom.badImplementation('unable to update history in room');
            }

            return { message: 'success' };
        }
    });

    server.route({
        method: 'GET',
        path: '/rooms/share-link',
        handler: async (request, h) => {
            /* This is one way to initialize a new room
            A room is created when a user requests a share-able link */

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            const userID = ObjectId(request.state.sessionId);
            const result = await db.collection('rooms').insertOne({
                user_ids: [userID],
                chat: [],
                playback: {
                    isPaused: true,
                    position_ms: 0,
                    queue: [],
                    history: [],
                    current_song: {}
                }
            });

            if (result) {
                const roomID = result.ops[0]._id.toString();
                console.log('created new room', roomID);
                return { room_id: roomID };
            }

            throw Boom.badImplementation();
        }
    });

    server.route({
        method: 'POST',
        path: '/rooms/chat/new-message',
        handler: async (request, h) => {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            try {
                const roomID = ObjectId(request.query.room);
                const result = await db.collection('rooms').findOneAndUpdate(
                    { _id: roomID },
                    { $push: { chat: request.payload } },
                    { returnOriginal: false }
                );
                const messages = result.value.chat;
                const lastMessage = messages[messages.length - 1];
                server.publish(`/rooms/chat/${roomID}`,
                    { updated: lastMessage, type: 'chat' },
                    { internal: { id: request.state.sessionId } }
                );
            }
            catch (error) {
                console.log(error);
                throw Boom.badImplementation('could not find or update room');
            }

            return { message: 'success' };
        }
    });

    server.route({
        method: 'PUT',
        path: '/rooms/queue/pair',
        handler: async (request, h) => {
            /* This is another way to initialize a new room
            A room is created when two viable users are found that can be paired */

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            const userID = ObjectId(request.state.sessionId);

            // find the first user in queue that is not in the user, and not the last partner the user had
            const match = await db.collection('sessions').findOne({
                in_queue: true,
                _id: { $ne: userID },
                last_partner: { $ne: userID }
            });
            // check to see if the user has been added to a room by a match
            // eslint-disable-next-line consistent-this
            const self = await db.collection('rooms').findOne({
                user_ids: userID
            });
            // return if there are no matches and the requester is not in a room
            if (!match && !self) {
                return { message: 'no matches' };
            }
            // if the requester is in a room, return that room's id
            else if (self) {
                const selfID = self._id;
                return { room_id: selfID, message: 'success' };
            }

            // create a new room with the matched users
            const result = await db.collection('rooms').insertOne({
                user_ids: [userID, match._id],
                chat: [],
                playback: {
                    isPaused: true,
                    position_ms: 0,
                    queue: [],
                    history: [],
                    current_song: {}
                }
            });
            // set in_queue to false and last partner to each other for the matched users
            console.log('matched user ID: ', match._id);
            await db.collection('sessions').updateOne(
                { _id: userID },
                { $set: { in_queue: false, last_partner: match._id } }
            );
            await db.collection('sessions').updateOne(
                { _id: match._id },
                { $set: { in_queue: false, last_partner: userID } }
            );

            if (result) {
                const roomID = result.ops[0]._id.toString();
                console.log('created new room', roomID);
                return { room_id: roomID, message: 'success' };
            }

            throw Boom.badImplementation();
        }
    });

    server.route({
        method: 'PUT',
        path: '/rooms/queue/enter',
        handler: async (request, h) => {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            try {
                const userID = ObjectId(request.state.sessionId);
                await db.collection('sessions').updateOne(
                    { _id: userID }, // where id == userID
                    { $set: { in_queue: true } } // set in queue to true
                );
            }
            catch (error) {
                console.log(error);
                throw Boom.badImplementation('user could not be added to the queue');
            }

            return { message: 'success' };
        }
    });

    server.route({
        method: 'PUT',
        path: '/rooms/queue/exit',
        handler: async (request, h) => {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            try {
                const userID = ObjectId(request.state.sessionId);
                await db.collection('sessions').updateOne(
                    { _id: userID },
                    { $set: { in_queue: false } }
                );
            }
            catch (error) {
                console.log(error);
                throw Boom.badImplementation('user could not be removed from the queue');
            }

            return { message: 'success' };
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Duotonic API';
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
