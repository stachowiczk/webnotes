
function Entry({ noteId, title, content, created_at }) {
  return (
    <>
      <div>
        <div>{noteId}</div>
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

export default Entry;
