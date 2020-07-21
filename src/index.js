'use strict';

require('dotenv').config();

const Path = require('path');
const Fs = require('fs');
const qs = require('qs');
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Bell = require('@hapi/bell');
const RequireHttps = require('hapi-require-https');
const Axios = require('axios');
const ObjectId = require('mongodb').ObjectId;

const loadDB = require('./db');

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

const refreshAccessToken = async (db, id) => {

    const credsString = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
    const credsBase64 = Buffer.from(credsString).toString('base64');
    const sessionInfo = await db.collection('sessions').findOne({ _id: id });
    const userRefreshToken = sessionInfo.auth.artifacts.refresh_token;

    const response = await Axios({
        method: 'post', 
        url: 'https://accounts.spotify.com/api/token',
        data: qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: userRefreshToken
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credsBase64}`
        }
    });
    
    return response.data.access_token;
}

const init = async () => {

    const db = await loadDB();

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
        ttl: null,
        isSecure: (process.env.TLS_ENABLED === 'true'),
        isHttpOnly: true,
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
        isSecure: false
    });

    server.route({
        method: ['POST', 'GET'],
        path: '/auth/spotify',
        options: {
            auth: {
                mode: 'try',
                strategy: 'spotify'
            },
            handler: async function (request, h) {

                if (!request.auth.isAuthenticated) {
                    throw Boom.unauthorized();
                }

                const result = await db.collection('sessions').insertOne({ auth: request.auth });
                if (result) {
                    const id = result.ops[0]._id.toString();
                    h.state('sessionId', id);
                    return { sessionId: id };
                }

                throw Boom.badImplementation();
            }
        }
    });

    server.route({
        method: ['GET'],
        path: '/api/spotify/{endpoint*}',
        options: {
            handler: async function (request, h) {
                
                if (!request.state.sessionId) {
                    throw Boom.unauthorized('Must have a session cookie.');
                }
                
                const id = ObjectId(request.state.sessionId);
                const token = await refreshAccessToken(db, id);
                if (token) {
                    try {
                        const response = await requestSpotify(request.params.endpoint, 'get', request.query, token);
                        return await JSON.stringify(response.data);
                    }
                    catch (error) {
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
