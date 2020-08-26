import { getAccessToken } from "./api.js";
import Bowser from "bowser";

var insertPlayerInterval;
var device;

export var player;

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

const createEventHandlers = () => {
  player.on("initialization_error", (e) => {
    console.error(e);
  });
  player.on("authentication_error", (e) => {
    console.error(e);
  });
  player.on("account_error", (e) => {
    console.error(e);
  });
  player.on("playback_error", (e) => {
    console.error(e);
  });

  // Playback status updates
  player.on("player_state_changed", (state) => {
    //console.log(state);
  });

  // Ready
  player.addListener("ready", ({ device_id }) => {
    device = {
      id: device_id,
      name: "Browser Playback"
    }
  });
};

const insertPlayer = async () => {
  if (window.Spotify != null) {
    clearInterval(insertPlayerInterval); // clear the interval once found

    const token = await getAccessToken();
    player = new window.Spotify.Player({
      name: "Pass the AUX",
      /* this looks weird but is just boilerplate for initializing the player */
      getOAuthToken: (callback) => {
        callback(token);
      },
    });

    createEventHandlers();
    player.connect();
  }
};

export const initPlayer = async () => {
  return new Promise((resolve) => {
    insertPlayerInterval = setInterval(() => {
      insertPlayer();

      const getDeviceIDInterval = setInterval(() => {
        if (device) {
          const playerData = { device: device, player: player }
          resolve(playerData);
          clearInterval(getDeviceIDInterval);
        }
      }, 250);

    }, 250);
  });
};
