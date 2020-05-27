import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

import SearchBar from './components/searchbar.jsx';
import Player from './components/player.jsx';
import Queue from './components/queue.jsx';

const data = {
    songs: [
        {
            name: 'Harvest Moon',
            artist: 'Neil Young',
            coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Harvest_Moon_single.jpg',
        },
        {
            name: 'bad guy',
            artist: 'Billie Eillish',
            coverUrl: 'https://vignette.wikia.nocookie.net/wherearetheavocados/images/0/06/DyGkj-cU0AAGLH-.jpeg/revision/latest?cb=20190525003458',
        },
        {
            name: 'FACE',
            artist: 'Brockhampton',
            coverUrl: 'https://images.genius.com/63f4ae252959cf8e0fbbee735bba6bcd.1000x1000x1.jpg',
        },
        {
            name: 'Money',
            artist: 'Pink Floyd',
            coverUrl: 'https://miro.medium.com/proxy/1*8FkvzbSdSJ4HNxtuZo5kLg.jpeg',
        },
    ],
};

const Root = (props) => {
    return (
        <div className="text-white w-screen h-screen bg-gray-700">
            <div className="container mx-auto p-5">
                <SearchBar />
                <Queue songs={props.songs} />
            </div>
            <Player song={props.songs[0]} />
        </div>
    );
};

const element = <Root songs={data.songs} />;
ReactDOM.render(element, document.getElementById('root'));
