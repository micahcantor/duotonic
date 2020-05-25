import React from 'react';
import '../styles.css';

const Player = () => {
    return (
        <div className="bg-black">
            <PlaybackControls> </PlaybackControls>
        </div>
    );
};

const PlaybackControls = () => {
    return (
        <div className="mx-auto">
            <button className="rounded-full mx-auto h-16 w-16 flex items-center border-2 border-white" type="button">
                <div className="ml-4 mr-1 rounded-full py-4 px-1 border-2 border-white"> </div>
                <div className="mr-4 rounded-full py-4 px-1 border-2 border-white"> </div>
            </button>
        </div>
    );
};

export default Player;

/*

const SongInfo = (props) => {
}

const ProgressBar = () => {

} */
