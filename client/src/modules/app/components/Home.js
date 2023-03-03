import React from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import Login from "../../common/components/Login.js";
import Editor from "../../common/components/Editor.js";
import axios from "axios";
import http from "./Interceptor";
import TextFeed from "../../common/components/TextFeed.js";
import Menu from "./Menu.js";

function Home() {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [reloadFeed, setReloadFeed] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(true);
  const [dataHasChanged, setDataHasChanged] = React.useState();
  const [value, setValue] = React.useState("");
  const [valueToHttppost, setValueToHttppost] = React.useState("");
  const [title, setTitle] = React.useState("");
  const navigate = useNavigate();
  const [prepData, setPrepData] = React.useState({
    title: "",
    content: "",
  });
  const [dropdown, setDropdown] = React.useState(false);

  function toggleDropdown() {
    setDropdown(!dropdown);
  }

  

  async function addUserPost() {
    await http.post(
      "http://localhost:5000/notes/",
      JSON.stringify({ title: value, content: value })
    );
    setReloadFeed(!reloadFeed);

    //getUserPosts();
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
        <div className="editor">
          <Editor value={value} setValue={setValue} />
        </div>
        <button className="editor" onClick={deleteAllPosts}>
          Clear all data
        </button>
        <button className="editor" onClick={addUserPost}>
          Save
        </button>
        {isLoaded ? (
          <TextFeed className="editor" reload={reloadFeed}/>
        ) : (
          <div>Loading...</div>
        )}
      </>
    );
  }
}

export default Home;
