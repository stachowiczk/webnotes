import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../app/index.css";
import { setEditorState } from "../slices/editorSlice";
import { useDispatch, useSelector } from "react-redux";

function EditorComponent() {
  const editorState = useSelector((state) => state.editor.editorState);
  const dispatch = useDispatch();


  const [value, setValue] = useState(editorState);

  useEffect(() => {
    dispatch(setEditorState(value));
  }, [value]);

  useEffect(() => {
    setValue(editorState);
  }, [editorState]);



  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "code",
    "list",
    "link",
    "image",
    "video",
  ];

  return (
    <>
      <div id="quill" style={{}}>
        <ReactQuill
          style={{ border: "none", outline: "none" }}
          theme="snow"
          modules={modules}
          formats={formats}
          value={value}
          onChange={setValue}
        />
      </div>
    </>
  );
}

export default EditorComponent;
