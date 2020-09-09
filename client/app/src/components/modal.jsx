/* eslint-disable react/prop-types */
import React from "react";
import "../styles/styles.css";
import { Dialog } from "@reach/dialog";
import "../styles/modal_styles.css";
import ScaleLoader from "react-spinners/ScaleLoader";

export const Modal = ({showDialog, close, body, loading, deviceName, signInLink, setSignInLink, shareURL, partnerSearching}) => {
  const className = "w-full md:w-auto md:inline-block text-center rounded h-auto";
  var modalBody;
  switch(body) {
    case modals.SignIn:
      modalBody = <SignIn signInLink={signInLink} setSignInLink={setSignInLink}/>;
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
        <p className="break-all font-semibold text-primary mr-3" id="share_link">
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

export const SignIn = ({ signInLink, setSignInLink }) => {

  function onChange(e) {
    if (e.target.checked) {
      setSignInLink(link => link + "&remember=true");
    }
    else {
      setSignInLink(link => link.replace("&remember=true", ""));
    }
  }

  return (
    <div className="flex flex-col text-2xl space-y-2 justify-center">
      <span className="uppercase font-mono border-b-2 border-text text-left"> Sign In</span>
      <span className="pb-2">Looks like you haven't connected Duotonic to Spotify yet. Click below to sign in.</span>
      <div className="flex items-center space-x-4 mx-auto">
        <div className="inline-block self-center rounded bg-primary text-textColor px-6 py-1">
          <a href={signInLink}> Sign in with Spotify</a>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg">Remember This Device</span>
          <input name="remember-me" onChange={onChange} type="checkbox"/>
        </div>
      </div>
      <div className="flex flex-col text-lg pt-2">
        <span className="text-textColor">Only available for Spotify Premium users</span>
        <span className="text-textColor">By signing in with Spotify, you agree to our {" "}
          <a className="underline" href="https://duotonic.co/terms">Terms</a> 
          {" "} and {" "}
          <a className="underline" href="https://duotonic.co/privacy-policy">{" "} Privacy Policy</a>
        </span>
      </div>
    </div>
  );
}

export const DeviceSearch = (props) => {
  return (
    <div className="flex flex-col text-2xl space-y-2 -mt-2 -mb-4 font-semibold">
      <span className="text-left font-mono font-normal uppercase border-b-2 border-text"> Connect a Device</span>
      {props.loading
        ? <span> Open the Spotify app on your phone so Duotonic can connect to it</span>
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

export const RoomNotFound = () => {
  return (
    <div className="flex flex-col space-y-2 text-2xl -mt-2">
      <span className="uppercase font-mono border-b-2 border-text text-left">Not Found</span>
      <span className="font-semibold">Sorry, we couldn't find that room.</span>
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