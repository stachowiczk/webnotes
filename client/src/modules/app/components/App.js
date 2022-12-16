import React from 'react';
import axios from 'axios';
import TextFeed from '../../common/components/TextFeed.js';

const SESSION_STORAGE_KEY = "titleID";
function App() {
  const [data, setData] = React.useState();

  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [postRequest, setPostRequest] = React.useState();

  const titleNumber = React.useRef(sessionStorage.getItem(SESSION_STORAGE_KEY) || 0);

let postRequestNumbered = "http://localhost:5000/api/submit?title=testtitle" + titleNumber.current + "&content=testcontent" + titleNumber.current
  // function that saves titleNumber to sessionStorage
function saveTitleNumber() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, titleNumber.current);
}

  // function that loads titleNumber from sessionStorage
function loadTitleNumber() {
  const savedTitleNumber = (sessionStorage.getItem(SESSION_STORAGE_KEY));
  titleNumber.current = savedTitleNumber ? savedTitleNumber : 0;
}

  const test_mode = true;
  
  React.useEffect(() => {
     postRequestNumbered = "http://localhost:5000/api/submit?title=testtitle" + titleNumber.current + "&content=testcontent" + titleNumber.current
  }, [titleNumber.current]);

  function addTestEntry() {
    loadTitleNumber();
    axios(
      { method: "post",
        url: postRequestNumbered,
        headers: { "Content-Type": "application/json" },
        data: { title: "testtitle" + titleNumber.current, content: "testcontent" + titleNumber.current }
      }
      ).finally(() => {
      saveTitleNumber()
      titleNumber.current++;
    })
      

  }

  function testServer() {

    axios
      .get("http://localhost:5000/api/search?query=testtitle")
      .then((res) => {
        setData(res.data)
        setIsLoaded(true);
      })
      .catch((err) => {
        setIsLoaded(true);
        setError(err);
      });
    }

 React.useEffect(() => {

    if (test_mode) {
      addTestEntry();
    }
    testServer();
    return () => {
      console.log("cleanup");
    }

  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return <><TextFeed data={data} /></>;
  }
}

export default App;
