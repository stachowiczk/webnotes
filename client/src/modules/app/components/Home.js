import React from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import EditorComponent from "../../common/components/Editor.js";
import http from "../../auth/components/Interceptor";
import TextFeed from "../../common/components/TextFeed.js";
import Menu from "./Menu.js";

function Home() {
  const [error, setError] = React.useState(null);
  const [reloadFeed, setReloadFeed] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(true);
  const [dropdown, setDropdown] = React.useState(false);
  const [value, setValue] = React.useState("");

  function toggleDropdown() {
    setDropdown(!dropdown);
  }

  async function addUserPost() {
    await http.post(
      "http://localhost:5000/notes/",
      JSON.stringify({
        title: value,
        content: value,
      })
    );
    setValue("");
    setReloadFeed(!reloadFeed);
  }

  function deleteAllPosts() {
    if (window.confirm("Are you sure you want to delete all posts?")) {
      http
        .delete("http://localhost:5000/notes/")
        .then(setReloadFeed(!reloadFeed))
        .then(() => {
          setIsLoaded(true);
        })
        .catch((err) => {
          setIsLoaded(true);
          setError(err);
        });
    }
  }

  if (error && error.response.status === 401) {
    return (
      <>
        <div className="editor">
          <h1>Please log in to continue</h1>
          <p></p>
          <Navigate to="/login" />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <button className="user-button" onClick={toggleDropdown}>
            user
          </button>
          {dropdown && <Menu />}
        </div>
        <div className="main-container">
          <div className="item-list">
            {isLoaded ? (
              <TextFeed className="item-list" reload={reloadFeed} />
            ) : (
              <div>Loading...</div>
            )}
          </div>
          <div className="editor">
            <EditorComponent value={value} setValue={setValue} />
          </div>
          <div className="submit-button-container">
            <button className="submit-button" onClick={deleteAllPosts}>
              Clear all data
            </button>
            <button className="submit-button" onClick={addUserPost} style={{}}>
              Save
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default Home;
