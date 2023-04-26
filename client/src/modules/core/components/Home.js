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
  function capitalizeUsername(username) {
    return username.charAt(0).toUpperCase() + username.slice(1);
  }
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
          <h3>{capitalizeUsername(user)}'s Notes</h3>
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
        {/*<div className="navbar-spacer"></div>*/}
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
                  "+"
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
