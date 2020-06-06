import React from "react";
import "../styles.css";
import { Dialog } from "@reach/dialog";
import "../modal_styles.css";

const Modal = () => {
  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  return (
    <div>
      <button onClick={open}>Open Dialog</button>
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

export default Modal;
