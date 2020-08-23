import React, { useState, useEffect } from "react";
import { SliderInput, SliderTrack, SliderTrackHighlight, SliderHandle } from "@reach/slider";
import { setSongPosition } from "../api";

export const ProgressBar = ({ seekElapsed, song, runtime, isPaused, deviceID, room, onProgressComplete }) => {

  const [elapsed, setElapsed] = useState(0);
  const [runtimeMS, setRuntimeMS] = useState(null);
  const [timeoutID, setTimeoutID] = useState(null);
  const [progressActive, setProgressActive] = useState(false);
  const [progressIntervalID, setProgressIntervalID] = useState(null);

  useEffect(() => {
    clearInterval(progressIntervalID);
    setElapsed(0);
    setRuntimeMS(parseFloat(runtime) / 1000);
    setProgressActive(false);
  }, [song, runtime])

  useEffect(() => {
    if (elapsed === runtimeMS) {
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
  }, [elapsed, isPaused, progressActive, runtimeMS])

  useEffect(() => {
    setElapsed(seekElapsed);
    console.log('seek update')
  }, [seekElapsed])

  useEffect(() => {
    return () => clearTimeout(timeoutID);
  }, [timeoutID])

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
    <SliderInput className="w-full mb-1" min={0} max={runtimeMS} value={elapsed} onChange={onChange}>
      <SliderTrack>
        <SliderTrackHighlight />
        <SliderHandle className="w-3 h-3 hover:bg-customgreen hover:border-customgreen focus:bg-customgreen focus:border-customgreen" />
      </SliderTrack>
    </SliderInput>
  );
}
