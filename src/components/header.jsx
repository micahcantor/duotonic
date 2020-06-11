import React from "react";
import ModalTrigger from "./modal.jsx";
import "../styles.css";

const Header = () => {
    return (
        <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-4 border-b-2 border-gray-500">
            <div className="text-customgreen mr-6 ml-2 mt-1">
                <span className="font-mono text-xl tracking-tight">pass the aux</span>
            </div>
            <div className="block lg:hidden">
                <button type="button" className="flex items-center px-3 py-2 text-white hover:text-customgreen">
                    <svg className="fill-current h-5 w-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                    </svg>
                </button>
            </div>
            <div className="hidden w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    <a href="https://github.com/sawyerpollard/pass-the-aux-client" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-customgreen mr-4">
                        Github
                    </a>
                    <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-customgreen">
                        About
                    </a>
                </div>
                <div className="flex mx-2">
                    <ModalTrigger buttonText="Get a Link" />
                    <ModalTrigger buttonText="Go Random" />
                </div>
            </div>
        </nav>
    );
}

export default Header;