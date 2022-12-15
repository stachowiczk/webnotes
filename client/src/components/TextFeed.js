import React from 'react'

function TextFeed({data}) {
  

  const [rows, setRows] = React.useState([]);








    React.useEffect(() => {
        console.log("data2: ", data)
        setRows(() => data)
        console.log("rows: ", rows)
    }, []);

    const makeRows = () => {
        const components = rows.map((row) => {
            <>
                <div>{row[1]}</div>
                <div>{row[2]}</div>
            </>
        })

        return components;
        }



  return (
    <div>{makeRows()}</div>
  )};

export default TextFeed