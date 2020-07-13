/* eslint-disable react/prop-types */
import React, { useState } from "react";
import SongInfo from "./song_info.jsx"
import "../styles.css";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", showResults: false };
    this.closeResults = this.closeResults.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  closeResults() {
    this.setState({
      value: "",
      showResults: false,
    })
    document.getElementById("search-input").value = ""
  }

  handleChange(e) {
    if (e.target.value.length > 0) {
      this.setState({showResults: true})
    } else {
      this.setState({showResults: false})
    }

    this.setState({value: e.target.value});
    /* use value here, like send to server/search endpoint
      then handle the results
      then load them into a SearchResults component and display the component */
  }

  render() {
    return (
      <>
        <input id="search-input" type="text" placeholder="Song search" onChange={this.handleChange} 
          className="transition-colors duration-200 ease-in-out bg-gray-200 appearance-none border-2 border-transparent rounded w-full mb-5 py-3 px-4 text-gray-700 leading-tight focus:outline-none hover:bg-white focus:border-green-400"  
        />
        <SearchResults show={this.state.showResults} songs={exampleSongs} onAdd={this.props.onAdd} closeResults={this.closeResults}/>
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
      <div className="rounded bg-gray-800 w-full h-full overflow-y-scroll mb-4">
        <div className="flex justify-between border-b-2 border-gray-500 py-3">
          <span className="text-lg uppercase tracking-wider font-mono ml-4">Results</span>
          <CloseButton onClick={props.closeResults}/>
        </div>
        <div>
          {resultList}
        </div>     
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
      <svg className="stroke-current hover:text-customgreen w-6 h-6 mr-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
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

const exampleSongs = [
  {
    name: "Harvest Moon",
    artist: "Neil Young",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/8/8d/Harvest_Moon_single.jpg",
    runtime: 180,
  },
  {
    name: "bad guy",
    artist: "Billie Eillish",
    coverUrl:
      "https://vignette.wikia.nocookie.net/wherearetheavocados/images/0/06/DyGkj-cU0AAGLH-.jpeg/revision/latest?cb=20190525003458",
    runtime: 180,
  },
]

export default SearchBar;
