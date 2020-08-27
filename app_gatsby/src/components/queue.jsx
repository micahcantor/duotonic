/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */

import React from "react";
import SwapIcon from "./swap.jsx";
import SongInfo from "./song_info.jsx"
import "../styles/styles.css";

const Queue = ({ songs, onSwapClick, queueVisible }) => {  
  // Iterate over song array and create new array of QueueItems
  const songList = songs.map((song, index) => {
    return <QueueItem key={index} song={song} />
  });

  // Render Queue with array of QueueItems
  return (
    <div id="queue" className={`${queueVisible ? "flex" : "hidden"} md:flex flex-col h-full w-full md:w-2/5 md:mr-4 bg-bgDark rounded shadow-lg min-h-0`}>
      <div className="relative flex w-full border-b-2 border-text">
        <p className="text-lg uppercase tracking-wider font-mono p-3">
          Queue
        </p>
        <SwapIcon onClick={onSwapClick}/>
      </div>
      <div className="overflow-y-auto scrollbar w-full min-h-0" style={{height: '88%'}}>
        {songList}
      </div>      
    </div>
  );
};

const QueueItem = (props) => {
  return (
    <div className="flex p-3 text-textColor items-center bg-bgDark border-b-2 border-text hover:border-primary ">
      <SongInfo song={props.song} />
    </div>
  );
};

export default Queue;
