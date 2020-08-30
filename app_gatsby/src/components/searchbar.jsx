/* eslint-disable react/prop-types */
import React, { useState } from "react";
import SongInfo from "./song_info.jsx";
import ScaleLoader from "react-spinners/ScaleLoader";
import { searchSpotify, startSong, addToQueue } from "../api.js";
import "../styles/styles.css";

const SearchBar = ({ songs, device, room, updateSongs, setIsPaused}) => {
  
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(null);

  const parseSearchResults = (response) => {
    const tracks = response.tracks.items.map(track => {
      return {
        name: track.name,
        artists: track.artists.map(a => a.name).reduce((acc, curr) => acc + ", " + curr),
        coverUrl: track.album.images[0].url,
        uri: track.uri,
        runtime: track.duration_ms,
      }
    });

    return tracks;
  }

  const closeResults = () => {
    setSearchResults([]);
    setShowResults(false);
    document.getElementById("search-input").value = "";
  }

  const handleInputChange = async (e) => {
    setLoading(true);
    // show the search results box is not empty
    const initial = e.target.value;
    if (initial.length > 0) {
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }

    // clear the timer currently held in state, if it exists
    // this prevents multiple requests within 1 second being sent to the search api
    if (currentTimer) {
      clearTimeout(currentTimer)
    }
    
    // set a new timerID in state
    // timeout function executes search query to api after 1 second delay
    // this means the search is sent 1 second after the last letter is typed
    const timeoutID = setTimeout(async () => {
        const query = document.getElementById("search-input").value
        if (query.length !== 0) {
          const response = await searchSpotify(query);
          const tracks = parseSearchResults(response);
          setSearchResults(tracks);
        }

        setLoading(false);
      }, 750
    );
    setCurrentTimer(timeoutID);
  }

  /* When a song is added to the queue, get the information about that song */
  const onAdd = async (e) => {
    const parentNode = e.target.closest("#result-parent").firstChild;
    const newQueueItem = {
      name: parentNode.children[1].children[0].innerText,
      artists: parentNode.children[1].children[1].innerText,
      coverUrl: parentNode.children[0].src,
      uri: parentNode.dataset.uri,
      runtime: parentNode.dataset.runtime,
    };

    // the first song is played immediately and isn't added to the queue
    // spotify automatically adds the first song played to the queue
    if (songs.length === 0) {
      await startSong(device.id, newQueueItem, room, true);
      setIsPaused(false);
    }
    else {
      await addToQueue(device.id, newQueueItem, room, true);
    }

    // update songs state afterwards to avoid stale state issues
    updateSongs(songs => songs.concat(newQueueItem));
  };

  return (
    <>
      <form onSubmit={e => e.preventDefault()} autoComplete="off" className="relative z-20">
        <input id="search-input" type="text" placeholder="Song search" onChange={handleInputChange} 
          className="text-black placeholder-black transition-colors duration-200 ease-in-out bg-text 
          appearance-none border-2 border-transparent rounded w-full mb-4 py-3 px-4 leading-tight focus:outline-none hover:bg-gray-200 focus:border-primary"  
        />
        <CloseButton onClick={closeResults} showResults={showResults}/>
      </form>
      <SearchResults show={showResults} songs={searchResults} onAdd={onAdd} closeResults={closeResults} loading={loading}/>
    </>
  );
}

const SearchResults = ({ songs, onAdd, show, loading }) => { 
  const resultList = songs.map((song, index) => {
    return <SearchItem key={index} song={song} onAdd={onAdd}/>
  })

  if (show) {
    return (
      <div className="min-h-1/2 relative z-0 rounded bg-bgDark w-full h-full overflow-y-auto mb-4 -mt-5 text-center scrollbar">
        <ScaleLoader css="margin-top: -20px; margin-bottom: -20px" height="50px" width="10px" color="#6246ea" loading={loading} />
        {resultList}
      </div>
    )
  }
  else return null
}

const SearchItem = ({ song, onAdd }) => {
  const [inQueue, setInQueue] = useState(false);
  const handleClick = (e) => {
    onAdd(e);
    setInQueue(true);
  }

  return (
    <div id="result-parent" className="text-left border-b-2 border-text hover:border-primary p-3 w-full flex justify-between items-center">
      <SongInfo id="info" className="ml-2" song={song} />
      {inQueue ? <CheckMark /> : <AddButton onClick={handleClick} />}
    </div>
  )
}

const CloseButton = ({ onClick, showResults }) => {
  const shouldDisplay = showResults ? "block" : "hidden";
  return (
    <button className={`${shouldDisplay}`} type="button" onClick={onClick}>
      <svg className="text-black stroke-current hover:text-primary w-6 h-6 my-3 mr-6 absolute top-0 right-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  )
} 

const AddButton = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      <svg className="hover:text-primary mr-2 w-8 h-8 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24">
        <path d="M12 4v16m8-8H4"></path>
      </svg>
    </button>
  )
}

const CheckMark = () => {
  return (
    <svg className="text-primary mr-2 w-8 h-8 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7"></path>
    </svg>
  )
}

export default SearchBar;
