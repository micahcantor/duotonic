/* eslint-disable react/prop-types */
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import SearchBar from "./components/searchbar.jsx";
import Player from "./components/player.jsx";
import Queue from "./components/queue.jsx";
import Chat from "./components/chat.jsx";
import Header from "./components/header.jsx";
import { addSDKScript, isPlaybackCapable, initPlayer } from "./web_playback.js";

const PlayerPage = ({ deviceID }) => {
  const [songs, updateSongs] = useState([]);
  const songInQueue = songs.length > 0; // bool that is true if there is a song in the queue

  const onAdd = (e) => {
    const parentNode = e.target.closest("#result-parent").firstChild
    const newQueueItem = {
      name: parentNode.children[1].children[0].innerText,
      artists: parentNode.children[1].children[1].innerText,
      coverUrl: parentNode.children[0].src,
      uri: parentNode.children[1].children[3].innerText
    };
    updateSongs(songs.concat(newQueueItem));
  }
  
  return (
    <div className="grid grid-rows-pancake text-white w-screen h-screen bg-gray-900 overflow-hidden">
      <Header />
      <div className="container flex flex-col mx-auto px-5 pt-4 overflow-y-auto">
        <SearchBar onAdd={onAdd}/>
        <div className="flex mb-4 h-full">
          <Queue songs={songs} />
          <Chat />
        </div>
      </div>
      <Player songInQueue={songInQueue} song={songs[0]} deviceID={deviceID}/>
    </div>    
  );
};

if (isPlaybackCapable()) {
  addSDKScript();
  initPlayer().then(id => {
    const playPage = <PlayerPage deviceID={id} />
    ReactDOM.render(playPage, document.getElementById("root"));
  });
} else {
  const playPage = <PlayerPage deviceID={null}/>
  ReactDOM.render(playPage, document.getElementById("root"));
}


