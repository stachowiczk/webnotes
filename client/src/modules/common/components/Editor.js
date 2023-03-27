import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../app/index.css";
import { setEditorState } from "../slices/editorSlice";
import { useDispatch, useSelector } from "react-redux";

function EditorComponent() {
  const editorState = useSelector((state) => state.editor.editorState);
  const dispatch = useDispatch();


  const [value, setValue] = useState(editorState);
  const quillRef = React.useRef();

  useEffect(() => {
    dispatch(setEditorState(value));
  }, [value]);

  useEffect(() => {
    setValue(editorState);
  }, [editorState]);


  const modules = {
      toolbar: [
        [{ font: ['Lato', 'Lora', 'Inconsolata', 'Roboto'] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      // TODO: imageResize: {}, // add the image resize module
    };

    const formats = [
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'header',
    'color',
    'background',
    'align',
    'link',
    'image',
    'video',
  ];



  return (
    <>
      <div id="quill" style={{}}>
        <ReactQuill
          className="custom-quill"
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
