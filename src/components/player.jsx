import React from 'react';
import '../styles.css';

const Player = (props) => {
    return (
        <div className="flex fixed absolute bottom-0 inset-x-0 flex-col border-t-2 border-gray-500 bg-gray-900 h-20">
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

const ProgressBar = () => {
    return (
        <div className="flex shadow w-full h-2 bg-grey-light">
            <div className="bg-customgreen text-xs leading-none py-1" style={{ width: '60%' }}> </div>
        </div>
    );
};

/*
class ProgressBar extends React.Component {
    render() {
        return (
            <div className="flex shadow w-full h-2 bg-grey-light">
                <div className="bg-customgreen text-xs leading-none py-1" style={{ width: '60%' }}> </div>
            </div>
        );
    }
}
 */

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
