import React from "react";
import { SliderInput, SliderTrack, SliderTrackHighlight, SliderHandle } from "@reach/slider";
import { setSongPosition } from "../api";

export class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { elapsed: 0, timeoutID: null, progressActive: false, progressTimer: null }; // elapsed: seconds of the song elapsed 
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.song !== this.props.song) {
      clearInterval(this.state.progressTimer);
      this.setState({ elapsed: 0, progressActive: false});
    }
    else if (this.props.runtime) {
      const runtime = parseFloat(this.props.runtime) / 1000;
      this.progress = Math.round((this.state.elapsed / runtime) * 100); // elapsed / runtime as a percentage

      if (this.progress === 100) {
        clearInterval(this.state.progressTimer);
        this.setState({ elapsed: 0, progressActive: false })
        this.props.onProgressComplete();
      }
      else if (!this.props.isPaused && !this.state. progressActive) {
        // if song is playing and the progress bar is not already active
        this.advanceProgress();
      }
      else if (this.props.isPaused && this.state.progressActive) {
        // if the song is paused and the progress bar is active
        this.pauseProgress();
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timerID);
  }

  advanceProgress() {
    /* starts a repeating increment function and sets progress active to true */
    const timerID = setInterval(
      () => this.setState(state => ({ elapsed: state.elapsed + 0.05 })),
      50 // every 50 ms
    );

    this.setState({ 
      progressActive: true ,
      progressTimer: timerID 
    });
  }

  pauseProgress() {
    this.setState({ progressActive: false });
    clearInterval(this.state.progressTimer); // stops the interval when paused
  }

  onChange(newValue) {
    this.setState({ elapsed: newValue }); // visually update the elapsed state immediately

    // sets a timeout function that sends the api request after .25 seconds
    // this prevents sending many api requests successively to the server when the bar is dragged.
    if (this.state.timeoutID) {
      clearTimeout(this.state.timeoutID)
    }
    const timeout = setTimeout(() => {
      console.log("sending seek req")
      setSongPosition(this.props.deviceID, newValue * 1000)
    }, 250)
    this.setState({ timeoutID: timeout })
  }

  render() {
    const runtime = parseFloat(this.props.runtime) / 1000;

    return (
      <SliderInput className="w-full mb-1" min={0} max={runtime} value={this.state.elapsed} onChange={this.onChange}>
        <SliderTrack>
          <SliderTrackHighlight />
          <SliderHandle className="w-3 h-3 hover:bg-customgreen hover:border-customgreen focus:bg-customgreen focus:border-customgreen" />
        </SliderTrack>
      </SliderInput>
    );
  }
}
