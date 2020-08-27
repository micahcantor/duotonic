/* eslint-disable react/prop-types */
import React from "react";
import "../styles/styles.css";

const SongInfo = (props) => {
  return (
    <div data-uri={props.song.uri} data-runtime={props.song.runtime} className="flex w-full items-center">
      <img id="album-art" className="h-16 max-w-none rounded shadow" src={props.song.coverUrl} alt="Album cover"/>
      <div className="flex flex-col md:flex-row lg:flex-col ml-3 font-light text-textColor">
        <span id="name" className="text-textColor md:mr-2 lg:mr-none">{props.song.name}</span>
        <span id="artist">
          {props.song.artists}
        </span>
        <span id="album">{props.song.album}</span>
      </div>
    </div>
  );
};

export default SongInfo