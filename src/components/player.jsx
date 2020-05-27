/* eslint-disable prefer-destructuring */
import React from 'react';
import '../styles.css';

const Player = (props) => {
    const song = props.songs[0];
    return (
        <div className="flex absolute bottom-0 inset-x-0 flex-col border-t-2 border-gray-500 bg-gray-900 h-22">
            <div className="flex justify-between items-center">
                <SongInfo song={song}> </SongInfo>
                <PlaybackControls> </PlaybackControls>
                <DisconnectButton> </DisconnectButton>
            </div>
            <ProgressBar> </ProgressBar>
        </div>
    );
};

const PlaybackControls = () => {
    return (
        <div className="flex w-1/5 justify-center">
            <LeftSkip> </LeftSkip>
            <PausePlay> </PausePlay>
            <RightSkip> </RightSkip>
        </div>
    );
};

const SongInfo = (props) => {
    return (
        <div className="flex w-1/5 items-center">
            <img className="mx-3 h-16 max-w-none rounded shadow" src={props.song.coverUrl} alt="Album Cover" />
            <div className="flex flex-col text-gray-500 font-mono">
                <span className="text-white"> {props.song.name} </span>
                <span> {props.song.artist} </span>
                <span> {props.song.album} </span>
            </div>
        </div>
    );
};


class ProgressBar extends React.Component {
    /* onPlay and onPause are not hooked up to anything yet */
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
        clearInterval(this.timerID);    // stops tick function
    }

    tick() {
        /* incremenets elapsed counter
        see: https://reactjs.org/docs/state-and-lifecycle.html "Using State Correctly"
        */
        this.setState((state) => ({
            elapsed: state.elapsed + 1,
        }));
    }

    render() {
        // const progress = (this.state.elapsed / this.props.runtime) * 100;
        return (
            <div className="flex shadow w-full h-2 bg-grey-light">
                <div className="bg-green text-xs leading-none py-1" style={{ width: '60%' }}> </div>
            </div>
        );
    }
}

const PausePlay = () => {
    return (
        <button className="rounded-full h-16 w-16 flex items-center mt-2" type="button">
            <svg className="flex w-16 h-16" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" stroke="white" viewBox="0 0 24 24">
                <path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"> </path>
            </svg>
        </button>
    );
};

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
                <path d="M15 19l-7-7 7-7"> </path>
            </svg>
        </button>
    );
};

const DisconnectButton = () => {
    return (
        <div className="flex w-1/5 mr-2 text-white justify-end">
            <button type="button" className="bg-transparent font-mono hover:text-green py-2 px-4 rounded">
                disconnect
            </button>
        </div>
    );
};

export default Player;
