import React from 'react';
import DOMPurify from 'dompurify';
import Entry from './Entry';

function TextFeed({data, dataHasChanged}) {
  
  const [rows, setRows] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [updateData, setUpdateData] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    refresh(); 
    setIsLoaded(() => true);
  }, [dataHasChanged]);

  React.useEffect(() => {
      console.log("data.first.feed: ", data)
      setRows(data)
      console.log("rows.second.feed: ", rows)
      makeRows();
  }, []);

  React.useEffect(() => {
      console.log("data.second.feed: ", data)
      setRows(data)
      console.log("rows.third.feed: ", rows)
      makeRows();
  }, [data]);


  const refresh = () => {
      console.log("data.third.feed: ", data)
      setRows(data)
      console.log("rows.fourth.feed: ", rows)
  }
  //TODO: make this a component
  const makeRows = () => {
    const sanitizedRows = rows.map((row) => DOMPurify.sanitize(row.title));
    return rows.map((row, index) => (
      <Entry key={index} created_at={row.created_at} title={sanitizedRows[index]} />
    ))
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  else if (rows.length === 0) {
    return <div>No data</div>;
  }
  else {
    return (
      <>
        <div>
          {makeRows()}
        </div>
      </>
    )

  }
}  

export default TextFeed