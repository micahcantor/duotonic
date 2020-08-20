/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import SearchBar from "./components/searchbar.jsx";
import Player from "./components/player.jsx";
import Queue from "./components/queue.jsx";
import Chat from "./components/chat.jsx";
import Header from "./components/header.jsx";
import { Modal, modals } from "./components/modal.jsx"
import { addToQueue, startSong, pauseSong, resumeSong, nextSong, previousSong, getDevices, getAccessToken, enterRoom } from "./api.js"
import { addSDKScript, isPlaybackCapable, initPlayer } from "./web_playback.js";
const Nes = require("@hapi/nes/lib/client")

const App = () => {
  const [songs, updateSongs] = useState([]);
  const [isPaused, setIsPaused] = useState(true);
  const [songStarted, setSongStarted] = useState(false);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [playbackCapable, setPlaybackCapable] = useState(true);

  const [signInLink, setSignInLink] = useState(null);
  const [room, setRoom] = useState("");
  const [WSClient, setWSClient] = useState(null);
  const [device, setDevice] = useState(null);
  const [deviceSearching, setDeviceSearching] = useState(true);
  
  const [queueVisible, setQueueVisible] = useState(true);
  const [modalBody, setModalBody] = useState("");
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  
  const songInQueue = songs.length > 0; // bool that is true if there is a song in the queue

  // on mount, check if the user's device is capable of web playback, and if so set it up
  useEffect(() => {
    const isAuthorized = document.cookie === "isAuthorized=true";
    const playbackCapable = isPlaybackCapable();
    const queryParams = new URLSearchParams(window.location.search);
    const room = queryParams.get("room");
    
    if (isAuthorized && playbackCapable) {
      setupWebPlayer();
    }
    else if (isAuthorized && !playbackCapable) {
      setupRemoteDevice();
    }
    else {
      const playbackQuery = playbackCapable ? '?wantsWebPlayback=true' : "";
      const roomQuery = room ? `&room=${room}` : "";
      setSignInLink(`http://localhost:3000/auth/spotify${playbackQuery}${roomQuery}`);
    }

    startRefreshTimer();
    setIsAuthorized(isAuthorized);
    setPlaybackCapable(playbackCapable);
    setRoom(room);
  }, []);

  useEffect(() => {
    if (isAuthorized && device && room) {
      initRoomSocket();
    }
  }, [isAuthorized, device, room])

  useEffect(() => {
    if (signInLink) {
      setModalBody(modals.SignIn);
      setShowModal(true);
    }
  }, [signInLink])

  const setupWebPlayer = async () => {
    addSDKScript();
    const playerData = await initPlayer();

    setShowModal(false);
    setDeviceSearching(false);
    setDevice(playerData.device);
  }

  const setupRemoteDevice = () => {
    setModalBody(modals.DeviceSearch);

    //every 2 seconds, check if there are any active devices, and if so, set it as the device
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

  const initRoomSocket = async () => {
    console.log('entering room', room, 'with device ', device.id);

    const client = new Nes.Client("ws://localhost:3000");
    await client.connect();
    client.subscribe(`/rooms/playback/${room}`, handleRoomPlaybackUpdate);

    setWSClient(client);
    await enterRoom(room);
  }

  const startRefreshTimer = () => {
    // refresh the access token roughly every hour if the user has not left the page
    const almost_one_hour = 55 * 60000; // 55 mins
    setInterval(() => {
      getAccessToken();
    }, almost_one_hour);
  }

  const handleRoomPlaybackUpdate = async (update) => {
    console.log(update);
    switch(update.type) {
      case 'start':
        await startSong(device.id, update.current_song, room, false);
        updateSongs(songs => songs.concat(update.current_song));
        setIsPaused(false);
        break;
      case 'resume':
        await resumeSong(device.id, room, false);
        setIsPaused(false);
        break;
      case 'pause':
        await pauseSong(device.id, room, false);
        setIsPaused(true);
        break;
      case 'next':
        await nextSong(device.id, update.current_song, room, false);
        updateSongs(songs => songs.filter((s, i) => i > 0));
        setIsPaused(false);
        break;
      case 'queue':
        await addToQueue(device.id, update.current_song, room, false);
        updateSongs(songs => songs.concat(update.current_song));
        break;
    }
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
      await startSong(device.id, newQueueItem, room, true);
      setIsPaused(false);
    }
    else {
      await addToQueue(device.id, newQueueItem, room, true);
    }

    // update songs state afterwards to avoid stale state issues
    updateSongs(songs => songs.concat(newQueueItem));
  };

  const handlePauseChange = async () => {
    setIsPaused(isPaused => !isPaused);

    if (isPaused && !songStarted && songInQueue) {
      await startSong(device.id, songs[0].uri, room, true);
    } else if (isPaused && songStarted && songInQueue) {
      await resumeSong(device.id, room, true);
    } else if (songInQueue) {
      await pauseSong(device.id, room, true);
    }

    setSongStarted(true);
  }

  const onLeftSkip = async () => {
    await previousSong(device.id, room);
    updateSongs(songs => songs.filter((s, i) => i !== songs.length - 1));
    setIsPaused(false);
  }

  const onRightSkip = async () => {
    await nextSong(device.id, songs[1], room, true); // moves to the next song in spotify queue
    // removes the first song from the queue list and returns the new list
    updateSongs(songs => songs.filter((s, i) => i > 0));
    setIsPaused(false);
  }

  const onProgressComplete = () => {
    updateSongs(songs => songs.filter((s, i) => i > 0));
  }

  const onSwapClick = () => {
    setQueueVisible(queueVisible => !queueVisible);
  }

  return (
    <>
      <Modal body={modalBody} loading={deviceSearching} deviceName={device? device.name : ""}
        showDialog={showModal} close={closeModal} mobile={false} apiLink={signInLink} />
      <div className="grid grid-rows-pancake text-white w-screen h-screen bg-gray-900 overflow-hidden">
        <Header device={device} deviceSearching={deviceSearching}/>
        <div className="container flex flex-col justify-center mx-auto px-5 overflow-y-auto scrollbar">
          <SearchBar onAdd={onAdd} />
          <div className="flex" style={{height: '85%'}}>
            { queueVisible
              ? <Queue songs={songs} onSwapClick={onSwapClick}/>
              : <Chat room={room} client={WSClient} onSwapClick={onSwapClick} authorized={isAuthorized}/>
            }
          </div>
        </div>
        <Player songInQueue={songInQueue} isPaused={isPaused} song={songs[0]} device={device} playbackCapable={playbackCapable}
          handlePauseChange={handlePauseChange} onLeftSkip={onLeftSkip} onRightSkip={onRightSkip} onProgressComplete={onProgressComplete}/>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
