import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Login from "../../common/components/Login.js";
import Editor from "../../common/components/Editor.js";
import axios from "axios";
import http from "./Interceptor";
import TextFeed from "../../common/components/TextFeed.js";

function Home() {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [dataHasChanged, setDataHasChanged] = React.useState();
  const [value, setValue] = React.useState("");
  const navigate = useNavigate();

  function addUserPost() {
    http
      .post(
        "http://localhost:5000/notes/",
        JSON.stringify({ title: value, content: value })
      )
      .then((res) => {
        setDataHasChanged(!dataHasChanged);
        getUserPosts();
      });
  }

  function getUserPosts() {
    setIsLoaded(false);
    http
      .get("http://localhost:5000/notes/")
      .then((res) => {
        try {
          setData((data) => res.data);
          setIsLoaded(true);
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        setIsLoaded(true);
        setError(err);
      });
  }

  function deleteAllPosts() {
    http
      .delete("http://localhost:5000/notes/")
      .then((res) => {
        getUserPosts();
      })
      .then(() => {
        setIsLoaded(false);
        setDataHasChanged(!dataHasChanged);
      })
      .catch((err) => {
        setIsLoaded(true);
        setError(err);
      });
  }

  React.useEffect(() => {
    getUserPosts();
    console.log("useEffect");
  }, []);

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
        <div className="editor">
          <Editor value={value} setValue={setValue} />
        </div>
        <button className="editor" onClick={deleteAllPosts}>
          CLEAR ALL
        </button>
        <button className="editor" onClick={addUserPost}>
          POST
        </button>
        {isLoaded ? (
          <TextFeed
            className="editor"
            data={data}
            dataHasChanged={dataHasChanged}
          />
        ) : (
          <div>Loading...</div>
        )}
      </>
    );
  }
}

export default Home;
