import React from "react";

function Entry({ title, content, created_at }) {

  console.log(`title: ${title}`);
  console.log(`content: ${content}`); //remove later

  return (
    <>
      <div>
        <div dangerouslySetInnerHTML={{ __html: title }} />
        <div style={{color: 'red'}}dangerouslySetInnerHTML={{ __html: content }} />
        {created_at}
      </div>
    </>
  );
}

export default Entry;
