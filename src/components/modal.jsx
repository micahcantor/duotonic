import React from "react";
import "../styles.css";
import { Dialog } from "@reach/dialog";
import "../modal_styles.css";

const ModalTrigger = (props) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  var dialogBody = null;

  switch (props.buttonText) {
    case "Get a Link":
      dialogBody = <GiveLink />;
      break;
    case "Go Random":
      dialogBody = <FindRandom />;
      break;
  }

  return (
    <div>
      <TriggerButton open={open} buttonText={props.buttonText} />
      <Dialog isOpen={showDialog} onDismiss={close} aria-label="modal">
        {dialogBody}
      </Dialog>
    </div>
  );
};

class GiveLink extends React.Component {
  constructor(props) {
    super(props);
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
            <svg
              className="mt-1 w-10 h-10 text-white hover:text-customgreen stroke-current"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
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
      <span> Loading loading </span>
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

export default ModalTrigger;
