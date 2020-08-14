/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import SearchBar from "./components/searchbar.jsx";
import Player from "./components/player.jsx";
import Queue from "./components/queue.jsx";
import Chat from "./components/chat.jsx";
import Header from "./components/header.jsx";
import { Modal } from "./components/modal.jsx"
import { addToQueue, startSong, pauseSong, resumeSong, nextSong, previousSong, getDevices, getAccessToken, enterRoom } from "./api.js"
import { addSDKScript, isPlaybackCapable, initPlayer } from "./web_playback.js";
const Nes = require("@hapi/nes/lib/client")

const PlayerPage = () => {
  const [songs, updateSongs] = useState([]);
  const [isPaused, setIsPaused] = useState(true);
  const [songStarted, setSongStarted] = useState(false);
  const [webPlayer, setWebPlayer] = useState(null);

  const [signInLink, setSignInLink] = useState("");
  const [room, setRoom] = useState("");
  const [device, setDevice] = useState(null);
  const [deviceSearching, setDeviceSearching] = useState(true);
  
  const [modalBody, setModalBody] = useState("");
  const [showModal, setShowModal] = useState(true);
  const closeModal = () => setShowModal(false);
  
  const songInQueue = songs.length > 0; // bool that is true if there is a song in the queue

  // on mount, check if the user's device is capable of web playback, and if so set it up
  useEffect(() => {
    const isAuthorized = document.cookie === "isAuthorized=true";
    setupPlayer(isAuthorized);
    initRoom(isAuthorized);
    setRefreshTimer();
  }, []);

  useEffect(() => {
    if (webPlayer) {
      webPlayer.on("player_state_changed", (state) => {
        const currentSong = state.track_window.current_track;
        console.log(currentSong);
      });
    }
  }, [webPlayer]);

  const setupPlayer = async (isAuthorized) => {
    const playbackCapable = isPlaybackCapable();
    setSignInLink(`http://localhost:3000/auth/spotify${playbackCapable ? '?wantsWebPlayback=true' : ""}`)

    if (isAuthorized && playbackCapable) {
      setShowModal(false);
      addSDKScript();
      const playerData = await initPlayer();
      setDeviceSearching(false);
      setDevice(playerData.device);
      setWebPlayer(playerData.player);
    }
    else if (isAuthorized && !playbackCapable) {
      setModalBody("DeviceSearch");
      const searchForDevices = setInterval(() => {
        getDevices().then(devices => {
          if (devices && devices.length > 0) {
            setDevice(devices[0]);
            setDeviceSearching(false);
            clearInterval(searchForDevices);
          }
        })
      }, 2000)
    }
    else {
      setModalBody("SignIn")
    }
  }

  const initRoom = async (isAuthorized) => {
    const queryParams = new URLSearchParams(window.location.search);
    const roomID = queryParams.get("room");
    if (isAuthorized && roomID) {
      console.log('entering room', roomID);
      setRoom(roomID);
      const client = new Nes.Client("ws://localhost:3000");
      await client.connect();
      client.subscribe(`/rooms/${roomID}`, (update, flags) => {
        console.log(update);
      });
      await enterRoom(roomID);
    }
  }

  const setRefreshTimer = () => {
    // refresh the access token roughly every hour if the user has not left the page
    const almost_one_hour = 55 * 60000; // 55 mins
    setInterval(() => {
      getAccessToken();
    }, almost_one_hour);
  }

  const onAdd = async (e) => {
    const parentNode = e.target.closest("#result-parent").firstChild;
    const newQueueItem = {
      name: parentNode.children[1].children[0].innerText,
      artists: parentNode.children[1].children[1].innerText,
      coverUrl: parentNode.children[0].src,
      uri: parentNode.children[1].children[3].innerText,
      runtime: parentNode.children[1].children[4].innerText,
    };

    // the first song is played immediately and isn't added to the queue
    // spotify automatically adds the first song played to the queue
    if (songs.length == 0) {
      await startSong(device.id, newQueueItem, room);
      setIsPaused(false);
    }
    else {
      await addToQueue(device.id, newQueueItem, room);
    }

    // update songs state afterwards to avoid stale state issues
    updateSongs(songs => songs.concat(newQueueItem));
  };

  const handlePauseChange = () => {
    setIsPaused(isPaused => !isPaused);

    if (isPaused && !songStarted) {
      startSong(device.id, songs[0].uri, room);
    } else if (isPaused && songStarted) {
      resumeSong(device.id, room);
    } else {
      pauseSong(device.id, room);
    }

    setSongStarted(true);
  }

  const onLeftSkip = async () => {
    await previousSong(device.id, room);
    updateSongs(songs => songs.filter((s, i) => i !== songs.length - 1));
    setIsPaused(false);
  }

  const onRightSkip = async () => {
    await nextSong(device.id, room, songs[1]); // moves to the next song in spotify queue
    // removes the first song from the queue list and returns the new list
    updateSongs(songs => songs.filter((s, i) => i > 0));
    setIsPaused(false);
  }

  const onProgressComplete = () => {
    updateSongs(songs => songs.filter((s, i) => i > 0));
  }

  return (
    <>
      <Modal body={modalBody} loading={deviceSearching} deviceName={device? device.name : ""}
        showDialog={showModal} close={closeModal} mobile={false} apiLink={signInLink} />
      <div className="grid grid-rows-pancake text-white w-screen h-screen bg-gray-900 overflow-hidden">
        <Header device={device} deviceSearching={deviceSearching}/>
        <div className="container flex flex-col mx-auto px-5 pt-4 overflow-y-auto scrollbar">
          <SearchBar onAdd={onAdd} />
          <div className="flex mb-4 h-full">
            <Queue songs={songs} />
            <Chat />
          </div>
        </div>
        <Player songInQueue={songInQueue} isPaused={isPaused} song={songs[0]} device={device} 
          handlePauseChange={handlePauseChange} onLeftSkip={onLeftSkip} onRightSkip={onRightSkip} onProgressComplete={onProgressComplete}/>
      </div>
    </>
  );
};

const playPage = <PlayerPage />;
ReactDOM.render(playPage, document.getElementById("root"));
