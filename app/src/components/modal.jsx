/* eslint-disable react/prop-types */
import React from "react";
import "../styles.css";
import { Dialog } from "@reach/dialog";
import "../modal_styles.css";

export const Modal = ({showDialog, close, modalBody, mobile}) => {
  const className = mobile ? "w-full h-full text-left" : "inline-block text-center mt-64 rounded h-auto";
  return (
    <Dialog isOpen={showDialog} onDismiss={close} aria-label="dialog" className={className}>
      {modalBody}
    </Dialog>
  );
};

export const GiveLink = (props) => {
  
  const onCopyClick = () => {
    navigator.clipboard.writeText("link.url/link"); // switch for this.props.shareUrl
  }

  return (
    <div className="flex flex-col items-center font-semibold text-2xl md:text-4xl">
      <span className=""> Share this link with a friend: </span>
      <div className="text-customgreen flex items-center">
        <p className="font-semibold text-customgreen mr-4" id="share_link">
          link.url/link {props.shareUrl}
        </p>
        <button onClick={onCopyClick} type="button">
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
            className="mt-1 w-10 h-10 text-white hover:text-customgreen stroke-current"
          >
            <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export const FindRandom = () => {
  return (
    <div className="flex flex-col items-center font-semibold text-2xl md:text-4xl">
      <span> Pairing you up... </span>
      <span> Loading </span>
    </div>
  );
};

const NotAuthorized = () => {
  const onClick = () => {}
  return (
    <div className="flex flex-col item-center font-semibold text-2xl md:text-4xl">
      <span> Looks like you haven't connected your Spotify account yet.</span>
      <button onClick={onClick} className="rounded bg-customgreen text-white" type="button">
        Connect Now
      </button>
    </div>
  );
}

export const Mobile = (props) => {
  return (
    <div className="relative">
      <button onClick={() => props.close()} type="button" className="inset-y-0 right-0 absolute w-8 h-8">
        <svg className="hover:text-customgreen stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </button>
      <MobileMenu />
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
    <div className="text-3xl font-mono lowercase pt-6">
      <button onClick={openLink} type="button" className="hover:text-customgreen">
        Get a Link
        <Modal modalBody={<GiveLink shareUrl="link" />} showDialog={showLink} close={closeLink} mobile={false}/>
      </button>
      <div className="my-2 w-full h-px bg-gray-300"></div>
      <button onClick={openRandom} type="button" className="hover:text-customgreen">
        Go Random
        <Modal modalBody={<FindRandom />} showDialog={showRandom} close={closeRandom} mobile={false}/>
      </button>
      <div className="my-2 w-full h-px bg-gray-300"></div>
      <div className="text-2xl hover:text-customgreen"> Github </div>
      <div className="my-2 w-full h-px bg-gray-300"></div>
      <div className="text-2xl hover:text-customgreen"> About </div>
    </div>
  );
}