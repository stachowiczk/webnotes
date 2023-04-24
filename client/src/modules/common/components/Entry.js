import { useSelector, useDispatch } from "react-redux";
import * as cfg from "../../../config.js";
import http from "../../auth/components/Interceptor";
import SharePopup from "./SharePopup";
import ConfirmDelete from "./ConfirmDelete.js";
import {
  removeEntry,
  setExpanded,
  setReload,
  setIsEdited,
} from "../slices/feedSlice";
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

function Entry({
  keyProp,
  noteId,
  title,
  content,
  created_at,
  removeMe,
  setReloadLocal,
}) {
  const data = useSelector((state) => state.feed.entries);
  const theme = useSelector((state) => state.theme.theme);
  const editorState = useSelector((state) => state.editor.editorState);
  const showEditor = useSelector((state) => state.theme.showEditor);
  const editedNoteId = useSelector((state) => state.editor.editedNoteId);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const isMobile = useSelector((state) => state.theme.mobile);
  const isEditingExisting = useSelector(
    (state) => state.editor.editingExisting
  );
  const isEdited = useSelector((state) => state.feed.isEdited);
  const [targetUser, setTargetUser] = useState("");

  const dispatch = useDispatch();

  try {
    created_at = created_at.slice(0, 17); // only show date
  } catch {
    created_at = "no data";
  }
  function handleDelete(e) {
    e.stopPropagation();
    setShowDeletePopup(true);
  }
  async function deleteNoteById(e) {
    try {
      await http.delete(`${cfg.API_BASE_URL}${cfg.NOTES_ID_ENDPOINT}${noteId}`);
      dispatch(removeEntry(noteId));
      dispatch(setReload());
    } catch (err) {
      console.log(err);
    }
    setShowDeletePopup(false);
  }

  function handleCancelDelete(e) {
    e.stopPropagation();
    setShowDeletePopup(false);
  }

  async function shareNoteById() {
    try {
      await http.post(
        `${cfg.API_BASE_URL}${cfg.NOTES_SHARE_ID_ENDPOINT}${noteId}`,
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

  function togglePopup(e) {
    setShowPopup(!showPopup);
  }

  function editNote(e) {
    e.stopPropagation();
    dispatch(setEditingExisting(true));
    dispatch(setEditedNoteId(noteId));
    dispatch(setEditorState(content));
    dispatch(setIsEdited(keyProp));
    if (isMobile) {
      dispatch(toggleShowEditor());
      dispatch(setLeftWidth(0));
    }
  }

  function cancelEdit(e) {
    e.stopPropagation();
    setReloadLocal();
    dispatch(setEditingExisting(false));
    dispatch(setIsEdited(keyProp));
    dispatch(setEditorState(""));
    dispatch(setEditedNoteId(""));
  }

  const titleClassName = data[keyProp].isExpanded
    ? `${styles["entry-title"]} ${styles.expanded}`
    : `${styles["entry-title"]} ${styles.collapsed}`;

  const contentClassName = data[keyProp].isExpanded
    ? `${styles["entry-content"]} ${styles.expanded}`
    : `${styles["entry-content"]} ${styles.collapsed}`;

  return (
    <>
      <div>
        {isEditingExisting && (
          <div className="notes-overlay" onClick={cancelEdit} />
        )}
        <div
          id={keyProp}
          className={`entry-main ${theme}`}
          onClick={data[keyProp].isExpanded ? null : toggleExpanded}
          style={{
            cursor: data[keyProp].isExpanded ? "default" : "pointer",
            zIndex: data[keyProp].isEdited ? "4" : "",
          }}
        >
          <div>
            <button type="button" className="x-button" onClick={handleDelete}>
              {""}x{""}
            </button>
            {showDeletePopup && (
              <ConfirmDelete
                message={"Are you sure you want to delete this note?"}
                onCancel={handleCancelDelete}
                onConfirm={deleteNoteById}
                isOpen={showDeletePopup}
              />
            )}
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
          <button
            className="expand-button expand-item"
            onClick={toggleExpanded}
            style={data[keyProp].isExpanded ? {} : { display: "none" }}
          >
            {data[keyProp].isExpanded ? "collapse" : ""}
          </button>
          {showPopup ? (
            <SharePopup show={showPopup} close={togglePopup} noteId={noteId} />
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Entry;
