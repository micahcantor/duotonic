import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

import SearchBar from './components/searchbar.jsx';
import Player from './components/player.jsx';
import Queue from './components/queue.jsx';
import GiveUrl from './components/landing/GiveURL.jsx'
import NoAuth from './components/landing/NoAuth.jsx'

const data = {
    songs: [
        {
            name: 'Harvest Moon',
            artist: 'Neil Young',
            coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Harvest_Moon_single.jpg',
            runtime: 180,
        },
        {
            name: 'bad guy',
            artist: 'Billie Eillish',
            coverUrl: 'https://vignette.wikia.nocookie.net/wherearetheavocados/images/0/06/DyGkj-cU0AAGLH-.jpeg/revision/latest?cb=20190525003458',
            runtime: 180,
        },
        {
            name: 'FACE',
            artist: 'Brockhampton',
            coverUrl: 'https://images.genius.com/63f4ae252959cf8e0fbbee735bba6bcd.1000x1000x1.jpg',
            runtime: 180,
        },
        {
            name: 'Money',
            artist: 'Pink Floyd',
            coverUrl: 'https://miro.medium.com/proxy/1*8FkvzbSdSJ4HNxtuZo5kLg.jpeg',
            runtime: 180,
        },
    ],
};

const Landing = (props) => {
    const isAuth = props.isAuth;

    return (
        <div className="text-white w-screen h-screen bg-gray-900">
            {isAuth ? <GiveUrl /> : <NoAuth />}
        </div>
    )
}

const PlayerPage = (props) => {
    return (
        <div className="text-white w-screen h-screen bg-gray-900">
            <div className="container mx-auto p-5">
                <SearchBar />
                <Queue songs={props.songs} />
            </div>
            <Player song={props.songs[0]} />
            
        </div>
    );
};

const playPage = <PlayerPage songs={data.songs} />
const landing = <Landing isAuth={true}/>

ReactDOM.render(landing, document.getElementById('root'));
