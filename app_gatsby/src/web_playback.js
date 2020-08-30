import { getAccessToken } from "./api.js";
import Bowser from "bowser";

var device;

export const addSDKScript = () => {
  const webSDK = document.createElement("script");
  webSDK.setAttribute("src", "https://sdk.scdn.co/spotify-player.js");

  const onReady = document.createElement("script");
  const inline = document.createTextNode(`
    window.onSpotifyWebPlaybackSDKReady = () => {
      window.Spotify = Spotify; // makes sure that this is viewable to React
    }
  `)

  onReady.appendChild(inline);
  document.body.appendChild(onReady);
  document.body.appendChild(webSDK);
};

export const isPlaybackCapable = () => {
  const browser = Bowser.getParser(window.navigator.userAgent);
  const supported = browser.satisfies({
    windows: {
      "internet explorer": ">11",
      firefox: ">2",
      chrome: ">1.0.154",
      edge: ">20.10240",
    },
    macos: {
      "internet explorer": ">11",
      firefox: ">2",
      chrome: ">1.0.154",
      edge: ">20.10240",
    },
    linux: {
      "internet explorer": ">11",
      firefox: ">2",
      chrome: ">1.0.154",
      chromium: ">1",
      edge: ">20.10240",
    },
  });
  
  return supported
};

const createErrorHandlers = (player) => {
  player.on("initialization_error", (e) => {
    console.log(e);
  });
  player.on("authentication_error", (e) => {
    console.log(e);
  });
  player.on("account_error", (e) => {
    console.log(e);
  });
  player.on("playback_error", (e) => {
    console.log(e);
  });
};

const getDevice = (player) => {
  return new Promise(resolve => {
    player.addListener("ready", ({ device_id }) => {
      device = {
        id: device_id,
        name: "Browser Playback"
      }
      resolve(device);
    });
  })
}

const insertPlayer = () => {
  const player = new window.Spotify.Player({
    name: "Duotonic",
    /* this function is run when player.connect() is called */
    getOAuthToken: function(callback) {
      getAccessToken().then(token => callback(token))
    },
  });

  return player;``
};

export const initPlayer = async () => {
  return new Promise((resolve) => {
    const insertPlayerInterval = setInterval(async () => {
      if (window.Spotify) {
        const player = await insertPlayer();
        const device = await getDevice(player);
        const playerData = { device: device, player: player }

        player.connect();
        createErrorHandlers(player);
        clearInterval(insertPlayerInterval);
        resolve(playerData);
      }
    }, 250);
  });
};
