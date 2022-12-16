import React from 'react'

function TextFeed({data}) {
  
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
      console.log("data.first.feed: ", data)
      setRows(data)
      console.log("rows.second.feed: ", rows)
  }, []);

  const makeRows = () => {
      let components = [];
      for (let i = 0; i < rows.length; i++) {
          components.push(<div key={i}>{rows[i].title} {rows[i].created_at}</div>)
      }
      return components;
      }

  return (
    <div>{makeRows()}</div>
  )};

export default TextFeed