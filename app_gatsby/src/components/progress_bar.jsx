import React, { useState, useEffect, useCallback } from "react";
import "../styles/styles.css"
import { SliderInput, SliderTrack, SliderTrackHighlight, SliderHandle } from "@reach/slider";
import { setSongPosition, updateHistoryInRoom } from "../api";

export const ProgressBar = ({ seekElapsed, songs, runtime, isPaused, deviceID, room, setHistory, updateSongs }) => {

  const [elapsed, setElapsed] = useState(0);
  const [runtimeMS, setRuntimeMS] = useState(null);
  const [timeoutID, setTimeoutID] = useState(null);
  const [progressActive, setProgressActive] = useState(false);
  const [progressIntervalID, setProgressIntervalID] = useState(null);

  const onProgressComplete = useCallback(() => {
    if (room && room !== "") {
      updateHistoryInRoom(songs[0], room);
    }
    setHistory(history => [...history, songs[0]]);
    updateSongs(songs => songs.filter((s, i) => i > 0));
  }, [room, songs, setHistory, updateSongs]);

  useEffect(() => {
    if (elapsed === runtimeMS && progressIntervalID) {
      clearInterval(progressIntervalID);
      setElapsed(0);
      setProgressActive(false);
      onProgressComplete();
    }
    else if (!isPaused && !progressActive) {
      const intervalID = setInterval(() =>
        setElapsed(elapsed => elapsed + 0.05),
        50 // every 50 ms
      );
      setProgressActive(true);
      setProgressIntervalID(intervalID);
    }
    else if (isPaused && progressActive) {
      setProgressActive(false);
      clearInterval(progressIntervalID);
    }
  }, [elapsed, isPaused, progressActive, runtimeMS, progressIntervalID, onProgressComplete])

  /* Fires when the queue has been updated (song skip) -- resets progress bar values to their initial state */
  useEffect(() => {
    setElapsed(0);
    setRuntimeMS(parseFloat(runtime) / 1000);
    setProgressActive(false);
  }, [songs, runtime])

  /* Fires when the progress bar has been changed by another user in the room */
  useEffect(() => {
    setElapsed(seekElapsed);
  }, [seekElapsed])

  /* Clean up function that clears timers on dismount */
  useEffect(() => {
    return () => {
      clearTimeout(timeoutID);
      clearInterval(progressIntervalID);
    }
  }, [timeoutID, progressIntervalID])

  const onChange = (newValue) => {
    setElapsed(newValue); // visually update the elapsed state immediately
    // sets a timeout function that sends the api request after .25 seconds
    // this prevents sending many api requests successively to the server when the bar is dragged.
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    const timeout = setTimeout(() => {
      console.log("sending seek req ", room);
      setSongPosition(deviceID, newValue * 1000, room, true);
    }, 250)
    setTimeoutID(timeout);
  }

  return (
    <SliderInput className="w-full pb-6 mb-1 md:mb-0" min={0} max={runtimeMS} value={elapsed} onChange={onChange}>
      <SliderTrack>
        <SliderTrackHighlight />
        <SliderHandle className="w-3 h-3 hover:bg-primary hover:border-primary focus:bg-primary focus:border-primary" />
      </SliderTrack>
    </SliderInput>
  );
}
