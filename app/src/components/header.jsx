/* eslint-disable react/prop-types */
import React, { useState } from "react";
import TriangleTooltip from "./tooltip.jsx";
import ClipLoader from "react-spinners/ClipLoader.js";
import { Modal } from "./modal.jsx";
import "../styles.css";
import { getRoomID, enterQueue, findPartner, exitQueue, exitRoom } from "../api.js";

const Header = ({ device, deviceSearching }) => {
  const [showRandom, setShowRandom] = useState(false);
  const [partnerSearching, setPartnerSearching] = useState(true);
  const [findMatchInterval, setFindMatchInterval] = useState(null);
  const [link, setLink] = useState("");
  const [showLink, setShowLink] = useState(false);
  const [showMobile, setShowMobile] = useState(false);

  const closeLink = () => setShowLink(false);
  const openMobile = () => setShowMobile(true);
  const closeMobile = () => setShowMobile(false);

  const openRandom = async () => {
    await enterQueue();
    if (findMatchInterval === null) {
      const findMatch = setInterval(() => {
        findPartner().then(response => {
          console.log(response.message);
          if (response.message === 'success') {
            window.history.replaceState(null, null, "?room=" + response.room_id)
            setPartnerSearching(false);
            clearInterval(findMatch);
          }
        })
      }, 5000);

      setFindMatchInterval(findMatch);
    }
    setShowRandom(true);
  }

  const closeRandom = async () => {
    clearInterval(findMatchInterval);
    await exitQueue();
    setShowRandom(false);
  }

  const openLink = async () => {
    const room = await getRoomID();
    window.history.replaceState(null, null, "?room=" + room)
    setLink("http://localhost:8080?room=" + room);
    setShowLink(true);
  }

  const connectedIcon = () => {
    if (deviceSearching) {
      return <div className="mt-2"><ClipLoader color="#1DB954" size="23px"/></div>;
    }
    else if (device) {
      return <ConnectedIndicator />
    }
    else return <DisconnectedIndicator />
  }

  const inRoomIcon = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const roomID = queryParams.get("room");
    if (roomID) {
      return <LeaveRoomButton />
    }
    else return <UserAloneIndicator />
  }

  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-4 border-b-2 border-gray-500">
      <div className="text-customgreen mr-6 ml-2 mt-1 md:mt-0">
        <span className="font-mono text-xl tracking-tight">pass the aux</span>
      </div>
      <div className="block lg:hidden">
        <HamburgerButton open={openMobile} />
        <Modal body="MobileMenu" showDialog={showMobile} close={closeMobile} mobile={true} />
      </div>
      <div className="font-mono hidden w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="lg:flex-grow">
          <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-customgreen">
            about
          </a>
        </div>
        <div className="flex mx-2 space-x-4">
          <NavButton open={openRandom} buttonText="Go Random" />
          <Modal body="FindRandom" showDialog={showRandom} close={closeRandom} mobile={false} partnerSearching={partnerSearching} />

          <NavButton open={openLink} buttonText="Get a Link" />
          <Modal body="GiveLink" shareURL={link} showDialog={showLink} close={closeLink} mobile={false} />

          <div className="w-1 bg-white rounded"></div>
          {connectedIcon()}
          {inRoomIcon()}
        </div>
      </div>
    </nav>
  );
}

const NavButton = (props) => {
  return (
    <button onClick={props.open}>
      <div className="inline-block bg-customgreen lowercase font-semibold px-3 py-2 leading-none rounded border-2 border-transparent hover:border-white mt-4 lg:mt-0">
        {props.buttonText}
      </div>
    </button>
  );
}

const HamburgerButton = (props) => {
  return (
    <button type="button" onClick={props.open} className="flex items-center px-3 py-2 text-white hover:text-customgreen">
      <svg className="fill-current h-5 w-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
      </svg>
    </button>
  );
}

const ConnectedIndicator = ({ device }) => {
  return (
    <TriangleTooltip label="connected to spotify">
      <div className="flex items-center font-mono text-customgreen">
        <svg className="fill-current w-6 h-6" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
      </div>
    </TriangleTooltip>
  );
}

const DisconnectedIndicator = () => {
  return (
    <TriangleTooltip label="spotify not connected">
      <div className="flex items-center text-red-700">
        <svg className="fill-current w-6 h-6" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
        </svg>
      </div>
    </TriangleTooltip>
  );
}

const UserAloneIndicator = () => {
  return (
    <TriangleTooltip label="you're all alone">
      <div className="flex items-center -mt-1">
        <svg className="fill-current w-6 h-6" viewBox="0 0 20 20" >
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
        </svg>
      </div>
    </TriangleTooltip>
  );
}

const LeaveRoomButton = () => {
  const leaveRoom = async () => {
    await exitRoom();
    location.href = "/";
  }

  return (
    <TriangleTooltip label="leave room" > 
      <button className="flex items-center text-red-700" onClick={leaveRoom}>
        <svg className="fill-current w-6 h-6" viewBox="0 0 20 20" >
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
        </svg>
      </button>
    </TriangleTooltip> 
  );
}

export default Header;