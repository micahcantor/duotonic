import React from "react";

export class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { elapsed: 0, progressActive: false }; // elapsed: seconds of the song elapsed 
  }

  componentDidUpdate() {
    if (this.props.runtime) {
        const runtime = parseFloat(this.props.runtime) / 1000;
        this.progress = (this.state.elapsed / runtime) * 100; // elapsed / runtime as a percentage

        if (!this.props.isPaused && !this.state.progressActive) {
        // if song is playing and the progress bar is not already active
        this.advanceProgress();
        }
        else if (this.props.isPaused && this.state.progressActive) {
        // if the song is paused and the progress bar is active
        this.pauseProgress();
        }

        if (this.progress == 100)
        this.pauseProgress(); // stops progress bar at 100%
    }
  }

  advanceProgress() {
    /* starts a repeating increment function and sets progress active to true */
    this.setState({ progressActive: true });
    this.timerID = setInterval(
      () => this.setState(state => ({ elapsed: state.elapsed + 0.01 })),
      10 // every 10 ms
    );
  }

  pauseProgress() {
    this.setState({ progressActive: false });
    clearInterval(this.timerID); // stops the interval when paused
  }

  render() {
    return (
      <div className="flex shadow w-full h-2 bg-grey-light">
        <div className="bg-customgreen leading-none py-1 rounded" style={{ width: this.progress + "%" }}>
          {" "}
        </div>
      </div>
    );
  }
}
