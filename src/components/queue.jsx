/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */

import React from "react";
import "../styles.css";

const Queue = (props) => {
  const songs = props.songs;

  // Iterate over song array and create new array of QueueItems
  const songList = songs.map((song) => <QueueItem song={song} />);

  // Render Queue with array of QueueItems
  return (
    <div className="bg-gray-800 w-1/4 md:w-1/3 mr-4 rounded shadow-lg">
      <p className="uppercase tracking-wider font-mono p-3 border-gray-500 border-b-2">
        Queue
      </p>
      <div className="divide-y divide-gray-600">{songList}</div>
    </div>
  );
};

const QueueItem = (props) => {
  return (
    <div className="boxPop p-3 flex text-gray-300 flex-no-wrap items-center bg-gray-800 first:bg-gray-900">
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
