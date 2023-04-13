import React from "react";

function ConfirmDelete({ message, onConfirm, onCancel }) {
  return (
    <>
      <div className="overlay" onClick={onCancel}/>
      <div className="popup-container">
        <div className="popup">
          <div className="message">{message}</div>
          <div className="submit-button-container delete">
            <button className="submit-button delete" onClick={onConfirm}>
              Confirm
            </button>
            <button className="submit-button delete" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmDelete;
