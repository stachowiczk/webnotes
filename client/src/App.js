import React from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [rows, setRows] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const test_mode = false;

  function addTestEntry() {
    axios
      .post("http://localhost:5000/api/submit?title=testtitle&content=testcontent")
  }


  function testServer() {
    axios
      .get("http://localhost:5000/api/search?query=testtitle")
      .then((res) => {
        setIsLoaded(true);
        setData(res);
        console.log(res);
        setRows(res.data);
        


      })
      .catch((err) => {
        setIsLoaded(true);
        setError(err);
      });
  }

  React.useEffect(() => {
    if (test_mode)
      addTestEntry();
    testServer();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return <div>{rows}</div>;
  }
}

export default App;
