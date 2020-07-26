/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import SearchBar from "./components/searchbar.jsx";
import Player from "./components/player.jsx";
import Queue from "./components/queue.jsx";
import Chat from "./components/chat.jsx";
import Header from "./components/header.jsx";
import { addToQueue, startSong, pauseSong, resumeSong, nextSong, previousSong } from "./api.js"
import { addSDKScript, isPlaybackCapable, initPlayer } from "./web_playback.js";

const PlayerPage = () => {
  const [songs, updateSongs] = useState([]);
  const [isPaused, setIsPaused] = useState(true);
  const [songStarted, setSongStarted] = useState(false);
  const [deviceID, setDeviceID] = useState(null);
  const songInQueue = songs.length > 0; // bool that is true if there is a song in the queue

  useEffect(() => {
    if (isPlaybackCapable()) {
      addSDKScript();
      initPlayer().then((id) => {
        setDeviceID(id);
      });
    }
  }, []);

  const onAdd = async (e) => {
    const parentNode = e.target.closest("#result-parent").firstChild;
    const newQueueItem = {
      name: parentNode.children[1].children[0].innerText,
      artists: parentNode.children[1].children[1].innerText,
      coverUrl: parentNode.children[0].src,
      uri: parentNode.children[1].children[3].innerText,
    };

    if (songs.length == 0) {
      await startSong(deviceID, newQueueItem.uri);
      setIsPaused(false);
    }
    else {
      await addToQueue(deviceID, newQueueItem.uri);
    }

    updateSongs(songs => songs.concat(newQueueItem));
  };

  const handlePauseChange = () => {
    setIsPaused(isPaused => !isPaused);

    if (isPaused && !songStarted) {
      startSong(deviceID, songs[0].uri);
    } else if (isPaused && songStarted) {
      resumeSong(deviceID);
    } else {
      pauseSong(deviceID);
    }

    setSongStarted(true);
  }

  const onLeftSkip = async () => {
    await previousSong(deviceID);
    setIsPaused(false);
  }

  const onRightSkip = async () => {
    await nextSong(deviceID); // moves to the next song in spotify queue
    setIsPaused(false);      // start the song in case previous song was paused

    // removes the first song from the queue list and returns the new list
    updateSongs(songs => songs.filter((s, i) => i > 0));
  }

  return (
    <div className="grid grid-rows-pancake text-white w-screen h-screen bg-gray-900 overflow-hidden">
      <Header />
      <div className="container flex flex-col mx-auto px-5 pt-4 overflow-y-auto scrollbar">
        <SearchBar onAdd={onAdd} />
        <div className="flex mb-4 h-full">
          <Queue songs={songs} />
          <Chat />
        </div>
      </div>
      <Player songInQueue={songInQueue} isPaused={isPaused} song={songs[0]} deviceID={deviceID} 
        handlePauseChange={handlePauseChange} onLeftSkip={onLeftSkip} onRightSkip={onRightSkip}/>
        
    </div>
  );
};

const playPage = <PlayerPage />;
ReactDOM.render(playPage, document.getElementById("root"));
