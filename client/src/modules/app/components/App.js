import React from "react";
import Register from "../../common/components/Register.js";
import Login from "../../common/components/Login.js";
import Editor from "../../common/components/Editor.js";
import axios from "axios";
import TextFeed from "../../common/components/TextFeed.js";

function App() {
  const [data, setData] = React.useState();
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [dataHasChanged, setDataHasChanged] = React.useState(true);
  const [value, setValue] = React.useState("");

  function addUserPost() {
    axios({
      method: "post",
      withCredentials: true,
      url: "http://localhost:5000/notes/",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
      // set the json data to the value of the text state of react-quill
      data: JSON.stringify({ title: value, content: value }),
    })
      .then((res) => {
        getUserPosts();
      })
      .then(() => {
        setDataHasChanged(() => !dataHasChanged);
      });
  }

  function getUserPosts() {
    axios({
      method: "get",
      withCredentials: true,
      url: "http://localhost:5000/notes/",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    })
      .then((res) => {
        try {
          setData(res.data);
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
    axios({
      method: "delete",
      withCredentials: true,
      url: "http://localhost:5000/notes/",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    })
      .then((res) => {
        getUserPosts();
      })
      .then(() => {
        setDataHasChanged(() => !dataHasChanged);
      })
      .catch((err) => {
        setIsLoaded(true);
        setError(err);
      });
  }

  React.useEffect(() => {
    getUserPosts();
  }, [dataHasChanged]);

  // React.useEffect(() => {
  //   getUserPosts();
  //   setIsLoaded(isLoaded => !isLoaded);
  // }, [dataHasChanged]);

  if (error && error.response.status === 401) {
    return (
      <>
        <div className="editor">
          <h1>Please log in to continue</h1>
          <p></p>
        <Login isLoaded={!isLoaded} setIsLoaded={setIsLoaded} />
        </div>
      </>
    );
  } else if (!isLoaded) {
    return <div>Loading...</div>;
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
        <TextFeed
          className="editor"
          data={data}
          dataHasChanged={dataHasChanged}
        />
      </>
    );
  }
}

export default App;
