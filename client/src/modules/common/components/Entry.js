import { useSelector, useDispatch } from "react-redux";
import http from "../../auth/components/Interceptor";
import { removeEntry, setExpanded, setReload } from "../slices/feedSlice";
import { useEffect, useState } from "react";
import { setEditorState, setEditingExisting, setEditedNoteId } from "../slices/editorSlice";
import { toggleShowEditor } from "../slices/themeSlice";

import styles from "./Entry.module.css";

function Entry({ keyProp, noteId, title, content, created_at, removeMe }) {
  const data = useSelector((state) => state.feed.entries);
  const theme = useSelector((state) => state.theme.theme);
  const editorState = useSelector((state) => state.editor.editorState);
  const showEditor = useSelector((state) => state.theme.showEditor);
  const isMobile = useSelector((state) => state.theme.isMobile);
  const isEditingExisting = useSelector(
    (state) => state.editor.isEditingExisting
  );

  const dispatch = useDispatch();

  try {
    created_at = created_at.slice(0, 17); // only show date
  } catch {
    created_at = "no data";
  }

  async function deleteNoteById() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await http.delete(`http://localhost:5000/notes/${noteId}`);
        dispatch(removeEntry(noteId));
        dispatch(setReload());
      } catch (err) {
        console.log(err);
      }
    }
  }

  function toggleExpanded() {
    dispatch(setExpanded(keyProp));
  }

  function editNote() { 
    dispatch(setEditingExisting(true));
    dispatch(setEditedNoteId(noteId));
    dispatch(setEditorState(content));
    if (isMobile) {
      dispatch(toggleShowEditor());
      
    }

  }

  const titleClassName = data[keyProp].isExpanded
    ? `${styles['entry-title']} ${styles.expanded}`
    : `${styles['entry-title']} ${styles.collapsed}`;

  const contentClassName = data[keyProp].isExpanded
    ? `${styles['entry-content']} ${styles.expanded}`
    : `${styles['entry-content']} ${styles.collapsed}`;


  return (
    <>
      <div className={`entry-main ${theme}`}>
        <div>
          <button type="button" className="x-button" onClick={deleteNoteById}>
            {""}x{""}
          </button>
        </div>
        <div className={titleClassName}
          
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div className={contentClassName}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <span
          style={{ fontStyle: "italic", fontSize: "small" }}
        >{`${created_at}`}</span>
        <button className="expand-button expand-item" onClick={toggleExpanded}>
          {data[keyProp].isExpanded ? "collapse" : "expand"}
        </button>
        <button className="expand-button expand-item" onClick={editNote}>edit</button>
      </div>
    </>
  );
}

export default Entry;
