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
import { addToQueue, startSong, pauseSong, resumeSong, nextSong, previousSong, getDevices, getAccessToken } from "./api.js"
import { addSDKScript, isPlaybackCapable, initPlayer } from "./web_playback.js";

const PlayerPage = () => {
  const [songs, updateSongs] = useState([]);
  const [isPaused, setIsPaused] = useState(true);
  const [songStarted, setSongStarted] = useState(false);
  const [webPlayer, setWebPlayer] = useState(null);

  const [device, setDevice] = useState(null);
  const [deviceSearching, setDeviceSearching] = useState(true);
  
  const [modalBody, setModalBody] = useState("");
  const [showModal, setShowModal] = useState(true);
  const closeModal = () => setShowModal(false);
  
  const songInQueue = songs.length > 0; // bool that is true if there is a song in the queue
  const isAuthorized = document.cookie === "isAuthorized=true";
  const playbackCapable = isPlaybackCapable();
  const signInLink = `http://localhost:3000/auth/spotify${playbackCapable ? '?wantsWebPlayback=true' : null}`
   
  // on mount, check if the user's device is capable of web playback, and if so set it up
  useEffect(() => {
    const wrapper = async () => {
      if (isAuthorized) {
        if (playbackCapable) {
          setShowModal(false);
          addSDKScript();
          const playerData = await initPlayer();
          setDevice(playerData.deviceID);
          setWebPlayer(playerData.player);
        }
        else {
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
      }
      else {
        setModalBody("SignIn")
      }

      const almost_one_hour = 55 * 60000; // 55 mins
      // refresh the access token roughly every hour if the user has not left the page
      setInterval(() => {
        getAccessToken();
      }, almost_one_hour)
    }
    wrapper();
  }, []);

  useEffect(() => {
    if (webPlayer) {
      webPlayer.on("player_state_changed", (state) => {
        const currentSong = state.track_window.current_track;
        console.log(currentSong);
      });
    }
  }, [webPlayer])

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
      await startSong(device, newQueueItem.uri);
      setIsPaused(false);
    }
    else {
      await addToQueue(device, newQueueItem.uri);
    }

    // update songs state afterwards to avoid stale state issues
    updateSongs(songs => songs.concat(newQueueItem));
  };

  const handlePauseChange = () => {
    setIsPaused(isPaused => !isPaused);

    if (isPaused && !songStarted) {
      startSong(device, songs[0].uri);
    } else if (isPaused && songStarted) {
      resumeSong(device);
    } else {
      pauseSong(device);
    }

    setSongStarted(true);
  }

  const onLeftSkip = async () => {
    await previousSong(device);
    setIsPaused(false);
  }

  const onRightSkip = async () => {
    await nextSong(device); // moves to the next song in spotify queue
    setIsPaused(false);      // start the song in case previous song was paused

    // removes the first song from the queue list and returns the new list
    updateSongs(songs => songs.filter((s, i) => i > 0));
  }

  return (
    <>
      <Modal body={modalBody} loading={deviceSearching} deviceName={device? device.name : ""}
        showDialog={showModal} close={closeModal} mobile={false} apiLink={signInLink} />

      <div className="grid grid-rows-pancake text-white w-screen h-screen bg-gray-900 overflow-hidden">
        <Header />
        <div className="container flex flex-col mx-auto px-5 pt-4 overflow-y-auto scrollbar">
          <SearchBar onAdd={onAdd} />
          <div className="flex mb-4 h-full">
            <Queue songs={songs} />
            <Chat />
          </div>
        </div>
        <Player songInQueue={songInQueue} isPaused={isPaused} song={songs[0]} device={device} 
          handlePauseChange={handlePauseChange} onLeftSkip={onLeftSkip} onRightSkip={onRightSkip}/>
        
      </div>
    </>
  );
};

const playPage = <PlayerPage />;
ReactDOM.render(playPage, document.getElementById("root"));
