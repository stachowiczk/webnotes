import React from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Register from "../../common/components/Register.js";
import Login from "../../common/components/Login.js";
import { AxiosRequestHeaders } from "axios";

import axios from "axios";
import TextFeed from "../../common/components/TextFeed.js";

function getCookie(cookieName) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [cookieKey, cookieValue] = cookie.split('=');
    if (cookieKey === cookieName) {
      return cookieValue;
    }
  }
  return null;
}

const SESSION_STORAGE_KEY = "titleID";
function App() {
  const [data, setData] = React.useState();
  const [text, setText] = React.useState("");

  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [postRequest, setPostRequest] = React.useState();
  const [dataHasChanged, setDataHasChanged] = React.useState(true);

  const titleNumber = React.useRef(
    sessionStorage.getItem(SESSION_STORAGE_KEY) || 0
  );
  const [value, setValue] = React.useState('');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'color': [] }, { 'background': [] }],
      [{'script': 'sub'}, {'script': 'super' }],
      [{'align': [] }],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font', 'bold', 'italic', 'underline', 'strike', 'color', 'background',
    'script', 'align', 'list', 'bullet', 'indent', 'blockquote', 'code-block', 'link', 'image'
  ];

  const placeholder = 'Write something...';

  const handleChange = (value) => {
    setValue(value);
  };
  let postRequestNumbered =
    "http://localhost:5000/api/submit?title=testtitle" +
    titleNumber.current +
    "&content=testcontent" +
    titleNumber.current;
  // function that saves titleNumber to sessionStorage
  function saveTitleNumber() {
    sessionStorage.setItem(SESSION_STORAGE_KEY, titleNumber.current);
  }

  // function that loads titleNumber from sessionStorage
  function loadTitleNumber() {
    const savedTitleNumber = sessionStorage.getItem(SESSION_STORAGE_KEY);
    titleNumber.current = savedTitleNumber ? savedTitleNumber : 0;
  }

  const test_mode = false;

  React.useEffect(() => {
    postRequestNumbered =
      "http://localhost:5000/api/submit?title=testtitle" +
      titleNumber.current +
      "&content=testcontent" +
      titleNumber.current;
  }, [titleNumber.current]);

  function addTestEntry() {
    axios({
      method: "post",
      url: "http://localhost:5000/api/submit",
      headers: { "Content-Type": "application/json",
      "Authorization": getCookie("token") },
      // set the json data to the value of the text state
      data: JSON.stringify({ title: value, content: value }),
    }).then((res) => {
      testServer();
    }).then(() => {
      setDataHasChanged(() => !dataHasChanged);
    })
    };

  function testServer() {
    axios
      .get("http://localhost:5000/api/search")
      .then((res) => {
        setData(res.data);
        setIsLoaded(true);
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
      url: "http://localhost:5000/api/drop",
      headers: ({"Content-Type": "application/json", "Authorization": getCookie("token") }),
    }).then((res) => {
      testServer();
    }).then(() => {
      setDataHasChanged(() => !dataHasChanged);
    }).catch((err) => {
      setIsLoaded(true);
      setError(err);
    }
    );


  }
  // remove this for production!!!
  //

  const [postRequestSent, setPostRequestSent] = React.useState(false);
  React.useEffect(() => {
    if (test_mode && !postRequestSent) {
      addTestEntry();
      setPostRequestSent(true);
    }
    testServer();
    return () => {
      console.log("cleanup");
    };
  }, []);

  // React.useEffect(() => {
  //   testServer();
  //   setIsLoaded(isLoaded => !isLoaded);
  // }, [dataHasChanged]);


  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <Register /> 
        <Login /> 
        <ReactQuill 
            value={value}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder} />
        <button onClick={dropTable}>DROP</button>
        <button onClick={addTestEntry}>POST</button>
        <TextFeed data={data} dataHasChanged={dataHasChanged}/>
      </>
    );
    // TODO: read docs + format editor component + styles
  }
}

export default App;
