import React from "react";
import jscookie from "js-cookie";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Register from "../../common/components/Register.js";
import Login from "../../common/components/Login.js";
import { AxiosRequestHeaders } from "axios";

import axios from "axios";
import TextFeed from "../../common/components/TextFeed.js";
import Cookies from "js-cookie";

function getCookie(cookieName) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const [cookieKey, cookieValue] = cookie.split("=");
    if (cookieKey === cookieName) {
      return cookieValue;
    }
  }
  return null;
}

const SESSION_STORAGE_KEY = "titleID";
function App() {
  const [data, setData] = React.useState();
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [dataHasChanged, setDataHasChanged] = React.useState(true);

  const titleNumber = React.useRef(
    sessionStorage.getItem(SESSION_STORAGE_KEY) || 0
  );
  const [value, setValue] = React.useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ align: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "align",
    "list",
    "bullet",
    "indent",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  const placeholder = "Write something...";

  const handleChange = (value) => {
    setValue(value);
  };

  function addTestEntry() {
    axios({
      method: "post",
      withCredentials: true,
      url: "http://localhost:5000/notes/",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
      // set the json data to the value of the text state
      data: JSON.stringify({ title: value, content: value }),
    })
      .then((res) => {
        testServer();
      })
      .then(() => {
        setDataHasChanged(() => !dataHasChanged);
      });
  }

  function testServer() {
    axios({
      method: "get",
      withCredentials: true,
      url: "http://localhost:5000/notes/",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
    }})
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
  //
  // remove this for production!!!
  function dropTable() {
    axios({
      method: "get",
      withCredentials: true,
      url: "http://localhost:5000/api/drop",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        Authorization: getCookie("token"),
      },
    })
      .then((res) => {
        testServer();
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
    testServer();
  }, [dataHasChanged]);

  // React.useEffect(() => {
  //   testServer();
  //   setIsLoaded(isLoaded => !isLoaded);
  // }, [dataHasChanged]);

  if (error && error.response.status === 401) {
    return (
      <>
        <Register />
        <Login />
        <div className="editor">
          <h1>401: Unauthorized</h1>
          <p>
            You are not authorized to view this page. Please log in or register
            to continue.
          </p>
        </div>
      </>
    );
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <Register />
        <Login />
        <ReactQuill
          className="editor"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
        <button className="editor" onClick={dropTable}>
          CLEAR ALL
        </button>
        <button className="editor" onClick={addTestEntry}>
          POST
        </button>
        <TextFeed
          className="editor"
          data={data}
          dataHasChanged={dataHasChanged}
        />
      </>
    );
    // TODO: read docs + format editor component + styles
  }
}

export default App;
