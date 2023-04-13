import { useState, useRef, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import Draggable from "react-draggable";
import * as cfg from "../../../config.js";
import EditorComponent from "../../common/components/Editor.js";
import http from "../../auth/components/Interceptor";
import TextFeed from "../../common/components/TextFeed.js";
import SharedFeed from "../../common/components/SharedFeed.js";
import Menu from "../../auth/components/Menu.js";
import { setReload } from "../../common/slices/feedSlice.js";
import {
  setEditedNoteId,
  setEditingExisting,
  setEditorState,
} from "../../common/slices/editorSlice.js";
import { setIsEdited } from "../../common/slices/feedSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../../auth/context/UserContext.js";
import {
  toggleTheme,
  toggleShowEditor,
  setLeftWidth,
  setIsMobile,
} from "../../common/slices/themeSlice.js";

function Home() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [reloadFeed, setReloadFeed] = useState(false);
  const [sharedView, setSharedView] = useState(false);
  const innerWidth = useRef(window.innerWidth);

  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { state, dispatch: authDispatch } = useContext(AuthContext);
  const { user } = state;

  //const [leftWidth, setLeftWidth] = useState(); //move to redux
  const leftWidth = useSelector((state) => state.theme.leftWidth);
  const editorState = useSelector((state) => state.editor.editorState);
  const editingExisting = useSelector((state) => state.editor.editingExisting);
  const editedNoteId = useSelector((state) => state.editor.editedNoteId);
  const currentTheme = useSelector((state) => state.theme.theme);
  const isMobile = useSelector((state) => state.theme.mobile);
  const showEditor = useSelector((state) => state.theme.showEditor);

  const dispatch = useDispatch();
  const themeDispatch = useDispatch();

  useEffect(() => {
    try {
      const storedWidth = localStorage.getItem(cfg.LOCAL_STORAGE_WIDTH_KEY);
      if (storedWidth && !isMobile) {
        dispatch(setLeftWidth(parseInt(storedWidth)));
      } else if (isMobile) {
        dispatch(setLeftWidth(window.innerWidth));
      }
    } catch (err) {
      console.error(err);
    }
    try {
      document.title = `${user}'s WebNotes`;
    } catch {}
  }, []);

  useEffect(() => {
    dispatch(setIsMobile());
  }, [innerWidth.current]);

  useEffect(() => {
    if (innerWidth.current !== window.innerWidth) {
      innerWidth.current = window.innerWidth;
      dispatch(setIsMobile());
    }
  }, [window.innerWidth]);

  useEffect(() => {
    if (editingExisting) {
      dispatch(setEditorState(editorState));
    }
  }, [editingExisting]);

  function handleResize(e, { deltaX }) {
    const newWidth = leftWidth + deltaX;
    dispatch(setLeftWidth(newWidth));
    localStorage.setItem(cfg.LOCAL_STORAGE_WIDTH_KEY, newWidth);
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
        `${cfg.API_BASE_URL}${cfg.NOTES_ENDPOINT}`,
        JSON.stringify({
          title: editorState,
          content: editorState,
        })
      );
      dispatch(setEditorState(""));
      // setReloadFeed(!reloadFeed);
      handleSaveCancelClick();
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

  function handleWindowResize() {
    if (leftWidth === window.innerWidth) {
      try {
        dispatch(
          setLeftWidth(localStorage.getItem(cfg.LOCAL_STORAGE_WIDTH_KEY))
        );
      } catch (err) {
        dispatch(setLeftWidth(window.innerWidth / 4));
      }
    }
  }

  function handleSaveCancelClick() {
    setReloadFeed(!reloadFeed);
    resetEditorDispatch();
    if (!showEditor && isMobile) {
      dispatch(setLeftWidth(window.innerWidth));
    } else if (showEditor && isMobile) {
      dispatch(setLeftWidth(0));
    }
    if (isMobile) themeDispatch(toggleShowEditor());
  }

  async function editUserPost() {
    try {
      await http.put(
        `${cfg.API_BASE_URL}${cfg.NOTES_ID_ENDPOINT}${editedNoteId}`,
        JSON.stringify({
          title: editorState,
          content: editorState,
        })
      );
      handleSaveCancelClick();
      resetEditorDispatch();

      dispatch(setReload());
    } catch (err) {
      if (err.response.status === 400) {
        addUserPost();
      }
      console.error(err);
      setError(err);
    }
  }
  // ##############################
  // delete this
  async function deleteAllPosts() {
    if (window.confirm("Are you sure you want to delete all posts?")) {
      try {
        setIsLoaded(false);
        await http.delete("http://localhost:5000/notes/all");
        setReloadFeed(!reloadFeed);
        setIsLoaded(true);
      } catch (err) {
        setIsLoaded(true);
        setError(err);
      }
    }
  }

  function handleThemeChange() {
    themeDispatch(toggleTheme());
  }

  function handleSharedViewClick() {
    setSharedView(!sharedView);
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
          <h3>{user}'s Notes</h3>
          <button className="theme-button" onClick={handleThemeChange}>
            {currentTheme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <div className="logout">
            <button
              className="user-button"
              onClick={dropdown ? toggleDropdown : toggleDropdown}
              style={{}}
            >
              Logout
            </button>
            <div ref={dropdownRef}>{dropdown && <Menu />}</div>
          </div>
        </div>
        <div className="navbar-spacer"></div>
        <div id="main-container">
          <div
            className="item-list"
            id="item-list"
            style={{ width: `${leftWidth}px` }}
          >
            <div className="expand-button-container">
              <button
                className="mobile-view-button expand-button"
                style={!isMobile ? { display: "none" } : {}}
                onClick={handleSaveCancelClick}
              >
                {" "}
                {showEditor ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="#06c"
                      d="M 11 3 C 10.447 3 10 3.447 10 4 L 10 10 L 4 10 C 3.447 10 3 10.447 3 11 C 3 11.553 3.447 12 4 12 L 10 12 L 10 18 C 10 18.553 10.447 19 11 19 C 11.553 19 12 18.553 12 18 L 12 12 L 18 12 C 18.553 12 19 11.553 19 11 C 19 10.447 18.553 10 18 10 L 12 10 L 12 4 C 12 3.447 11.553 3 11 3 Z"
                    />
                  </svg>
                ) : (
                  "Close editor"
                )}
              </button>
            </div>
            <button className="expand-button" onClick={handleSharedViewClick}>
              {sharedView ? "Personal" : "Shared"}
            </button>
            {!sharedView ? (
              <TextFeed
                className="item-list"
                reload={reloadFeed}
                setReloadLocal={handleSaveCancelClick}
              />
            ) : (
              <SharedFeed
                className="item-list"
                reload={reloadFeed}
                setReloadLocal={handleSaveCancelClick}
              />
            )}
          </div>
          <Draggable
            axis="x"
            onDrag={handleResize}
            positionOffset={
              { x: "none", y: 0 } //dont touch
            }
          >
            <div id="divider" style={isMobile ? { display: "none" } : {}} />
          </Draggable>

          <div id="container-homejs" className={`editor ${currentTheme}`}>
            <div className="submit-button-container">
              <button
                className="submit-button"
                onClick={editingExisting ? editUserPost : addUserPost}
                style={{}}
              >
                &nbsp;Save&nbsp;&nbsp;
              </button>
              <button
                className="submit-button cancel-button desktop"
                onClick={handleSaveCancelClick}
              >
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
            <div className="editor">
              <EditorComponent />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
