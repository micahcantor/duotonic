import React from "react";

export class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { elapsed: 0, progressActive: false, progressTimer: null }; // elapsed: seconds of the song elapsed 
  }

  componentDidUpdate(prevProps) {
    if (prevProps.song !== this.props.song) {
      clearInterval(this.state.progressTimer);
      this.setState({ elapsed: 0, progressActive: false});
      document.getElementById("progress").style.width = "0%";
    }
    else if (this.props.runtime) {
      const runtime = parseFloat(this.props.runtime) / 1000;
      this.progress = Math.round((this.state.elapsed / runtime) * 100); // elapsed / runtime as a percentage

      if (this.progress === 100) {
        clearInterval(this.state.progressTimer);
        this.setState({ elapsed: 0, progressActive: false })
        this.props.onProgressComplete();
      }
      else if (!this.props.isPaused && !this.state.progressActive) {
        // if song is playing and the progress bar is not already active
        this.advanceProgress();
      }
      else if (this.props.isPaused && this.state.progressActive) {
        // if the song is paused and the progress bar is active
        this.pauseProgress();
      }
    }
  }

  advanceProgress() {
    /* starts a repeating increment function and sets progress active to true */
    const timerID = setInterval(
      () => this.setState(state => ({ elapsed: state.elapsed + 0.25 })),
      250 // every 10 ms
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

  render() {
    return (
      <div className="flex shadow w-full h-2 bg-grey-light">
        <div id="progress" className="bg-customgreen leading-none py-1 rounded" style={{ width: this.progress + "%" }}>
          {" "}
        </div>
      </div>
    );
  }
}
