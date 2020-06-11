/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */

import React from "react";
import SwapIcon from "./swap.jsx";
import "../styles.css";

const Queue = (props) => {
  const songs = props.songs;

  // Iterate over song array and create new array of QueueItems
  const songList = songs.map((song, index) => <QueueItem key={index} song={song} />);

  // Render Queue with array of QueueItems
  return (
    <div className="relative hidden h-full w-full md:block mr-4 bg-gray-800 rounded shadow-lg">
      <div className="flex w-full border-b-2 border-gray-500">
        <p className="uppercase tracking-wider font-mono p-3">
          Queue
        </p>
        <SwapIcon />
      </div> 
      <div className="overflow-y-scroll scrollbar w-full" style={{height: "90%"}}>
        {songList}
      </div>
    </div>
  );
};

const QueueItem = (props) => {
  return (
    <div className="p-3 flex text-gray-300 flex-no-wrap items-center bg-gray-800 border-b-2 border-gray-600 hover:border-customgreen ">
      <img className="h-16 max-w-none rounded shadow" alt="Album cover" src={props.song.coverUrl}/>
      <div className="pl-5 whitespace-no-wrap font-light">
        <p>{props.song.name}</p>
        <p className="text-gray-500 text-sm">{props.song.artist}</p>
      </div>
    </div>
  );
};

export default Queue;
