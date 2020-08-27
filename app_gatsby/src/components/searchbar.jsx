/* eslint-disable react/prop-types */
import React, { useState } from "react";
import SongInfo from "./song_info.jsx";
import ScaleLoader from "react-spinners/ScaleLoader";
import { searchSpotify } from "../api.js";
import "../styles/styles.css";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchResults: [], showResults: false, currentTimer: null, loading: false };
    this.closeResults = this.closeResults.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleSearchResults(response) {
    const tracks = response.tracks.items.map(track => {
      return {
        name: track.name,
        artists: track.artists.map(a => a.name).reduce((acc, curr) => acc + ", " + curr),
        coverUrl: track.album.images[0].url,
        uri: track.uri,
        runtime: track.duration_ms,
      }
    });

    this.setState({ searchResults: tracks });
  }

  closeResults() {
    this.setState({ searchResults: [], showResults: false });
    document.getElementById("search-input").value = "";
  }

  async handleInputChange(e) {
    this.setState({loading: true})
    // show the search results box is not empty
    const initial = e.target.value;
    if (initial.length > 0) {
      this.setState({ showResults: true })
    } else {
      this.setState({ searchResults: [], showResults: false })
    }

    // clear the timer currently held in state, if it exists
    // this prevents multiple requests within 1 second being sent to the search api
    if (this.state.currentTimer) {
      clearTimeout(this.state.currentTimer)
    }
    
    // set a new timerID in state
    // timeout function executes search query to api after 1 second delay
    // this means the search is sent 1 second after the last letter is typed
    this.setState({
      currentTimer: setTimeout(async () => {
        const query = document.getElementById("search-input").value
        if (query.length !== 0) {
          const response = await searchSpotify(query);
          this.handleSearchResults(response);
        }

        this.setState({loading: false})
      }, 750)
    });
    
  }

  render() {
    return (
      <>
        <form onSubmit={e => e.preventDefault()} autoComplete="off" className="relative z-20">
          <input id="search-input" type="text" placeholder="Song search" onChange={this.handleInputChange} 
            className="text-black placeholder-black transition-colors duration-200 ease-in-out bg-text 
            appearance-none border-2 border-transparent rounded w-full mb-4 py-3 px-4 leading-tight focus:outline-none hover:bg-gray-200 focus:border-primary"  
          />
          <CloseButton onClick={this.closeResults} showResults={this.state.showResults}/>
        </form>
        <SearchResults show={this.state.showResults} songs={this.state.searchResults} onAdd={this.props.onAdd} closeResults={this.closeResults} loading={this.state.loading}/>
      </>
    );
  }
}

const SearchResults = (props) => { 
  const resultList = props.songs.map((song, index) => {
    return <SearchItem key={index} song={song} onAdd={props.onAdd}/>
  })

  if (props.show) {
    return (
      <div className="min-h-1/2 relative z-0 rounded bg-bgDark w-full h-full overflow-y-auto mb-4 -mt-5 text-center scrollbar">
        <ScaleLoader css="margin-top: -20px; margin-bottom: -20px" height="50px" width="10px" color="#6246ea" loading={props.loading} />
        {resultList}
      </div>
    )
  }
  else return null
}

const SearchItem = (props) => {
  const [inQueue, setInQueue] = useState(false);
  const handleClick = (e) => {
    props.onAdd(e);
    setInQueue(true);
  }

  return (
    <div id="result-parent" className="text-left border-b-2 border-text hover:border-primary p-3 w-full flex justify-between items-center">
      <SongInfo id="info" className="ml-2" song={props.song} />
      {inQueue ? <CheckMark /> : <AddButton onClick={handleClick} />}
    </div>
  )
}

const CloseButton = (props) => {
  const shouldDisplay = props.showResults ? "block" : "hidden";
  return (
    <button className={`${shouldDisplay}`} type="button" onClick={props.onClick}>
      <svg className="text-black stroke-current hover:text-primary w-6 h-6 my-3 mr-6 absolute top-0 right-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  )
} 

const AddButton = (props) => {
  return (
    <button type="button" onClick={props.onClick}>
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
