import React from 'react'

function Entry({title, created_at}) {
  return (
    <>
    <div>
        <div dangerouslySetInnerHTML={{__html: title}}/>
        {created_at}

    </div>
    </>
  )
}

export default Entry
