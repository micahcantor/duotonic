/* eslint-disable react/prop-types */
import React from "react";
import "../styles/styles.css";

const SongInfo = ({ song }) => {
  return (
    <div data-uri={song.uri} data-runtime={song.runtime} className="flex w-full items-center">
      <img id="album-art" className="h-16 max-w-none rounded shadow" src={song.coverUrl} alt="Album cover"/>
      <div className="flex flex-col ml-3 font-light text-textColor">
        <span id="name" className="text-textColor md:mr-2 lg:mr-none">{song.name}</span>
        <span id="artist" className="text-gray-500">
          {song.artists}
        </span>
        <span id="album">{song.album}</span>
      </div>
    </div>
  );
};

export default SongInfo