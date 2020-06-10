/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */

import React from "react";
import "../styles.css";

const Queue = (props) => {
  const songs = props.songs;

  // Iterate over song array and create new array of QueueItems
  const songList = songs.map((song, index) => <QueueItem key={index} song={song} />);

  // Render Queue with array of QueueItems
  return (
    <div className="h-auto w-1/4 max-h-full md:w-1/3 mr-4 bg-gray-800 rounded shadow-lg overflow-y-scroll scrollbar">
      <p className="uppercase tracking-wider font-mono p-3 border-gray-500 border-b-2">
        Queue
      </p>
      <div className="rounded divide-y divide-gray-600"></div>
      <div>
        {songList}
      </div>
    </div>
  );
};

const QueueItem = (props) => {
  return (
    <div className="p-3 flex text-gray-300 flex-no-wrap items-center bg-gray-800 border-b-2 border-gray-600 hover:border-customgreen ">
      <img
        className="h-16 max-w-none rounded shadow"
        alt="Album cover"
        src={props.song.coverUrl}
      />
      <div className="pl-5 whitespace-no-wrap font-light">
        <p>{props.song.name}</p>
        <p className="text-gray-500 text-sm">{props.song.artist}</p>
      </div>
    </div>
  );
};

export default Queue;
