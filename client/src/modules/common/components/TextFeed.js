import React from "react";
import DOMPurify from "dompurify";
import Entry from "./Entry";
import http from "../../app/components/Interceptor";
import { displayName } from "react-quill";

function TextFeed({ reload }) {
  const [rows, setRows] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  function getUserPosts() {
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
  React.useEffect(() => {
    getUserPosts();
  }, []);

  React.useEffect(() => {
    setIsLoaded(false);
    getUserPosts();
  }, [reload]);


  //React.useEffect(() => {
    //setRows(data);
    //makeRows();
  //}, []);

  //React.useEffect(() => {
  //  setRows(data);
  //  makeRows();
  //}, [data]);

  //const refresh = () => {
    //setRows(data);
  //};
  //TODO: make this a comp
  const makeRows = () => {
    try {
      return data.map((row, index) => (
        <Entry
          key={index}
          created_at={row.created_at}
          title={DOMPurify.sanitize(row.title)} // IMPORTANT
          content={DOMPurify.sanitize(row.content)} // IMPORTANT
        />
      ));
    } catch (error) {
      console.log(error);
      return <div className="editor">No data</div>;
    }
    // return rows.map((row, index) => (
    //   <Entry key={index} created_at={row.created_at} title={DOMPurify.sanitize(row.title)} />
    // ));
  };

  if (!isLoaded) {
    return <div className="editor">Loading...</div>;
  } else if (!rows) {
    return <div className="editor">No data</div>;
  } else {
    return (
      <>
        <div className="editor">{makeRows()}</div>
      </>
    );
  }
}

export default TextFeed;
