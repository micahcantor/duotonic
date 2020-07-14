/* eslint-disable react/prop-types */
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import SearchBar from "./components/searchbar.jsx";
import Player from "./components/player.jsx";
import Queue from "./components/queue.jsx";
import Chat from "./components/chat.jsx";
import Header from "./components/header.jsx";

const PlayerPage = () => {
  const [songs, updateSongs] = useState([]);
  const songInQueue = songs.length > 0; // bool that is true if there is a song in the queue

  const onAdd = (e) => {
    const parentNode = e.target.closest("#result-parent").firstChild
    const newQueueItem = {
      name: parentNode.children[1].children[0].innerText,
      artists: parentNode.children[1].children[1].innerText,
      coverUrl: parentNode.children[0].src
    };
    updateSongs(songs.concat(newQueueItem));
  }
  
  return (
    <div className="grid grid-rows-pancake text-white w-screen h-screen bg-gray-900 overflow-hidden">
      <Header />
      <div className="container mx-auto p-5 overflow-y-scroll">
          <SearchBar onAdd={onAdd}/>
          <div className="flex h-85">
            <Queue songs={songs} />
            <Chat />
          </div>
      </div>
      <Player songInQueue={songInQueue} song={songs[0]} />
    </div>
  );
};

const playPage = <PlayerPage />;

ReactDOM.render(playPage, document.getElementById("root"));
