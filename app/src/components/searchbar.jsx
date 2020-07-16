/* eslint-disable react/prop-types */
import React, { useState } from "react";
import SongInfo from "./song_info.jsx";
import ScaleLoader from "react-spinners/ScaleLoader";
import "../styles.css";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchResults: [], showResults: false, currentTimer: null, loading: false };
    this.closeResults = this.closeResults.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async searchSpotify(query) {
    const api = "http://localhost:3000/api/spotify/search?q=";
    const url = api + encodeURIComponent(query) + "&type=track&limit=10";
    const response = await fetch(url, { credentials: "include" });
    const json = await response.json();
    console.log("response received for " + query)
    return json;
  }

  handleSearchResults(response) {
    const tracks = response.tracks.items.map(track => {
      return {
        name: track.name,
        artists: track.artists.map(a => a.name).reduce((acc, curr) => acc + ", " + curr),
        coverUrl: track.album.images[0].url,
      }
    });

    this.setState({ searchResults: tracks });
  }

  closeResults() {
    this.setState({ searchResults: [], showResults: false });
    document.getElementById("search-input").value = "";
  }

  async handleChange(e) {
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
    if (this.state.currentTimer != null) {
      console.log("clearing timer " + this.state.currentTimer)
      clearTimeout(this.state.currentTimer)
    }
    
    // set a new timerID in state
    // timeout function executes search query to api after 1 second delay
    // this means the search is sent 1 second after the last letter is typed
    this.setState({
      currentTimer: setTimeout(async () => {
        const query = document.getElementById("search-input").value
        if (query != "") {
          const response = await this.searchSpotify(query);
          this.handleSearchResults(response);
        }

        this.setState({loading: false})
      }, 750)
    });
    
  }

  render() {
    return (
      <>
        <div className="relative z-20">
          <input id="search-input" type="text" placeholder="Song search" onChange={this.handleChange} 
              className="transition-colors duration-200 ease-in-out bg-gray-200 appearance-none border-2 border-transparent rounded w-full mb-4 py-3 px-4 text-gray-700 leading-tight focus:outline-none hover:bg-white focus:border-green-400"  
          />
          <CloseButton onClick={this.closeResults}/>
        </div>
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
      <div className={`relative z-0 rounded bg-gray-800 w-full h-full overflow-y-auto mb-4 -mt-5 flex flex-col items-center ${props.loading ? "justify-center" : ""}`}>
        <ScaleLoader height="150" width="12" color="#1DB954" loading={props.loading} />
        {resultList}
      </div>
    )
  }
  else return null
}

const SearchItem = (props) => {
  const [inQueue, addToQueue] = useState(false)
  const handleClick = (e) => {
    props.onAdd(e)
    addToQueue(true)
  }

  return (
    <div id="result-parent" className="border-b-2 border-gray-600 hover:border-customgreen p-3 w-full flex justify-between items-center">
      <SongInfo id="info" className="ml-2" song={props.song} />
      {inQueue ? <CheckMark /> : <AddButton onClick={handleClick} />}
    </div>
  )
}

const CloseButton = (props) => {
  return (
    <button type="button" onClick={props.onClick}>
      <svg className="text-black stroke-current hover:text-customgreen w-6 h-6 m-3 absolute top-0 right-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  )
} 

const AddButton = (props) => {
  return (
    <button type="button" onClick={props.onClick}>
      <svg className="hover:text-customgreen mr-2 w-8 h-8 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24">
        <path d="M12 4v16m8-8H4"></path>
      </svg>
    </button>
  )
}

const CheckMark = () => {
  return (
    <svg className="text-customgreen mr-2 w-8 h-8 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7"></path>
    </svg>
  )
}

export default SearchBar;
