/* eslint-disable react/destructuring-assignment */
import React from 'react';
import '../styles.css';

const Queue = (props) => {
    const songs = props.songs;
    const songList = songs.map((song) =>
        <QueueItem song={song} />
    );

    return (
        <div className="bg-gray-800 overflow-hidden max-w-sm rounded shadow-lg">
            <p className="uppercase tracking-wider font-mono p-3 border-gray-500 border-b-2">Queue</p>
            <div className="divide-y divide-gray-600">
                {songList}
            </div>
        </div>
    );
};

const QueueItem = (props) => {
    return (
        <div className="p-3 flex text-gray-300 flex-no-wrap items-center bg-gray-900">
            <img className="h-16 max-w-none rounded shadow" alt="Album cover" src={props.song.coverUrl} />
            <div className="pl-5 whitespace-no-wrap font-thin">
                <p className="">{props.song.name}</p>
                <p className="text-gray-500 text-sm">{props.song.artist}</p>
            </div>
        </div>
    );
};

export default Queue;
