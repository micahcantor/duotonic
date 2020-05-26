import React from 'react';
import '../styles.css';

const Player = () => {
    return (
        <div className="flex flex-col bg-black h-20">
            <div className="flex justify-between items-center">
                <SongInfo> </SongInfo>
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

const SongInfo = () => {
    return (
        <div className="flex w-1/5 items-center">
            <div className="mr-2 ml-2 border border-white w-16 h-16"> </div>
            <div className="flex flex-col text-white">
                <span> Song</span>
                <span> Artist</span>
                <span> Album</span>
            </div>
        </div>
    );
};
const ProgressBar = () => {
    return (
        <div className="flex shadow w-full h-2 bg-grey-light">
            <div className="bg-green text-xs leading-none py-1" style={{ width: '60%' }}> </div>
        </div>
    );
};

const PausePlay = () => {
    return (
        <button className="flex rounded-full h-16 w-16 flex items-center mt-2 mx-auto" type="button">
            <svg className="flex w-16 h-16" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" stroke="white" viewBox="0 0 24 24">
                <path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"> </path>
            </svg>
        </button>
    );
};

const RightSkip = () => {
    return (
        <button className="flex mt-2 mx-auto" type="button">
            <svg className="flex w-12 h-12" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" stroke="white" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7"> </path>
            </svg>
        </button>
    );
};

const LeftSkip = () => {
    return (
        <button className="flex mt-2 mx-auto" type="button">
            <svg className="flex w-12 h-12" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".75" stroke="white" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7"> </path>
            </svg>
        </button>
    );
};

const DisconnectButton = () => {
    return (
        <div className="flex w-1/5 mr-2 text-white justify-end">
            <button type="button" className="bg-transparent hover:bg-white-500 text-white-500 font-semibold hover:text-green py-2 px-4 border border-white-500 hover:border-transparent rounded">
                Disconnect
            </button>
        </div>
    );
};

export default Player;
