import { useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentEditorState } from "../slices/editorSlice";
import ReactQuill, { Quill } from "react-quill";
import { Editor, EditorState, RichUtils } from "draft-js";
import "react-quill/dist/quill.snow.css";

function EditorComponent() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const dispatch = useDispatch();
  const currentEditorState = useSelector(
    (state) => state.editor.currentEditorStateString
  );

  useEffect(() => {
    dispatch(setCurrentEditorState(editorState));
  }, [editorState]);


  return (
    <>
      <div style={{ maxHeight: "60vh" }}>
        <Editor editorState={editorState} onChange={setEditorState} />
      </div>
    </>
  );
}

export default EditorComponent;
