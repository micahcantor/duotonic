import React from "react";
import "../styles.css";
import { Dialog } from "@reach/dialog";
import "../modal_styles.css";

const ModalTrigger = (props) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  var modalBody = null;
  var className = "inline-block text-center mt-64 rounded h-auto";

  switch (props.buttonText) {
    case "Get a Link":
      modalBody = <GiveLink />;
      break;
    case "Go Random":
      modalBody = <FindRandom />;
      break;
    case "Hamburger":
      modalBody = <MobileMenu close={close}/>;
      className = "h-full text-left";
      break;
  }

  return (
    <div >
      {props.buttonText == "Hamburger"? <HamburgerButton open={open}/> : <TriggerButton open={open} buttonText={props.buttonText} />}
      <Dialog isOpen={showDialog} onDismiss={close} aria-label="modal" className={className}>
        {modalBody}
      </Dialog>
    </div>
  );
};

const TriggerButton = (props) => {
  return (
    <button
      className="inline-block text-sm lowercase font-mono px-3 py-2 leading-none border rounded hover:text-customgreen hover:border-customgreen mt-4 mx-2 lg:mt-0"
      onClick={props.open}
    >
      {props.buttonText}
    </button>
  );
};

const HamburgerButton = (props) => {
  return (
    <button type="button" onClick={props.open} className="flex items-center px-3 py-2 text-white hover:text-customgreen">
        <svg className="fill-current h-5 w-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
        </svg>
    </button>
  );
}

class GiveLink extends React.Component {
  constructor(props) {
    super(props);
    this.onCopyClick = this.onCopyClick.bind(this);
  }

  onCopyClick() {
    navigator.clipboard.writeText("link.url/link"); // switch for this.props.shareUrl
  }

  render() {
    return (
      <div className="flex flex-col items-center font-semibold text-xl xl:text-4xl">
        <span className=""> Share this link with a friend: </span>
        <div className="text-customgreen flex items-center">
          <p className="font-semibold text-customgreen mr-4" id="share_link">
            link.url/link {this.props.shareUrl}
          </p>
          <button onClick={this.onCopyClick} type="button">
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
}

const FindRandom = () => {
  return (
    <div className="flex flex-col items-center font-semibold text-xl xl:text-4xl">
      <span> Pairing you up... </span>
      <span> Loading </span>
    </div>
  );
};

class MobileMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="relative">
        <button onClick={() => this.props.close()} type="button" className="inset-y-0 right-0 absolute w-8 h-8">
          <svg className="hover:text-customgreen stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </button>
        <div className="text-3xl divide-y divide-gray-300 font-mono lowercase pt-6">
          <div className="py-2 hover:text-customgreen"> Get a link </div>
          <div className="py-2 hover:text-customgreen"> Go Random </div>
          <div className="text-2xl py-2 hover:text-customgreen"> Github </div>
          <div className="text-2xl py-2 hover:text-customgreen"> About </div>
        </div>
      </div>
    );
  }
}



export default ModalTrigger;
