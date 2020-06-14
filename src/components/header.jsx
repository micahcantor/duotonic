import React from "react";
import ModalTrigger from "./modal.jsx";
import "../styles.css";

const Header = () => {
    return (
        <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-4 border-b-2 border-gray-500">
            <div className="text-customgreen mr-6 ml-2 mt-1 md:mt-0">
                <span className="font-mono text-xl tracking-tight">pass the aux</span>
            </div>
            <div className="block lg:hidden">
                <ModalTrigger buttonText="Hamburger" />
            </div>
            <div className="font-mono hidden w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    <a href="https://github.com/sawyerpollard/pass-the-aux-client" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-customgreen mr-4">
                        github
                    </a>
                    <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-customgreen">
                        about
                    </a>
                </div>
                <div className="flex mx-2">
                    <ModalTrigger buttonText="Get a Link" mobile={false}/>
                    <ModalTrigger buttonText="Go Random" mobile={false}/>
                </div>
            </div>
        </nav>
    );
}

export default Header;