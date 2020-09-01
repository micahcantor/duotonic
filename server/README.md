# Pass the Aux Hapi Server
*An API server built with Hapi for Pass the Aux*

## Installation
1. Navigate your terminal to this repository's root directory.
1. Execute the command 'npm install'.
1. Create a .env file and follow the formatting guide.
1. If TLS_ENABLED=true, edit the paths in index.js to match your certificates' locations.
1. Start the server with the command 'npm start' or equivalent.


## .env Format
```
HOST=(examples: localhost or https://google.com)
PORT=(example: 3000)
TLS_ENABLED=(values: true or false)

COOKIE_PASSWORD=(Random UUID string)

SPOTIFY_CLIENT_ID=(Spotify API client ID)
SPOTIFY_CLIENT_SECRET=(Spotify API client secret)

MONGO_URI=(Full MongoDB URI)
```