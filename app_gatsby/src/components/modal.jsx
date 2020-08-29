/* eslint-disable react/prop-types */
import React from "react";
import "../styles/styles.css";
import { Dialog } from "@reach/dialog";
import "../styles/modal_styles.css";
import ScaleLoader from "react-spinners/ScaleLoader";

export const Modal = ({showDialog, close, body, mobile, loading, deviceName, apiLink, shareURL, partnerSearching}) => {
  const className = mobile ? "w-full h-full text-left" : "inline-block text-center mt-64 rounded h-auto";
  var modalBody;
  switch(body) {
    case modals.SignIn:
      modalBody = <SignIn apiLink={apiLink} />;
      break;
    case modals.DeviceSearch:
      modalBody = <DeviceSearch loading={loading} deviceName={deviceName} />;
      break;
    case modals.FindRandom:
      modalBody = <FindRandom loading={partnerSearching}/>;
      break;
    case modals.GiveLink:
      modalBody = <GiveLink shareURL={shareURL}/>;
      break;
    case modals.MobileMenu:
      modalBody = <Mobile close={close} />;
      break;
    case modals.RoomNotFound:
      modalBody = <RoomNotFound />
      break;
    default: break;
  }

  return (
    <Dialog isOpen={showDialog} onDismiss={close} aria-label="dialog" className={className}>
      {modalBody}
    </Dialog>
  );
};

export const modals = {
  SignIn:       "sign-in",
  DeviceSearch: "device-search",
  FindRandom:   "find-random",
  GiveLink:     "give-link",
  MobileMenu:   "mobile-menu",
  RoomNotFound: "room-not-found",
}

export const GiveLink = ({ shareURL }) => {
  
  const onCopyClick = () => {
    navigator.clipboard.writeText(shareURL);
  }

  return (
    <div className="flex flex-col space-y-2 text-2xl -mt-2 font-semibold">
      <span className="uppercase font-mono font-normal border-b-2 border-text text-left"> Share</span>
      <span className=""> Give this link to a friend: </span>
      <div className="text-primary flex justify-center items-center">
        <p className="font-semibold text-primary mr-3" id="share_link">
          {shareURL}
        </p>
        <button onClick={onCopyClick} type="button" className="flex items-center">
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
            className="mt-1 w-8 h-8 text-textColor hover:text-primary stroke-current"
          >
            <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export const FindRandom = ({ loading }) => {  
  return (
    <div className="flex flex-col text-2xl space-y-2 -mt-2 font-semibold">
      <span className="uppercase font-mono font-normal border-b-2 border-text text-left"> Go Random</span>
      <div className="flex flex-col items-center text-2xl mt-2 space-y-2">
        { loading
          ? <>
              <span> Pairing you up, this shouldn't take long</span> 
              <ScaleLoader color="#6246ea"/>
            </>
          : <span> Found a partner! You can close this. </span>
        }
      </div>
    </div>
  );
};

export const SignIn = ({ apiLink }) => {
  return (
    <div className="flex flex-col text-2xl space-y-2 -mt-2">
      <span className="uppercase font-mono border-b-2 border-text text-left"> Sign In</span>
      <span>Looks like you haven't connected Duotonic to Spotify yet. Click below to sign in.</span>
      <span className="text-xl text-textColor pb-2">Only available for Spotify Premium users</span>
      <div className="inline-block self-center rounded bg-primary text-textColor px-6 pt-1">
        <a href={apiLink}> Sign in with Spotify</a>
      </div>
    </div>
  );
}

export const DeviceSearch = (props) => {
  return (
    <div className="flex flex-col text-2xl space-y-2 -mt-2 -mb-4 font-semibold">
      <span className="text-left font-mono font-normal uppercase border-b-2 border-text"> Connect a Device</span>
      {props.loading
        ? <span> Open the Spotify app on your phone so Pass the AUX can connect to it</span>
        : <span> Now connected to '{props.deviceName}', you're ready to go</span>
      }
      
      <div className="flex flex-col items-center">
        <ScaleLoader color="#6246ea" loading={props.loading}/>
        {props.loading 
          ? <span className="text-textColor text-xl"> searching for devices...</span>
          : <CheckMark />
        }
      </div>
    </div>
  );
}

export const Mobile = ({ close }) => {
  return (
    <div className="relative">
      <button onClick={() => close()} type="button" className="inset-y-0 right-0 absolute w-8 h-8">
        <svg className="hover:text-primary stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </button>
      <MobileMenu />
    </div>
  );
}

export const RoomNotFound = () => {
  return (
    <div className="flex flex-col space-y-2 text-2xl -mt-2">
      <span className="uppercase font-mono border-b-2 border-text text-left">Not Found</span>
      <span className="font-semibold">Sorry, we couldn't find that room.</span>
    </div>
  );
}

const MobileMenu = () => {

  const [showRandom, setShowRandom] = React.useState(false);
  const openRandom = () => setShowRandom(true);
  const closeRandom = () => setShowRandom(false);

  const [showLink, setShowLink] = React.useState(false);
  const openLink = () => setShowLink(true);
  const closeLink = () => setShowLink(false); 

  return (
    <div className="text-3xl lowercase pt-6 font-medium">
      <button onClick={openLink} type="button" className="hover:text-primary">
        Get a Link
        <Modal body={modals.GiveLink} shareURL="link" showDialog={showLink} close={closeLink} mobile={false}/>
      </button>
      <div className="my-2 w-full h-px bg-gray-300"></div>
      <button onClick={openRandom} type="button" className="hover:text-primary">
        Go Random
        <Modal body={modals.FindRandom} showDialog={showRandom} close={closeRandom} mobile={false}/>
      </button>
      <div className="my-2 w-full h-px bg-gray-300"></div>
      <a href="https://duotonic.co" className="text-2xl hover:text-primary">About</a>
    </div>
  );
}

const CheckMark = () => {
  return (
    <svg className="text-primary mr-2 w-20 h-20 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7"></path>
    </svg>
  )
}