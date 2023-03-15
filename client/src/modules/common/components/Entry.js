import { useSelector, useDispatch } from "react-redux";
import http from "../../auth/components/Interceptor";
import { setExpanded } from "../slices/feedSlice";

function Entry({ keyProp, noteId, title, content, created_at, removeMe }) {
  const data = useSelector((state) => state.feed.entries);
  const dispatch = useDispatch();

  try {
    created_at = created_at.slice(0, 17); // only show date
  }
  catch {
    created_at = "no data";
  }

  async function deleteNoteById() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await http.delete(`http://localhost:5000/notes/${noteId}`);
      removeMe(noteId);
    }
  }

  function toggleExpanded() {
    dispatch(setExpanded(keyProp));
  }

  return (
    <>
      <div
        className="entry-main"
      >
        <div>
          <button type="button" className="x-button" onClick={deleteNoteById}>
            {""}
            x{""}
          </button>
        </div>
        <div
          style={{
            marginTop: "0em",
            display: data[keyProp].isExpanded ? "none" : "block",
            fontSize: "1.3em",
          }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div
          style={{
            display: data[keyProp].isExpanded ? "block" : "none",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <span style={{ fontStyle: "italic", fontSize: "small" }}>{`Created: ${created_at}`}</span>
        <button className="expand-button expand-item" onClick={toggleExpanded}>{data[keyProp].isExpanded ? "collapse" : "expand"}</button>
      </div>
    </>
  );
}

export default Entry;
