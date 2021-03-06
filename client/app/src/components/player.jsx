import React, { useState, useEffect } from "react";
import useInterval from "@use-it/interval";
import "../styles/styles.css";
import SongInfo from "./song_info.jsx"
import { SliderInput, SliderTrack, SliderTrackHighlight, SliderHandle } from "@reach/slider";
import "../styles/slider_styles.css";
import { getPlayerInfo, startSong, resumeSong, pauseSong, previousSong, nextSong, updateHistoryInRoom, setVolume, setSongPositionInDB } from "../api";
import { ProgressBar } from "./progress_bar.jsx";
import { ClipLoader } from "react-spinners";

const Player = ( { songInQueue, isPaused, elapsed, songs, history, room, device, playbackCapable, dispatch } ) => {

  const [runtime, setRuntime] = useState(null);
  const [shouldPoll, setShouldPoll] = useState(false);

  useEffect(() => {
    if (songs[0]) {
      setRuntime(songs[0].runtime);
    }
    else setRuntime(null)
  }, [songs]);

  useEffect(() => {
    setShouldPoll(songInQueue && !isPaused);
  }, [isPaused, songInQueue])

  useInterval(() => {
    getPlayerInfo()
      .then(playbackState => loadUpdatedPlayback(playbackState))
      .catch(error => console.error(error));

    if (room) { /* updates the position of the song in the room collection */
      setSongPositionInDB(elapsed, room)
    }
  }, shouldPoll ? 10000 : null)

  function loadUpdatedPlayback(playbackState) {
    const { is_playing, progress_ms, item } = playbackState;
    const track = {
      name: item.name, 
      artists: item.artists.map(a => a.name).reduce((acc, curr) => acc + ", " + curr),
      coverUrl: item.album.images[0].url,
      uri: item.uri,
      runtime: item.duration_ms,
    }
    dispatch({ type: 'pause-update', isPaused: !is_playing});
    dispatch({ type: 'set-elapsed', elapsed: progress_ms });
    dispatch({ type: 'set-current-song', song: track });
  }

  const onPauseChange = async () => {
    if (isPaused && elapsed === 0 && songInQueue) {
      await startSong(device.id, songs[0], room, true);
    } 
    else if (isPaused && elapsed > 0 && songInQueue) {
      await resumeSong(device.id, room, true);
    } 
    else if (songInQueue) {
      await pauseSong(device.id, room, true);
    }
    dispatch({ type: 'flip-pause' });
  }

  const onLeftSkip = async () => {
    if (history.length > 0) {
      await previousSong(device.id, room, true); // asks Spotify to play the previous song
      dispatch({ type: 'previous-song' });
      dispatch({ type: 'set-elapsed', elapsed: 0 });
      dispatch({ type: 'pause-update', isPaused: false });
    }
  }

  const onRightSkip = async () => {
    if (room && room !== "") {
      await updateHistoryInRoom(songs[0], room); // if user is in a room, add the skipped song to the server history
    }
    console.log('next song from button press');
    await nextSong(device.id, songs[1], room, true); // moves to the next song in spotify queue

    dispatch({ type: 'set-elapsed', elapsed: 0 });
    dispatch({ type: 'add-to-history', song: songs[0] }); // add the skipped song to the local history
    dispatch({ type: 'next-song' });
    dispatch({ type: 'pause-update', isPaused: false });
  }

  const onVolumeMouseUp = async (e) => {
    const volume = parseInt(e.target.firstChild.children[1].getAttribute("aria-valuenow"));
    await setVolume(device.id, volume);
  }
  
  return (
    <div className="flex overflow-hidden flex-col border-t-2 border-text bg-bgDark h-22">
      <div className="flex w-full relative mx-auto pb-4 md:pt-2 items-center">
        { songInQueue 
          ? <div className="ml-3 md:ml-5 w-1/2 lg:w-1/3 lg:absolute"><SongInfo song={songs[0]} /></div>
          : null
        }
        <PlaybackControls isPaused={isPaused} onPauseChange={onPauseChange} 
          onLeftSkip={onLeftSkip} onRightSkip={onRightSkip} songInQueue={songInQueue} />

        {playbackCapable
          ? <VolumeSlider onMouseUp={onVolumeMouseUp}/>
          : null
        }
      </div>
      <ProgressBar elapsed={elapsed} songs={songs} isPaused={isPaused} runtime={parseInt(runtime)}
        deviceID={device ? device.id : ""} room={room} dispatch={dispatch}/>
    </div>
  );
}

const PlaybackControls = ({ onLeftSkip, onRightSkip, isPaused, songInQueue, onPauseChange }) => {
  return (
    <div className={`flex justify-center text-textColor md:pl-2 ${songInQueue ? "mx-auto" : ""}`}>
      <LeftSkip onLeftSkip={onLeftSkip} songInQueue={songInQueue}/>
      <PausePlay isPaused={isPaused} onPauseChange={onPauseChange} />
      <RightSkip onRightSkip={onRightSkip} songInQueue={songInQueue}/>
    </div>
  );
};

const PausePlay = ({ isPaused, onPauseChange }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    await onPauseChange(isPaused); 
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="w-16 h-16 flex items-center justify-center">
        <ClipLoader color="#6246ea" size="24px" />
      </div>
    )
  }
  else return (
    <button onClick={handleClick} className="rounded-full h-16 w-16 flex items-center" type="button" >
      {isPaused ? <PlayIcon /> : <PauseIcon />}
    </button>
  );
}

const VolumeSlider = ({ onMouseUp }) => {
  return (
    <div className="hidden lg:flex items-center text-textColor absolute right-0 mr-5">
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

const RightSkip = ({ onRightSkip, songInQueue }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (songInQueue) {
      setLoading(true);
      await onRightSkip();
      setLoading(false);
    }
  }
  if (loading) return <div className="flex items-center justify-center ml-2"><ClipLoader color="#6246ea" size="24px"/></div>
  else return (
    <button type="button" onClick={handleClick}>
      <svg className="w-12 h-12 stroke-current hover:text-primary" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7"> </path>
      </svg>
    </button>
  );
};

const LeftSkip = ({ onLeftSkip, songInQueue }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (songInQueue) {
      setLoading(true);
      await onLeftSkip();
      setLoading(false);
    }
  }
  if (loading) return <div className="flex items-center justify-center mr-2"><ClipLoader color="#6246ea" size="24px"/></div>
  else return (
    <button type="button" onClick={handleClick}>
      <svg className="w-12 h-12 stroke-current hover:text-primary" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" viewBox="0 0 24 24" >
        <path d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
  );
};

export default Player;
