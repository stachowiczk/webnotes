import { useState, useRef, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import Draggable from "react-draggable";
import EditorComponent from "../../common/components/Editor.js";
import http from "../../auth/components/Interceptor";
import TextFeed from "../../common/components/TextFeed.js";
import Menu from "../../auth/components/Menu.js";
import { setReload } from "../../common/slices/feedSlice.js";
import {
  setEditedNoteId,
  setEditingExisting,
  setEditorState,
} from "../../common/slices/editorSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../../auth/context/UserContext.js";
import { toggleTheme, loadTheme } from "../../common/slices/themeSlice.js";

const LOCAL_STORAGE_WIDTH_KEY = "WIDTH";

function Home() {
  const [error, setError] = useState(null);
  const [reloadFeed, setReloadFeed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [dropdown, setDropdown] = useState(false);
  const [leftWidth, setLeftWidth] = useState(window.innerWidth / 4);
  const dropdownRef = useRef(null);
  const editorState = useSelector((state) => state.editor.editorState);
  const editingExisting = useSelector((state) => state.editor.editingExisting);
  const editedNoteId = useSelector((state) => state.editor.editedNoteId);
  const dispatch = useDispatch();
  const { state, dispatch: authDispatch } = useContext(AuthContext);
  const { user } = state;
  const currentTheme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    try {
      const storedWidth = localStorage.getItem(LOCAL_STORAGE_WIDTH_KEY);
      if (storedWidth) {
        setLeftWidth(parseInt(storedWidth));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  function handleResize(e, { deltaX }) {
    const newWidth = leftWidth + deltaX;
    setLeftWidth(newWidth);
    localStorage.setItem(LOCAL_STORAGE_WIDTH_KEY, newWidth);
  }
  function toggleDropdown(dropdown) {
    setDropdown(dropdown);
  }

  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdown(false);
    }
  }

  useEffect(() => {
    document.addEventListener("mouseover", handleClickOutside);
    return () => {
      document.removeEventListener("mouseover", handleClickOutside);
    };
  });

  async function addUserPost() {
    try {
      await http.post(
        "http://localhost:5000/notes/",
        JSON.stringify({
          title: editorState,
          content: editorState,
        })
      );
      dispatch(setEditorState(""));
      setReloadFeed(!reloadFeed);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  }

  function resetEditorDispatch() {
    dispatch(setEditorState(""));
    dispatch(setEditingExisting(false));
    dispatch(setEditedNoteId(null));
  }

  async function editUserPost() {
    try {
      await http.put(
        `http://localhost:5000/notes/${editedNoteId}`,
        JSON.stringify({
          title: editorState,
          content: editorState,
        })
      );
      resetEditorDispatch();

      dispatch(setReload());
    } catch (err) {
      console.error(err);
      setError(err);
    }
  }

  async function deleteAllPosts() {
    if (window.confirm("Are you sure you want to delete all posts?")) {
      try {
        setIsLoaded(false);
        await http.delete("http://localhost:5000/notes/");
        setReloadFeed(!reloadFeed);
        setIsLoaded(true);
      } catch (err) {
        setIsLoaded(true);
        setError(err);
      }
    }
  }

  if (error && error.response.status === 401) {
    return (
      <>
        <div className="editor">
          <h1>Please log in to continue</h1>
          <p></p>
          <Navigate to="/login" />
        </div>
      </>
    );
  } else {
    return (
      <div className={`root-element ${currentTheme}`}>
        <div className="navbar">
          <h3>{user}'s WebNotes</h3>
          <div className="logout">
            <button
              className="user-button"
              onClick={dropdown ? toggleDropdown : toggleDropdown}
              style={{ color: "#ffffff" }}
            >
              Logout
            </button>
            <div ref={dropdownRef}>{dropdown && <Menu />}</div>
          </div>
        </div>
        <div id="main-container">
          <div
            className="item-list"
            id="item-list"
            style={{ width: `${leftWidth}px` }}
          >
            {isLoaded ? (
              <TextFeed className="item-list" reload={reloadFeed} />
            ) : (
              <div>Loading...</div>
            )}
          </div>
          <Draggable
            axis="x"
            onDrag={handleResize}
            positionOffset={
              { x: "none", y: 0 } //dont touch
            }
          >
            <div id="divider" />
          </Draggable>

          <div id="container-homejs" className={`editor ${currentTheme}`}>
            <div className="editor">
              <EditorComponent />
            </div>
            <div className="submit-button-container">
              <button
                className="submit-button"
                onClick={editingExisting ? editUserPost : addUserPost}
                style={{}}
              >
                &nbsp;Save&nbsp;&nbsp;
              </button>
              <button className="submit-button" onClick={resetEditorDispatch}>
                Cancel
              </button>
              <button
                className="submit-button"
                onClick={deleteAllPosts}
                style={{ display: "none" }}
              >
                Delete all
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
