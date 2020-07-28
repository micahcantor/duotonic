/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import SearchBar from "./components/searchbar.jsx";
import Player from "./components/player.jsx";
import Queue from "./components/queue.jsx";
import Chat from "./components/chat.jsx";
import Header from "./components/header.jsx";
import { addToQueue, startSong } from "./api.js"
import { addSDKScript, isPlaybackCapable, initPlayer } from "./web_playback.js";

const PlayerPage = () => {
  const [songs, updateSongs] = useState([]);
  const [deviceID, setDeviceID] = useState(null);
  const songInQueue = songs.length > 0; // bool that is true if there is a song in the queue

  // on mount, check if the user's device is capable of web playback, and if so set it up
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

    // the first song is played immediately and isn't added to the queue
    // spotify automatically adds the first song played to the queue
    if (songs.length == 0) {
      await startSong(deviceID, newQueueItem.uri);
    }
    else {
      await addToQueue(deviceID, newQueueItem.uri);
    }

    // update songs state afterwards to avoid stale state issues
    updateSongs(songs.concat(newQueueItem));
  };

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
      <Player songInQueue={songInQueue} song={songs[0]} deviceID={deviceID} />
    </div>
  );
};

const playPage = <PlayerPage />;
ReactDOM.render(playPage, document.getElementById("root"));
