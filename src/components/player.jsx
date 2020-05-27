/* eslint-disable react/prop-types */
/* eslint-disable prefer-destructuring */
import React from 'react';
import '../styles.css';

const Player = (props) => {
    return (
        <div className="flex absolute bottom-0 inset-x-0 flex-col border-t-2 border-gray-500 bg-gray-900 h-22">
            <div className="flex justify-between items-center">
                <SongInfo song={props.song} />
                <PlaybackControls />
                <DisconnectButton />
            </div>
            <ProgressBar />
        </div>
    );
};

const PlaybackControls = () => {
    return (
        <div className="flex w-1/5 justify-center">
            <LeftSkip />
            <PausePlay />
            <RightSkip />
        </div>
    );
};

const SongInfo = (props) => {
    return (
        <div className="flex w-1/5 items-center">
            <img className="mx-3 h-16 max-w-none rounded shadow" src={props.song.coverUrl} alt="Album cover" />
            <div className="flex flex-col font-light text-gray-500">
                <span className="text-white">{props.song.name}</span>
                <span>{props.song.artist}</span>
                <span>{props.song.album}</span>
            </div>
        </div>
    );
};
 
class ProgressBar extends React.Component {
    // onPlay and onPause are not hooked up to anything yet 
    constructor(props) {
        super(props);
        this.state = { elapsed: 0 };
    }

    onPlay() {
        this.timerID = setInterval(
            () => this.tick(),           // calls tick
            1000,                        // runs every second
        );
    }

    onPause() {
        clearInterval(this.timerID);     // stops tick function
    }

    tick() {
        // incremenets elapsed counter
        // see: https://reactjs.org/docs/state-and-lifecycle.html "Using State Correctly"
        //
        this.setState((state) => ({
            elapsed: state.elapsed + 1,
        }));
    }

    render() {
        // const progress = (this.state.elapsed / this.props.runtime) * 100;
        return (
            <div className="flex shadow w-full h-2 bg-grey-light">
                <div className="bg-customgreen leading-none py-1" style={{ width: '60%' }}> </div> 
            </div>
        );
    }
}

class PausePlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isPaused:true}

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(state => ({
            isPaused: !state.isPaused
        }));
    }
    render() {
        const isPaused = this.state.isPaused;
        return (
            <button onClick={this.handleClick} className="rounded-full h-16 w-16 flex items-center mt-2" type="button">
                {isPaused ? <PauseIcon /> : <PlayIcon />}
            </button>
        );      
    }
}

const PauseIcon = () => {
    return (
        <svg className="flex w-16 h-16" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" stroke="white" viewBox="0 0 24 24">
            <path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"> </path>                
        </svg>
    )
}

const PlayIcon = () => {
    return (
        <svg className="flex w-16 h-16" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" stroke="white" viewBox="0 0 24 24">
            <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
    )
}

const RightSkip = () => {
    return (
        <button className="mt-2" type="button">
            <svg className="w-12 h-12" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" stroke="white" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7"> </path>
            </svg>
        </button>
    );
};

const LeftSkip = () => {
    return (
        <button className="mt-2" type="button">
            <svg className="w-12 h-12" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" stroke="white" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7"></path>
            </svg>
        </button>
    );
};

const DisconnectButton = () => {
    return (
        <div className="flex w-1/5 mr-2 text-white justify-end">
            <button type="button" className="bg-transparent font-semibold lowercase hover:text-customgreen py-2 px-4 rounded">
                Disconnect
            </button>
        </div>
    );
};

export default Player;
