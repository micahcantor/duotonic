import React, { useState } from "react";
import TriangleTooltip from "./tooltip.jsx";
import ClipLoader from "react-spinners/ClipLoader.js";
import { Modal, modals } from "./modal.jsx";
import Icon from "./icon.jsx"
import "../styles/styles.css";
import { getRoomID, enterQueue, findPartner, exitQueue, exitRoom } from "../api.js";

const Header = ({ device, deviceSearching, room, setRoom, wsClient }) => {
  const [showRandom, setShowRandom] = useState(false);
  const [partnerSearching, setPartnerSearching] = useState(true);
  const [findMatchInterval, setFindMatchInterval] = useState(null);
  const [link, setLink] = useState("");
  const [showLink, setShowLink] = useState(false);
  const [showMobileHeader, setShowMobileHeader] = useState(false);

  const openRandom = async () => {
    await enterQueue();  // adds user to the queue of users looking for a match
    await exitRoom(null);// removes user from all rooms prior to beginning the search for a new one
    if (!findMatchInterval) {
      const findMatch = setInterval(() => {
        findPartner().then(response => {
          console.log(response.message);
          if (response.message === 'success') {
            window.history.replaceState(null, null, "?room=" + response.room_id);
            setRoom(response.room_id);
            setPartnerSearching(false);
            clearInterval(findMatch);
          }
        })
      }, 2000);

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
    /* If the user is already in a room, just display their url */
    let roomID = room;
    if (!room || room.length === 0) {
      roomID = await getRoomID();
      setRoom(roomID);
      window.history.replaceState(null, null, "?room=" + roomID);
    }
    setLink(`${process.env.GATSBY_APP_URL}?room=${roomID}`)
    setShowLink(true);
  }

  const closeLink = () => setShowLink(false);

  const onHamburgerClick = () => setShowMobileHeader(show => !show);

  const connectedIcon = () => {
    if (deviceSearching) {
      return <LoadingIndicator/>
    }
    else if (device) {
      return <ConnectedIndicator />
    }
    else return <DisconnectedIndicator />
  }

  const inRoomIcon = (wsClient) => {
    if (typeof window !== `undefined`) {
      const queryParams = new URLSearchParams(window.location.search);
      const roomID = queryParams.get("room");
      if (roomID) {
        return <LeaveRoomButton wsClient={wsClient}/>
      }
      else return <UserAloneIndicator />
    }
    return null;
  }

  return (
    <nav className="flex items-center justify-between flex-wrap bg-bgDark p-4 border-b-2 border-text">
      <div className="text-primary flex items-center px-0 md:px-2 md:mt-0">
        <Icon />
        <span className="font-bold text-2xl text-text">duotonic</span>
        <a href="https://duotonic.co" className="text-text text-xl hover:text-primary px-5 hidden md:block">about</a>
      </div>
      <div className="block md:hidden">
        <HamburgerButton onClick={onHamburgerClick}/>
      </div>
      <div className={`${showMobileHeader ? "flex" : "hidden"} font-mono md:flex items-center w-auto mt-2 md:mt-0`}>
        <div className="flex mx-2 space-x-4">
          <NavButton open={openRandom} buttonText="Go Random" />
          <Modal body={modals.FindRandom} showDialog={showRandom} close={closeRandom} partnerSearching={partnerSearching} />

          <NavButton open={openLink} buttonText="Get a Link" />
          <Modal body={modals.GiveLink} shareURL={link} showDialog={showLink} close={closeLink} />

          <div className="w-1 bg-white rounded"></div>
          {connectedIcon()}
          {inRoomIcon(wsClient)}
        </div>
      </div>
    </nav>
  );
}

const NavButton = (props) => {
  return (
    <button onClick={props.open}>
      <div className="inline-block bg-primary lowercase font-semibold px-3 py-2 leading-snug rounded transform hover:scale-110">
        {props.buttonText}
      </div>
    </button>
  );
}

const HamburgerButton = (props) => {
  return (
    <button type="button" onClick={props.onClick} className="flex items-center px-3 py-2 text-textColor hover:text-primary">
      <svg className="fill-current h-5 w-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
      </svg>
    </button>
  );
}

const LoadingIndicator = () => {
  function onClick() {
    localStorage.removeItem("auth");
    window.location.href = "/";
  }

  return (
    <div className="flex items-center justify-center mt-2">
      <TriangleTooltip label="try signing in again?">
        <button onClick={onClick}>
          <ClipLoader color="#6246ea" size="24px"/>
        </button>
      </TriangleTooltip>
    </div>
  )
}

const ConnectedIndicator = () => {
  return (
    <TriangleTooltip label="connected to spotify">
      <div className="flex items-center font-mono text-primary">
        <svg className="fill-current w-6 h-6 transform hover:scale-125" viewBox="0 0 20 20">
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
        <svg className="fill-current w-6 h-6 transform hover:scale-125" viewBox="0 0 20 20">
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
        <svg className="fill-current w-6 h-6 transform hover:scale-125" viewBox="0 0 20 20" >
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
        </svg>
      </div>
    </TriangleTooltip>
  );
}

const LeaveRoomButton = ({ wsClient }) => {
  const leaveRoom = async () => {
    await exitRoom();
    wsClient.subscriptions().forEach(sub => wsClient.unsubscribe(sub, null));
    if (window.location) {
      window.location.href = "/";
    }
  }

  return (
    <TriangleTooltip label="leave room" > 
      <button className="flex items-center text-red-700" onClick={leaveRoom}>
        <svg className="fill-current w-6 h-6 transform hover:scale-125" viewBox="0 0 20 20" >
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
        </svg>
      </button>
    </TriangleTooltip> 
  );
}

export default Header;