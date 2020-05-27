import React from 'react';
import ReactDOM from 'react-dom';
import Player from './components/player.jsx';
import Queue from './components/queue.jsx';
import './styles.css';

const data = {
    songs: [
        {
            name: 'Test',
            artist: 'FakeArtist',
            album: 'FakeAlbum',
            coverUrl: 'https://miro.medium.com/proxy/1*8FkvzbSdSJ4HNxtuZo5kLg.jpeg',
        },
        {
            name: 'Test2',
            artist: 'FakeArtist2',
            coverUrl: 'https://miro.medium.com/proxy/1*8FkvzbSdSJ4HNxtuZo5kLg.jpeg',
        },
    ],
};

const songsArray = [
    {
        name: 'Test',
        artist: 'FakeArtist',
        album: 'FakeAlbum',
        coverUrl: 'https://miro.medium.com/proxy/1*8FkvzbSdSJ4HNxtuZo5kLg.jpeg',
    },
];

const Root = (props) => {
    return (
        <div className="text-white w-screen h-screen bg-gray-900">
            <div className="container mx-auto p-5">
                <Queue songs={props.songs} />
            </div>
            <Player songs={props.songs}/>
        </div>
    );
};

const element = <Root songs={songsArray}/>
ReactDOM.render(element, document.getElementById('root'));
