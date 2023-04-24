import React, { useState, useEffect } from "react";
import http from "../../auth/components/Interceptor";
import * as cfg from "../../../config.js"

function SharePopup({ show, close, noteId }) {
  const [showMe, setShowMe] = useState(show);
  const [targetUser, setTargetUser] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault();
    try {
      const response = await http.post(
        `${cfg.API_BASE_URL}${cfg.NOTES_SHARE_ID_ENDPOINT}${noteId}`,
        JSON.stringify({
          target_user: targetUser,
          can_edit: canEdit,
        })
      );
      if (response.status === 200) {
        console.log(response.data);
        close();
      } else {
        console.log(response.data);
      }
    } catch (error) {
      setError(error);
      console.log(error);
    }
  }

  function handleChange(e) {
    e.preventDefault();
    setTargetUser(e.target.value);
  }

  useEffect(() => {
    const checkAvailable = () => {
      http({
        method: "get",
        url: `${cfg.API_BASE_URL}${cfg.AUTH_REGISTER_GET}${targetUser}`,
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (res.data[1] === 409) {
          console.log(res.data);
          setUserExists(false);
        } else {
          setUserExists(true);
        }
      });
    };
    checkAvailable();
    return () => {
      setUserExists(true);
      Promise.resolve();
    };
  }, [targetUser]);

  function handleCheckEdit(e) {
    e.preventDefault();
    setCanEdit(e.target.checked);
  }

  if (error !== null) {
    return (
      <>
        <div
          id="share-popup"
          style={{ display: "flex", flexDirection: "column" }}
        >
          Something went wrong. Make sure the user exists and try again
          <button className="submit-button" onClick={close}>
            close
          </button>
        </div>
      </>
    );
  }
  else {

      
      return (
          <>
      <div className="overlay" onClick={close}></div>
      <div id="share-popup">
        <form className="form">
          <label htmlFor="username" style={labelStyle}>
            {userExists && targetUser !== "" ? "User not found" : ""}
          </label>
          <label htmlFor="username" style={{display: "flex", marginLeft: "0", marginRight: "auto"}}>Share with:</label>
          <input
            type="text"
            name="username"
            id="target-user"
            onChange={handleChange}
            />
          
          <div className="submit-button-container">
            <button className="submit-button" onClick={close}>
              Close
            </button>
            <button className="submit-button" onClick={submit}>
              Share
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
}
const labelStyle = {
    flex: "0",
    color: "red",
    minHeight: "1em",
    marginTop: "0em",
    fontSize: "0.9em",
    
};

export default SharePopup;
