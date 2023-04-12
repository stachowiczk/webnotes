import { useSelector, useDispatch } from "react-redux";
import http from "../../auth/components/Interceptor";
import SharePopup from "./SharePopup";
import {
  removeSharedNote,
  setExpanded,
  setReload,
  setIsEdited,
} from "../slices/sharedSlice";
import { useEffect, useState } from "react";
import {
  setEditorState,
  setEditingExisting,
  setEditedNoteId,
} from "../slices/editorSlice";
import {
  toggleShowEditor,
  setLeftWidth,
  setIsMobile,
} from "../slices/themeSlice";

import styles from "./Entry.module.css";


function Entry({ keyProp, noteId, title, content, created_at, removeMe }) {
  const data = useSelector((state) => state.shared.sharedNotes);
  const theme = useSelector((state) => state.theme.theme);
  const editorState = useSelector((state) => state.editor.editorState);
  const showEditor = useSelector((state) => state.theme.showEditor);
  const editedNoteId = useSelector((state) => state.editor.editedNoteId);
  const [showPopup, setShowPopup] = useState(false);
  const isMobile = useSelector((state) => state.theme.mobile);
  const isEditingExisting = useSelector(
    (state) => state.editor.editingExisting
  );
  const isEdited = useSelector((state) => state.shared.isEdited);
  const [targetUser, setTargetUser] = useState("");

  const dispatch = useDispatch();

  try {
    created_at = created_at.slice(0, 17); // only show date
  } catch {
    created_at = "no data";
  }

  async function deleteNoteById() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await http.delete(`http://localhost:5000/notes/share/${noteId}`);
        dispatch(removeSharedNote(noteId));
        dispatch(setReload());
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function shareNoteById() {
    try {
      await http.post(
        `http://localhost:5000/notes/share/${noteId}`,
        JSON.stringify({
          target_user: targetUser,
          can_edit: false,
        })
      );
      dispatch(setReload());
    } catch (err) {
      console.log(err);
    }
  }

  function toggleExpanded() {
    dispatch(setExpanded(keyProp));
  }

  function togglePopup() {
    setShowPopup(!showPopup);
  }

  function editNote() {
    dispatch(setEditingExisting(true));
    dispatch(setEditedNoteId(noteId));
    dispatch(setEditorState(content));
    dispatch(setIsEdited(keyProp));
    if (isMobile) {
      dispatch(toggleShowEditor());
      dispatch(setLeftWidth(0));
    }
  }

  const titleClassName = data[keyProp].isExpanded
    ? `${styles["entry-title"]} ${styles.expanded}`
    : `${styles["entry-title"]} ${styles.collapsed}`;

  const contentClassName = data[keyProp].isExpanded
    ? `${styles["entry-content"]} ${styles.expanded}`
    : `${styles["entry-content"]} ${styles.collapsed}`;

  return (
    <>
      <div
        id={keyProp}
        className={`entry-main ${theme}`}
        onClick={data[keyProp].isExpanded ? null : toggleExpanded}
        style={{
          cursor: data[keyProp].isExpanded ? "default" : "pointer",
          boxShadow:
            data[keyProp].isEdited && isEditingExisting ? "0 0 0.5em #06c" : {},
        }}
      >
        <div>
          <button type="button" className="x-button" onClick={deleteNoteById}>
            {""}x{""}
          </button>
        </div>
        <div
          className={titleClassName}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div
          className={contentClassName}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <span
          style={{ fontStyle: "italic", fontSize: "small" }}
        >{`${created_at}`}</span>
        <button
          className="expand-button expand-item"
          onClick={toggleExpanded}
          style={data[keyProp].isExpanded ? {} : { display: "none" }}
        >
          {data[keyProp].isExpanded ? "collapse" : ""}
        </button>
        <button
          className="expand-button expand-item"
          onClick={editNote}
          style={isEditingExisting ? { display: "none" } : {}}
        >
          edit
        </button>
        <button
          className="expand-button expand-item"
          onClick={togglePopup}
          style={isEditingExisting ? { display: "none" } : {}}
        >
          share
        </button>
        {showPopup ? (
          <SharePopup show={showPopup} close={togglePopup} noteId={noteId}/>
        ) : null}
      </div>
    </>
  );
}

export default Entry;
