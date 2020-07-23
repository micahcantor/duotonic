/* eslint-disable react/prop-types */
import React from "react";
import "../styles.css";

const SongInfo = (props) => {
  return (
    <div className="flex items-center">
      <img id="album-art" className="h-16 max-w-none rounded shadow" src={props.song.coverUrl} alt="Album cover"/>
      <div className="flex flex-col md:flex-row lg:flex-col ml-3 font-light text-gray-500">
        <span id="name" className="text-white md:mr-2 lg:mr-none">{props.song.name}</span>
        <span id="artist">
          {props.song.artists}
        </span>
        <span id="album">{props.song.album}</span>
        <span id="uri" className="hidden">{props.song.uri}</span>
      </div>
    </div>
  );
};

export default SongInfo