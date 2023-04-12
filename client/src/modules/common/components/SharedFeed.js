import { useState, useEffect, useMemo } from "react";
import DOMPurify from "dompurify";
import SharedEntry from "./SharedEntry";
import { useSelector, useDispatch } from "react-redux";
import {
  setSharedNotes,
  expandAll,
  collapseAll,
} from "../slices/sharedSlice";

import http from "../../auth/components/Interceptor";

function TextFeed({ reload }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [expandButton, setExpandButton] = useState(true);

  const [entryComponents, setEntryComponents] = useState([]);
  const entries = useSelector((state) => state.shared.sharedNotes);
  const reloadFeed = useSelector((state) => state.shared.reload);
  const dispatch = useDispatch();

  async function getUserPosts() {
    setIsLoaded(false);
    try {
      const res = await http.get("http://localhost:5000/notes/shared");
      dispatch(setSharedNotes(res.data));
      setIsLoaded(true);
    } catch (err) {
      setError(err);
      console.error(err);
      setIsLoaded(true);
    }
  }

  function removeChild(childId) {
    setEntryComponents((prevState) =>
      prevState.filter((child) => child.props.noteId !== childId)
    );
  }

  const makeRows = () => {
    try {
      return entries.map((row, index) => (
        <SharedEntry
          key={index}
          keyProp={index}
          noteId={row.id}
          created_at={row.created_at}
          title={DOMPurify.sanitize(row.title)}
          content={DOMPurify.sanitize(row.content)}
          removeMe={removeChild}
        />
      ));
    } catch (error) {
      setError(error);
      console.error(error);
      return <div className="editor">No data</div>;
    }
  };

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

  useEffect(() => {
    getUserPosts();
    return () => {
      Promise.resolve();
    };
  }, [entries.length, reload, reloadFeed]);

  useEffect(() => {
    setEntryComponents(makeRows());
    setEntryComponents((prevState) => prevState.reverse());
    return () => {
      Promise.resolve();
    };
  }, [entries]);

  if (!isLoaded) {
    return (
      <div className="editor">
        <div className="loading"></div>
      </div>
    );
  } else if (entryComponents.length === 0) {
    return (
      <div
        className="editor"
        style={{
          margin: "0 auto",
          marginTop: "30%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i>No notes yet.</i>
      </div>
    );
  } else if (error) {
    return <div className="editor">Error: {error.message}</div>;
  } else {
    return (
      <>
        <div className="expand-button-container">
          <button
            onClick={toggleExpand}
            className="expand-button"
            style={entryComponents.length === 0 ? { display: "none" } : {}}
          >
            {expandButton ? "Expand all" : "Collapse all"}
          </button>
        </div>
        <div className="textfeed-js">{entryComponents}</div>
      </>
    );
  }
}

export default TextFeed;
