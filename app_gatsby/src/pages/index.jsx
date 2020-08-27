/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import SEO from "../components/seo"

import SearchBar from "../components/searchbar.jsx";
import Player from "../components/player.jsx";
import Queue from "../components/queue.jsx";
import Chat from "../components/chat.jsx";
import Header from "../components/header.jsx";
import { Modal, modals } from "../components/modal.jsx"
import { addToQueue, startSong, pauseSong, resumeSong, nextSong, previousSong, getDevices, getAccessToken, enterRoom, setSongPosition, updateHistoryInRoom } from "../api.js"
import { addSDKScript, isPlaybackCapable, initPlayer } from "../web_playback.js";
const Nes = require("@hapi/nes/lib/client")

const App = () => {
  const [songs, updateSongs] = useState([]);
  const [history, setHistory] = useState([]);
  const [isPaused, setIsPaused] = useState(true);
  const [songStarted, setSongStarted] = useState(false);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [playbackCapable, setPlaybackCapable] = useState(true);

  const [signInLink, setSignInLink] = useState(null);
  const [seekUpdateElapsed, setSeekUpdateElapsed] = useState(0);
  const [room, setRoom] = useState("");
  const [WSClient, setWSClient] = useState(null);

  const [device, setDevice] = useState(null);
  const [deviceSearching, setDeviceSearching] = useState(true);
  
  const [queueVisible, setQueueVisible] = useState(true);
  const [modalBody, setModalBody] = useState("");
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  
  const songInQueue = songs.length > 0; // bool that is true if there is a song in the queue

  /* Initialization function that fires on mount
    If the user is signed in, sets up the approproiate device connection, otherwise prompts them to log in */
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

  /* Fires after the user is authorized, connected to a device, and in a room */
  useEffect(() => {
    if (isAuthorized && device && room) {
      initRoomSocket();
    }
  }, [isAuthorized, device, room]);

  /* Fires after the sign in link has been set with the query params it needs (room ID and playback capability) */
  useEffect(() => {
    if (signInLink) {
      setModalBody(modals.SignIn);
      setShowModal(true);
    }
  }, [signInLink]);

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
    }, 1000)
  }

  const initRoomSocket = async () => {
    console.log('entering room', room, 'with device ', device.id);
    const { msg } = await enterRoom(room);
    if (msg === "error") {
      setShowModal(true);
      setModalBody(modals.RoomNotFound);
      window.history.pushState(null, null, "/");
    }
    else {
      const client = new Nes.Client("ws://localhost:3000");
      await client.connect();
      client.subscribe(`/rooms/playback/${room}`, handleRoomPlaybackUpdate);
      setWSClient(client);
    }
    
  }

  const startRefreshTimer = () => {
    // refresh the access token roughly every hour if the user has not left the page
    const almost_one_hour = 55 * 60000; // 55 mins
    setInterval(() => {
      getAccessToken();
    }, almost_one_hour);
  }

  /* Function that fires whenever the user receives a web socket message
    Updates the local state and the user's spotify playback with relevant info */
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
      case 'previous':
        await previousSong(device.id, update.current_song, room, false);
        updateSongs(songs => [history[history.length - 1], ...songs]);
        setIsPaused(false);
        break;
      case 'queue':
        await addToQueue(device.id, update.current_song, room, false);
        updateSongs(songs => songs.concat(update.current_song));
        break;
      case 'seek':
        await setSongPosition(device.id, update.position_ms, room, false);
        setSeekUpdateElapsed(update.position_ms);
        /* TODO: lift progress bar state so it can be visually updated here */
        break;
      default: break;
    }
  }

  /* When a song is added to the queue, get the information about that song */
  const onAdd = async (e) => {
    const parentNode = e.target.closest("#result-parent").firstChild;
    const newQueueItem = {
      name: parentNode.children[1].children[0].innerText,
      artists: parentNode.children[1].children[1].innerText,
      coverUrl: parentNode.children[0].src,
      uri: parentNode.dataset.uri,
      runtime: parentNode.dataset.runtime,
    };

    // the first song is played immediately and isn't added to the queue
    // spotify automatically adds the first song played to the queue
    if (songs.length === 0) {
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
    if (history.length > 0) {
      await previousSong(device.id, room); // asks Spotify to play the previous song
      updateSongs(songs => {
        const updated = [...songs];
        updated[0] = history[history.length - 1];
        return updated;
      });
      setIsPaused(false);
    }
  }

  const onRightSkip = async () => {
    if (room && room !== "") {
      await updateHistoryInRoom(songs[0], room); // if user is in a room, add the skipped song to the server history
    }
    await nextSong(device.id, songs[1], room, true); // moves to the next song in spotify queue

    setHistory(history => [...history, songs[0]]); // add the skipped song to the local history
    updateSongs(songs => songs.filter((s, i) => i > 0)); // removes the first song from the queue list and returns the new list
    setIsPaused(false);
  }

  const onProgressComplete = async () => {
    if (room && room !== "") {
      await updateHistoryInRoom(songs[0], room);
    }
    setHistory(history => [...history, songs[0]]);
    updateSongs(songs => songs.filter((s, i) => i > 0));
  }

  const onSwapClick = () => {
    setQueueVisible(queueVisible => !queueVisible);
  }

  return (
    <>
      <SEO title="App" />
      <Modal body={modalBody} loading={deviceSearching} deviceName={device? device.name : ""}
        showDialog={showModal} close={closeModal} mobile={false} apiLink={signInLink} />
      <div className="flex flex-col w-screen h-screen bg-bgColor text-text overflow-hidden">
        <Header device={device} deviceSearching={deviceSearching} signInLink={signInLink}/>
        <div className="container flex flex-col flex-grow mx-auto my-4 px-5 overflow-y-auto h-full scrollbar" style={{height: '85%'}}>
          <SearchBar onAdd={onAdd} />
          <div className="flex h-full ">
              <Queue songs={songs} onSwapClick={onSwapClick} queueVisible={queueVisible}/>
              <Chat room={room} client={WSClient} onSwapClick={onSwapClick} queueVisible={queueVisible} authorized={isAuthorized}/>
          </div>
        </div>
        <Player songInQueue={songInQueue} isPaused={isPaused} song={songs[0]} room={room} device={device} playbackCapable={playbackCapable} seekElapsed={seekUpdateElapsed}
          handlePauseChange={handlePauseChange} onLeftSkip={onLeftSkip} onRightSkip={onRightSkip} onProgressComplete={onProgressComplete}/>
      </div>
    </>
  );
};

export default App;
