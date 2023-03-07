import { useState, useEffect } from "react";
import http from "../../app/components/Interceptor";

function Entry({ noteId, title, content, created_at }) {
  const [reload, setReload] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  created_at = created_at.slice(0, 17);

  async function deleteNoteById() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await http.delete(`http://localhost:5000/notes/${noteId}`);
      setReload(!reload);
    }
  }

  function toggleExpanded() {
    setIsExpanded(!isExpanded);
  }

  if (reload) {
    return;
  } else {
    return (
      <>
        <div onClick={toggleExpanded} className="entry-main" style={{cursor: "pointer"}}>
          <div>
            <button className="x-button" onClick={deleteNoteById}> x </button>
          </div>
          <div style={{marginTop: "0em", display: isExpanded ? "none" : "block"}}dangerouslySetInnerHTML={{ __html: title }} />
          <div
            style={{ display: isExpanded ? "block" : "none", cursor: "pointer" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <span
            style={{ fontStyle: "italic" }}
          >{`Created: ${created_at}`}</span>
        </div>
      </>
    );
  }
}

export default Entry;
