import React, { useState, useEffect } from "react";
import useInterval from "@use-it/interval";
import "../styles/styles.css"
import { SliderInput, SliderTrack, SliderTrackHighlight, SliderHandle } from "@reach/slider";
import { setSongPosition, setSongPositionInDB, updateHistoryInRoom } from "../api";

export const ProgressBar = ({ elapsed, songs, runtime, isPaused, deviceID, room, dispatch }) => {

  const [timeoutID, setTimeoutID] = useState(null);
  const [shouldIncrement, setShouldIncrement] = useState(false);

  useEffect(() => {
    if (runtime && elapsed >= runtime) { /* when the progress bar reaches the end */
      
      if (room && room !== "") { /* update history for the room if user is in a room */
        updateHistoryInRoom(songs[0], room);
      }
      if (songs.length === 1) { /* turn off increment if this was the last song in queue*/
        setShouldIncrement(false);
      }
      dispatch({ type: 'set-elapsed', elapsed: 0 });
      dispatch({ type: 'add-to-history', song: songs[0] });
      dispatch({ type: 'next-song' });

    }
    else if (room && elapsed > 1 && elapsed < 100) { /* set song position in the db once when the song starts */
      setSongPositionInDB(elapsed, room);
    }
  }, [elapsed, runtime, room, songs, dispatch])
  
  /* When pause state changes, set should increment */
  useEffect(() => {
    setShouldIncrement(!isPaused && songs.length > 0)
  }, [isPaused, songs])

  /* Interval that increments elapsed every 50 ms if shouldIncrement is enabled */
  useInterval(() => {
    dispatch({ type: 'increment-elapsed', increment: 50 });
  }, shouldIncrement ? 50 : null)

  const onSeek = (newValue) => {
    dispatch({ type: 'set-elapsed', elapsed: newValue }); // visually update the elapsed state immediately
    // sets a timeout function that sends the api request after .25 seconds
    // this prevents sending many api requests successively to the server when the bar is dragged.
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    const timeout = setTimeout(async () => {
      await setSongPosition(deviceID, newValue, room, true);
    }, 250)
    setTimeoutID(timeout);
  }

  if (elapsed > 0) return (
    <SliderInput className="w-full pb-6 mb-1 md:mb-0" min={0} max={runtime} value={elapsed} onChange={onSeek}>
      <SliderTrack>
        <SliderTrackHighlight />
        <SliderHandle className="w-3 h-3 hover:bg-primary hover:border-primary focus:bg-primary focus:border-primary" />
      </SliderTrack>
    </SliderInput>
  )
  else return null;
}
