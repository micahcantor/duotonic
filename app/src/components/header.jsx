/* eslint-disable react/prop-types */
import React from "react";
import { Modal, FindRandom, GiveLink, Mobile } from "./modal.jsx";
import "../styles.css";

const Header = () => {
  const [showRandom, setShowRandom] = React.useState(false);
  const openRandom = () => setShowRandom(true);
  const closeRandom = () => setShowRandom(false);

  const [showLink, setShowLink] = React.useState(false);
  const openLink = () => setShowLink(true);
  const closeLink = () => setShowLink(false);

  const [showMobile, setShowMobile] = React.useState(false);
  const openMobile = () => setShowMobile(true);
  const closeMobile = () => setShowMobile(false);

  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-4 border-b-2 border-gray-500">
      <div className="text-customgreen mr-6 ml-2 mt-1 md:mt-0">
        <span className="font-mono text-xl tracking-tight">pass the aux</span>
      </div>
      <div className="block lg:hidden">
        <HamburgerButton open={openMobile}/>
        <Modal modalBody={<Mobile close={closeMobile}/>} showDialog={showMobile} close={closeMobile} mobile={true}/>
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
          <NavButton open={openRandom} buttonText="Go Random"/>
          <Modal modalBody={<FindRandom />} showDialog={showRandom} close={closeRandom} mobile={false}/>

          <NavButton open={openLink} buttonText="Get a Link"/>
          <Modal modalBody={<GiveLink shareUrl="link" />} showDialog={showLink} close={closeLink} mobile={false}/>
        </div>
      </div>
    </nav>
  );
}

const NavButton = (props) => {
  return (
    <button onClick={props.open}>
      <div className="inline-block text-sm lowercase font-mono px-3 py-2 leading-none border-2 rounded hover:text-customgreen hover:border-customgreen mt-4 mx-2 lg:mt-0">
        {props.buttonText}
      </div>
    </button>
  );
}

const HamburgerButton = (props) => {
  return (
    <button type="button" onClick={props.open} className="flex items-center px-3 py-2 text-white hover:text-customgreen">
      <svg className="fill-current h-5 w-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
      </svg>
    </button>
  );
}

export default Header;