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
    <div id="queue" className="relative h-full w-full md:w-2/5 md:block md:mr-4 bg-gray-800 rounded shadow-lg">
      <div className="flex w-full border-b-2 border-gray-500">
        <p className="text-lg uppercase tracking-wider font-mono p-3">
          Queue
        </p>
        <SwapIcon chatActive={false}/>
      </div>

      <div className="overflow-y-scroll scrollbar w-full h-85">
        {songList}
      </div>
    </div>
  );
};

const QueueItem = (props) => {
  return (
    <div className="ml-2 p-3 flex text-gray-300 flex-no-wrap items-center bg-gray-800 border-b-2 border-gray-600 hover:border-customgreen ">
      <SongInfo song={props.song} />
    </div>
  );
};

export default Queue;
