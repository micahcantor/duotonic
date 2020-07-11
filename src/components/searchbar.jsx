import React, { useState } from "react";
import "../styles.css";

const SearchBar = () => {
  const [value, setValue] = useState("")

  const handleChange = (e) => {
    setValue(e.target.value)
    console.log(value)
    /* use value here, like send to server/search endpoint
      then handle the results
      then load them into a SearchResults component and display the component */
  }
  return (
    <input
      className="transition-colors duration-200 ease-in-out bg-gray-200 appearance-none border-2 border-transparent rounded w-full mb-5 py-3 px-4 text-gray-700 leading-tight focus:outline-none hover:bg-white focus:border-green-400"
      type="text"
      placeholder="Song search"
      onChange={handleChange}
    />
  );
};

export default SearchBar;
