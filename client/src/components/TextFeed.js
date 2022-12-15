import React from 'react'

function TextFeed({data}) {
  

  const [rows, setRows] = React.useState([]);








    React.useEffect(() => {
        console.log("data2: ", data)
        setRows(() => data)
        console.log("rows: ", rows)
    }, []);

    const makeRows = () => {
        let components = [];
        for (let i = 0; i < rows.length; i++) {
            components.push(<div key={i}>{rows[i][0]} {rows[i][1]} {rows[i][2]} {rows[i][3]}</div>)
        }
        return components;
        }



  return (
    <div>{makeRows()}</div>
  )};

export default TextFeed