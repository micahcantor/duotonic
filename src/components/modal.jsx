import React from "react";
import "../styles.css";
import { Dialog } from "@reach/dialog";
import "../modal_styles.css";

const ModalTrigger = (props) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  return (
    <div>
        <TriggerButton open={open} buttonText={props.buttonText} />
        <Dialog isOpen={showDialog} onDismiss={close} aria-label="modal">
            <button className="close-button" onClick={close}>
            <span aria-hidden aria-label="close">
                ×
            </span>
            </button>
            <p>Hello there. I am a dialog</p>
        </Dialog>
    </div>
  );
};

const TriggerButton = (props) => {
    return (
        <button 
            className="inline-block text-sm px-4 py-2 leading-none border rounded hover:text-customgreen hover:border-customgreen mt-4 mx-2 lg:mt-0" 
            onClick={props.open}> {props.buttonText} 
        </button>
    )
}

export default ModalTrigger;
