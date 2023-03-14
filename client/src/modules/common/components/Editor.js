import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../app/index.css";

function EditorComponent({ value, setValue }) {
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
      <div id="quill" style={{ maxHeight: "60vh" }}>
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
