import React from 'react';
import '../styles.css';

const SearchBar = () => {
    return (
        <input className="transition-colors duration-200 ease-in-out bg-gray-200 appearance-none border-2 border-transparent rounded w-full mb-5 py-3 px-4 text-gray-700 leading-tight focus:outline-none hover:bg-white focus:border-green-400" id="" type="text" placeholder="Song search" />
    );
};

export default SearchBar;
