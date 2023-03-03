
import { useState, useEffect } from "react";
import http from "../../app/components/Interceptor";

function Entry({ noteId, title, content, created_at}) {
  const [reload, setReload] = useState(false);

  async function deleteNoteById () {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await http.delete(`http://localhost:5000/notes/${noteId}`)
      setReload(!reload)
    }
  }


  
  if (reload) {
    return;
  } else {
  return (
    <>
      <div>
        <div>{noteId}
        <button onClick={deleteNoteById}> x </button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: title }} />
        <div
          style={{ color: "red" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {created_at}
      </div>
    </>
  );
}
}

export default Entry;
