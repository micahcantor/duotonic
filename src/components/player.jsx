import React from 'react';
import '../styles.css';

const Player = () => {
    return (
        <div className="bg-black h-20">
            <PlaybackControls> </PlaybackControls>
        </div>
    );
};

const PlaybackControls = () => {
    return (
        <div className="flex">
            <PausePlay> </PausePlay>
        </div>
    );
};

const PausePlay = () => {
    return (
        <button className="rounded-full mx-auto h-16 w-16 flex items-center mt-2" type="button">
            <svg className="w-16 h-16 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="white" viewBox="0 0 24 24">
                <path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"> </path>
            </svg>
        </button>
    );
};

export default Player;

/*

const SongInfo = (props) => {
}

const ProgressBar = () => {

} */
