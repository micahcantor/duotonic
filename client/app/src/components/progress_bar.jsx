import React, { useState, useEffect, useCallback } from "react";
import "../styles/styles.css"
import { SliderInput, SliderTrack, SliderTrackHighlight, SliderHandle } from "@reach/slider";
import { setSongPosition, updateHistoryInRoom } from "../api";

export const ProgressBar = ({ elapsed, songs, runtime, isPaused, deviceID, room, dispatch }) => {

  const [runtimeMS, setRuntimeMS] = useState(null);
  const [timeoutID, setTimeoutID] = useState(null);
  const [progressActive, setProgressActive] = useState(false);
  const [progressIntervalID, setProgressIntervalID] = useState(null);

  const onProgressComplete = useCallback(() => {
    if (room && room !== "") {
      updateHistoryInRoom(songs[0], room);
    }
    dispatch({ type: 'add-to-history', song: songs[0] });
    dispatch({ type: 'next-song' });
  }, [room, songs, dispatch]);

  useEffect(() => {
    if (elapsed >= runtimeMS && progressIntervalID) {
      clearInterval(progressIntervalID);
      dispatch({ type: 'set-elapsed', elapsed: 0 });
      setProgressActive(false);
      onProgressComplete();
    }
    else if (!isPaused && !progressActive) {
      const intervalID = setInterval(() =>
        dispatch({ type: 'increment-elapsed', increment: 50 }),
        50 // every 50 ms
      );
      setProgressActive(true);
      setProgressIntervalID(intervalID);
    }
    else if (isPaused && progressActive) {
      setProgressActive(false);
      clearInterval(progressIntervalID);
    }
  }, [elapsed, isPaused, progressActive, runtimeMS, progressIntervalID, onProgressComplete, dispatch])

  /* Fires when the first song in queue has been updated (song skip) -- resets progress bar values to their initial state */
  useEffect(() => {
    dispatch({ type: 'set-elapsed', elapsed: 0 });
    setRuntimeMS(parseFloat(runtime));
    setProgressActive(false);
  }, [songs[0], runtime, dispatch])

  /* Clean up function that clears timers on dismount */
  useEffect(() => {
    return () => {
      clearTimeout(timeoutID);
      clearInterval(progressIntervalID);
    }
  }, [timeoutID, progressIntervalID])

  const onChange = (newValue) => {
    dispatch({ type: 'set-elapsed', elapsed: newValue }); // visually update the elapsed state immediately
    // sets a timeout function that sends the api request after .25 seconds
    // this prevents sending many api requests successively to the server when the bar is dragged.
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    const timeout = setTimeout(async () => {
      console.log("sending seek req ", room);
      await setSongPosition(deviceID, newValue, room, true);
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
