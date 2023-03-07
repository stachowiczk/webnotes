import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import http from "../../auth/components/Interceptor";
import { setExpanded } from "../slices/feedSlice";


function Entry({ keyProp, noteId, title, content, created_at}) {
  const [reload, setReload] = useState(false);
  const data = useSelector((state) => state.feed.entries);
  const dispatch = useDispatch();
  
  created_at = created_at.slice(0, 17);

  async function deleteNoteById() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await http.delete(`http://localhost:5000/notes/${noteId}`);
      setReload(!reload);
    }
  }

  function toggleExpanded() {
    dispatch(setExpanded(keyProp));
  }


  if (reload) {
    return;
  } else {
    return (
      <>
        <div onClick={toggleExpanded} className="entry-main" style={{cursor: "pointer"}}>
          <div>
            <button type="delete" className="x-button" onClick={deleteNoteById}> x </button>
          </div>
          <div style={{marginTop: "0em", display: data[keyProp].isExpanded ? "none" : "block"}}dangerouslySetInnerHTML={{ __html: title }} />
          <div
            style={{ display: data[keyProp].isExpanded ? "block" : "none", cursor: "pointer" }}
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
