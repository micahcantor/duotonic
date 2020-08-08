'use strict';

require('dotenv').config();

const Path = require('path');
const Fs = require('fs');
const Qs = require('qs');
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Bell = require('@hapi/bell');
const RequireHttps = require('hapi-require-https');
const Axios = require('axios');
const ObjectId = require('mongodb').ObjectId;

const LoadDB = require('./db');

const tls = (process.env.TLS_ENABLED === 'true') ? {
    cert: Fs.readFileSync(Path.resolve(__dirname, '../ssl/localhost.crt')),
    key: Fs.readFileSync(Path.resolve(__dirname, '../ssl/localhost.key'))
} : undefined;

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

    console.log(current_time - last_update, ONE_HOUR, current_time - last_update > ONE_HOUR)
    if (current_time - last_update > ONE_HOUR) {
        return true;
    }

    return false;
};

const init = async () => {

    const db = await LoadDB();

    /* Uncomment to reset collection on start.
    try {
        await db.dropCollection('sessions');
    }
    catch (err) {
    }
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
        isSecure: false,
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
                    last_update: new Date()
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
        options: {
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
                    await db.collection('sessions').updateOne({ _id: id }, { $set: { last_update: current_time } });
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
        }
    });

    server.route({
        method: ['GET', 'PUT', 'POST'],
        path: '/api/spotify/{endpoint*}',
        options: {
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
                    await db.collection('sessions').updateOne({ _id: id }, { $set: { last_update: current_time } });
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
                        console.log(request.url);
                        if (error.response.data) {
                            console.log(error.response.data);
                        }

                        throw Boom.badRequest('Third-party API request failed.');
                    }
                }

                throw Boom.unauthorized('Session ID not found in database.');
            }
        }
    });

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
