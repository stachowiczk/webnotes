import { useState, useEffect} from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

function EditorComponent({value, setValue}) {

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
      ],
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
    "list",
    "link",
    "image",
    "video",
  ];



  return (
    <>
      <div style={{ maxHeight: "60vh" }}>
        <ReactQuill
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
