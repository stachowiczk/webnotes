import React from "react";
import DOMPurify from "dompurify";
import Entry from "./Entry";

function TextFeed({ data, dataHasChanged }) {
  const [rows, setRows] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [updateData, setUpdateData] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    refresh();
    setIsLoaded(() => true);
  }, [dataHasChanged]);

  React.useEffect(() => {
    setRows(data);
    makeRows();
  }, []);

  //React.useEffect(() => {
  //  setRows(data);
  //  makeRows();
  //}, [data]);

  const refresh = () => {
    setRows(data);
  };
  //TODO: make this a component
  const makeRows = () => {
    try {
      return rows.map((row, index) => (
        <Entry
          key={index}
          created_at={row.created_at}
          title={DOMPurify.sanitize(row.title)} // IMPORTANT
        />
      ));
    } catch (error) {
      console.log(error);
      return <div className="editor">No data</div>;
    }
    // return rows.map((row, index) => (
    //   <Entry key={index} created_at={row.created_at} title={DOMPurify.sanitize(row.title)} />
    // ));
  };

  if (!isLoaded) {
    return <div className="editor">Loading...</div>;
  } else if (!rows) {
    return <div className="editor">No data</div>;
  } else {
    return (
      <>
        <div className="editor">{makeRows()}</div>
      </>
    );
  }
}

export default TextFeed;
