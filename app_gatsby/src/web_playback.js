import { getAccessToken } from "./api.js";
import Bowser from "bowser";

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

export const addSDKScript = () => {
  const webSDK = document.createElement("script");
  webSDK.setAttribute("src", "https://sdk.scdn.co/spotify-player.js");
  document.body.appendChild(webSDK);
};

export const initPlayer = () => {
  return new Promise(resolve => {
    window.onSpotifyWebPlaybackSDKReady = async () => { // adds a callback function to window that fires when the SDK is ready
      const player = createPlayer();
      await player.connect();
      createErrorHandlers(player);

      const device = await getDevice(player);
      const playerData = { device: device, player: player }
      resolve(playerData);
    };
  });
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
      const device = {
        id: device_id,
        name: "Browser Playback"
      }
      resolve(device);
    });
  });
}

const createPlayer = () => {
  const player = new window.Spotify.Player({
    name: "Duotonic",
    /* this function is run when player.connect() is called */
    getOAuthToken: function(callback) {
      getAccessToken().then(token => callback(token))
    },
  });

  return player;
};
