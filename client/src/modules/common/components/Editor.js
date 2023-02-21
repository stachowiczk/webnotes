import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Editor({ value, setValue }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ align: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };
  const formats = [
    "header",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "align",
    "list",
    "bullet",
    "indent",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  const placeholder = "Write something...";

  const handleChange = (value) => {
    setValue(value);
  };

  return (
    <>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </>
  );
}

export default Editor;
