'use strict';

require('dotenv').config();

const Path = require('path');
const Fs = require('fs');
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Bell = require('@hapi/bell');
const Yar = require('@hapi/yar');
const RequireHttps = require('hapi-require-https');
const Axios = require('axios');

const tls = {
    cert: Fs.readFileSync(Path.resolve(__dirname, '../ssl/localhost.crt')),
    key: Fs.readFileSync(Path.resolve(__dirname, '../ssl/localhost.key'))
};

const requestSpotify = (endpoint, method, query, accessToken) => {

    return Axios({
        method,
        url: 'https://api.spotify.com/v1/' + endpoint,
        headers: { 'Authorization': `Bearer ${accessToken}` },
        params: query
    });
};

const init = async () => {

    const server = Hapi.server({
        host: process.env.HOST,
        port: process.env.PORT,
        tls
    });

    await server.register([Bell, RequireHttps,
        {
            plugin: Yar,
            options: {
                cookieOptions: {
                    password: process.env.COOKIE_PASSWORD
                }
            }
        }
    ]);

    server.auth.strategy('spotify', 'bell', {
        provider: 'spotify',
        password: process.env.COOKIE_PASSWORD,
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    });

    server.route({
        method: ['POST', 'GET'],
        path: '/auth/spotify',
        options: {
            auth: {
                mode: 'try',
                strategy: 'spotify'
            },
            handler: function (request, h) {

                if (!request.auth.isAuthenticated) {
                    return h.redirect('/login');
                }

                request.yar.set('spotify', request.auth.credentials);

                return h.redirect('/');
            }
        }
    });

    server.route({
        method: ['GET'],
        path: '/login',
        options: {
            handler: function (request, h) {

                if (!request.yar.get('spotify')) {
                    return '<form action="/auth/spotify" method="post"><button name="login" value="login">Login</button></form>';
                }

                return h.redirect('/');
            }
        }
    });

    server.route({
        method: ['GET'],
        path: '/api/spotify/{endpoint*}',
        options: {
            handler: async function (request, h) {

                if (!request.yar.get('spotify')) {
                    return h.redirect('/login');
                }

                try {
                    const response = await requestSpotify(request.params.endpoint, 'get', request.query, request.yar.get('spotify').token);
                    return await JSON.stringify(response.data);
                }
                catch (error) {
                    throw Boom.badRequest();
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return request.yar.id;
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
