import React from 'react';
import axios from 'axios';
import TextFeed from './components/TextFeed.js';

function App() {
  const [data, setData] = React.useState();

  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  //const test_mode = false;
//
  //function addTestEntry() {
  //  axios
  //    .post("http://localhost:5000/api/submit?title=testtitle&content=testcontent")
  //}

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
// conmm
 React.useEffect(() => {
    testServer();
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
