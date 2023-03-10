import React from "react";
import DOMPurify from "dompurify";
import Entry from "./Entry";
import { useSelector, useDispatch } from "react-redux";
import {
  setEntries,
  expandAll,
  collapseAll,
  setIsLoaded,
  setError,
  setExpanded,
} from "../slices/feedSlice";
import http from "../../auth/components/Interceptor";

function TextFeed({ reload }) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [expandButton, setExpandButton] = React.useState(true);
  const [error, setError] = React.useState(null);
  const entries = useSelector((state) => state.feed.entries);
  const dispatch = useDispatch();

  function getUserPosts() {
    http
      .get("http://localhost:5000/notes/")
      .then((res) => {
        try {
          setData((data) => res.data);
          dispatch(setEntries(res.data));
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

  const makeRows = () => {
    try {
      return entries.map((row, index) => (
        <Entry
          key={index}
          keyProp={index}
          noteId={row.id}
          created_at={row.created_at}
          title={DOMPurify.sanitize(row.title)} // IMPORTANT
          content={DOMPurify.sanitize(row.content)} // IMPORTANT
        />
      ));
    } catch (error) {
      console.log(error);
      return <div className="editor">No data</div>;
    }
  };

  const entryComponents = [makeRows()];

  const toggleExpand = () => {
    if (expandButton) {
      for (let i = 0; i < entries.length; i++) {
        dispatch(expandAll());
      }
      setExpandButton(false);
    } else {
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].isExpanded) {
          dispatch(collapseAll());
        }
      }
      setExpandButton(true);
    }
  };

  if (!isLoaded) {
    return <div className="editor">Loading...</div>;
  } else if (!data) {
    return <div className="editor">No data</div>;
  } else {
    return (
      <>
        <div className="editor">
          <button onClick={toggleExpand} className="expand-button">
            {expandButton ? "Expand All" : "Collapse All"}
          </button>
        </div>
        <div className="editor">{entryComponents}</div>
      </>
    );
  }
}

export default TextFeed;
