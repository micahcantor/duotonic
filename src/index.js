'use strict';

require('dotenv').config();

const Path = require('path');
const Fs = require('fs');
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Bell = require('@hapi/bell');
const RequireHttps = require('hapi-require-https');
const ObjectId = require('mongodb').ObjectId;

const LoadDB = require('./db');
const { requestSpotifyPayload, requestSpotify, refreshAccessToken, shouldRefreshToken } = require('./utils');

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

    await server.register(Bell);

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

            const scopes = ['user-read-private', 'user-read-email', 'user-modify-playback-state', 'user-read-playback-state'];
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

                const result = await db.collection('sessions').insertOne({
                    auth: request.auth,
                    last_update: new Date(),
                    in_queue: false
                });

                if (result) {
                    const id = result.ops[0]._id.toString();
                    h.state('sessionId', id);
                    h.state('isAuthorized', 'true');
                    return h.redirect('http://localhost:8080');
                }

                throw Boom.badImplementation();
            }
        }
    });

    server.route({
        method: ['GET'],
        path: '/auth/spotify/access-token',
        handler: async (request, h) => {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('Must have a session cookie.');
            }

            let token;
            const id = ObjectId(request.state.sessionId);
            const shouldRefresh = await shouldRefreshToken(db, id);

            if (shouldRefresh) {
                token = await refreshAccessToken(db, id);
                const current_time = new Date().getTime();
                await db.collection('sessions').updateOne(
                    { _id: id },
                    { $set: { 
                        last_update: current_time,
                        "auth.artifacts.access_token": token
                    }}
                );
                console.log('refreshed access token');
            }
            else {
                const sessionInfo = await db.collection('sessions').findOne({ _id: id });
                token = sessionInfo.auth.artifacts.access_token;
                console.log('got access token');
            }

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

            let token;
            const id = ObjectId(request.state.sessionId);
            const shouldRefresh = await shouldRefreshToken(db, id);

            if (shouldRefresh) {
                token = await refreshAccessToken(db, id);
                const current_time = new Date().getTime();
                await db.collection('sessions').updateOne(
                    { _id: id },
                    { $set: { 
                        last_update: current_time, 
                        "auth.artifacts.access_token": token 
                    }}
                );
                console.log('refreshed access token');
            }
            else {
                const sessionInfo = await db.collection('sessions').findOne({ _id: id });
                token = sessionInfo.auth.artifacts.access_token;
                console.log('got access token');
            }

            if (token) {
                try {
                    let response;
                    if (request.payload) {
                        response = await requestSpotifyPayload(request.params.endpoint, request.method, request.payload, request.query, token);
                    }
                    else {
                        response = await requestSpotify(request.params.endpoint, request.method, request.query, token);
                    }

                    return JSON.stringify(response.data);
                }
                catch (error) {
                    if (error.response.data) {
                        console.log(error.response.data);
                    }

                    throw Boom.badRequest('Third-party API request failed.');
                }
            }

            throw Boom.unauthorized('Session ID not found in database.');
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
                    { $addToSet: { user_ids: request.state.sessionId } } // adds user id only if it is not in the room already
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

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            try {
                const userID = ObjectId(request.state.sessionId);
                await db.collection('rooms').updateOne(
                    { user_ids: userID }, // where user_ids list contains this user's id
                    { $pull: { user_ids: userID } } // remove user's id from list
                );
            }
            catch (error) {
                console.log(error);
                throw Boom.badImplementation('user could not be removed from their room');
            }

            return { message: 'success' };
        }
    });

    server.route({
        method: 'GET',
        path: '/rooms/share-link',
        handler: async (request, h) => {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            const userID = ObjectId(request.state.sessionId);
            const result = await db.collection('rooms').insertOne({
                user_ids: [userID]
            });

            if (result) {
                const room_id = result.ops[0]._id.toString();
                console.log('created new room', room_id);
                return { room_id: room_id }
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
                throw Boom.badImplementation('user could not be added to the queue')
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
                throw Boom.badImplementation('user could not be removed from the queue')
            }

            return { message: 'success' };
        }
    })

    server.route({
        method: 'GET',
        path: '/rooms/queue/pair',
        handler: async (request, h) => {

            if (!request.state.sessionId) {
                throw Boom.unauthorized('user must be authenticated');
            }

            const userID = ObjectId(request.state.sessionId);
            const blockList = [userID];
            
            // find the first user in queue that is not in the blocklist
            const match = await db.collection('sessions').findOne({ 
                in_queue: true,
                _id: { $nin: blockList } 
            });
            // check to see if the user has been added to a room by a match
            const self = await db.collection('rooms').findOne({
                user_ids: userID
            })
            // return if there are no matches and the requester is not in a room
            if (!match && !self) {
                return { message: 'no matches' }
            }
            // if the requester is in a room, return that room's id
            else if (self) {
                return { room_id: self._id, message: 'success' }
            }
            // create a new room with the matched users
            const result = await db.collection('rooms').insertOne({
                user_ids: [userID, match._id]
            });
            // set in_queue to false for the matched users
            await db.collection('sessions').updateMany(
                { _id: { $in: [userID, match._id] } },
                { $set: { in_queue: false } }
            );

            if (result) {
                console.log('created new room', room_id);
                return { room_id: result._id, message: 'success' }
            }

            throw Boom.badImplementation();
        }
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Pass the Aux API';
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
