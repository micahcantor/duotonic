/* eslint-disable react/prop-types */
/* eslint-disable prefer-destructuring */
import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import SongInfo from "./song_info.jsx"
import { SliderInput, SliderTrack, SliderTrackHighlight, SliderHandle } from "@reach/slider";
import "../styles/slider_styles.css";
import { setVolume } from "../api";
import { ProgressBar } from "./progress_bar.jsx";

const Player = ( { songInQueue, isPaused, song, room, device, playbackCapable, 
  seekElapsed, handlePauseChange, onLeftSkip, onRightSkip, onProgressComplete } ) => {

  const [runtime, setRuntime] = useState(null);

  useEffect(() => {
    if (song) {
      setRuntime(song.runtime);
    } 
    else {
      setRuntime(null);
    }
  }, [song])

  const onVolumeMouseUp = async (e) => {
    const volume = parseInt(e.target.firstChild.children[1].getAttribute("aria-valuenow"));
    await setVolume(device.id, volume);
  }

  return (
    <div className="flex overflow-hidden flex-col border-t-2 border-gray-500 bg-gray-900 h-22">
      <div className="flex w-full relative mx-auto my-2 items-center">
        <div className="ml-3 md:ml-5 w-1/2 lg:w-1/3 lg:absolute">
          {songInQueue
            ? <SongInfo song={song} />
            : null
          }
        </div>
        <PlaybackControls isPaused={isPaused} onPauseChange={handlePauseChange} 
          onLeftSkip={onLeftSkip} onRightSkip={onRightSkip} songInQueue={songInQueue} />

        {playbackCapable
          ? <VolumeSlider onMouseUp={onVolumeMouseUp}/>
          : null
        }
      </div>
      {songInQueue
        ? <ProgressBar song={song} isPaused={isPaused} runtime={runtime} seekElapsed={seekElapsed}
          deviceID={device ? device.id : ""} room={room} onProgressComplete={onProgressComplete}/>
        : null
      }
    </div>
  );
}

const PlaybackControls = ({ onLeftSkip, onRightSkip, isPaused, songInQueue, onPauseChange }) => {
  return (
    <div className={`flex justify-center text-white md:pl-2 ${songInQueue ? "mx-auto" : ""}`}>
      <LeftSkip onLeftSkip={onLeftSkip}/>
      <PausePlay isPaused={isPaused} onPauseChange={onPauseChange} />
      <RightSkip onRightSkip={onRightSkip}/>
    </div>
  );
};

const PausePlay = ({ isPaused, onPauseChange }) => {
  const handleClick = () => {
    onPauseChange(isPaused); // calls function passed down from Player
  } // lifts pause state to the player so it is accessible to other player components

  return (
    <button onClick={handleClick} className="rounded-full h-16 w-16 flex items-center" type="button" >
      {isPaused ? <PlayIcon /> : <PauseIcon />}
    </button>
  );
}

const VolumeSlider = ({ onMouseUp }) => {
  return (
    <div className="hidden lg:flex items-center text-gray-500 absolute right-0 mr-5">
      <svg className="w-4 h-4 mr-2 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"></path>
        <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
      </svg>

      <SliderInput className="w-32" min={0} max={100} onMouseUp={onMouseUp} defaultValue={100}>
        <SliderTrack className="bg-gray-600">
          <SliderTrackHighlight />
          <SliderHandle className="w-3 h-3 transform hover:scale-150 hover:bg-primary hover:border-primary focus:bg-primary focus:border-primary" />
        </SliderTrack>
      </SliderInput>

      <svg className="w-4 h-4 ml-2 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
      </svg>
    </div>
  );
}

const PauseIcon = () => {
  return (
    <svg className="flex w-16 h-16 stroke-current hover:text-primary" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" viewBox="0 0 24 24">
      <path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"> </path>
    </svg>
  );
};

const PlayIcon = () => {
  return (
    <svg className="flex w-16 h-16 stroke-current hover:text-primary" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" viewBox="0 0 24 24">
      <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  );
};

const RightSkip = ({ onRightSkip }) => {
  return (
    <button type="button" onClick={onRightSkip}>
      <svg className="w-12 h-12 stroke-current hover:text-primary" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7"> </path>
      </svg>
    </button>
  );
};

const LeftSkip = ({ onLeftSkip }) => {
  return (
    <button type="button" onClick={onLeftSkip}>
      <svg className="w-12 h-12 stroke-current hover:text-primary" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" viewBox="0 0 24 24" >
        <path d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
  );
};

export default Player;
