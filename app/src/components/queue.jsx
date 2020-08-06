/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */

import React from "react";
import SwapIcon from "./swap.jsx";
import SongInfo from "./song_info.jsx"
import "../styles.css";

const Queue = (props) => {
  const songs = props.songs;
  
  // Iterate over song array and create new array of QueueItems
  const songList = songs.map((song, index) => {
    return <QueueItem key={index} song={song} />
  });

  // Render Queue with array of QueueItems
  return (
    <div id="queue" className="flex flex-col h-full w-full md:w-2/5 md:block md:mr-4 bg-gray-800 rounded shadow-lg min-h-0">
      <div className="relative flex w-full border-b-2 border-gray-500">
        <p className="text-lg uppercase tracking-wider font-mono p-3">
          Queue
        </p>
        <SwapIcon chatActive={false}/>
      </div>
      <div className="overflow-y-auto scrollbar w-full min-h-0" style={{height: '88%'}}>
        {songList}
      </div>      
    </div>
  );
};

const QueueItem = (props) => {
  return (
    <div className="flex p-3 text-gray-300 items-center bg-gray-800 border-b-2 border-gray-600 hover:border-customgreen ">
      <SongInfo song={props.song} />
    </div>
  );
};

export default Queue;
