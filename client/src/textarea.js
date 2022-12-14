import React from 'react';

//add a button to add a section sign


function TextEditor() {
  // State to keep track of the selected text and its formatting
  const [selectedText, setSelectedText] = React.useState('');
  const [formatting, setFormatting] = React.useState({
    italic: false,
    bold: false,
    underline: false,
    strikethrough: false,
    subscript: false,
    superscript: false,
    fontSize: 14,
  });
  const [highlightedText, setHighlightedText] = React.useState([
    {
        text: '',
        formatting: {
            italic: false,
            bold: false,
            underline: false,
            strikethrough: false,
            subscript: false,
            superscript: false,
            fontSize: 14,
        }
    }
    ]);


  // Function to handle changes to the selected text
  const handleChange = (event) => {
    setSelectedText(event.target.value);
  };

  // Function to handle changes to the text formatting
  const handleFormattingChange = (event) => {
    const { name, checked } = event.target;
    setFormatting((prevFormatting) => ({
      ...prevFormatting,
      [name]: checked,
    }));
  };

  // Function to handle changes to the font size
  const handleFontSizeChange = (event) => {
    const fontSize = parseInt(event.target.value, 10);
    setFormatting((prevFormatting) => ({
      ...prevFormatting,
      fontSize,
    }));
  };

  // Function to handle submitting the text
  const handleSubmit = () => {
    // Save the selected text and its formatting to JSON
    const text = {
      selectedText,
      formatting,
    };
    const json = JSON.stringify(text);
    console.log(json);

    // TODO: Save the JSON to a database or file
  };
  const applyFormattingStyles = (text) => {
    let formattedText = text;

    if (formatting.italic) {
      formattedText = <em>{formattedText}</em>;
    }

    if (formatting.bold) {
      formattedText = <strong>{formattedText}</strong>;
    }

    if (formatting.underline) {
      formattedText = <u>{formattedText}</u>;
    }

    if (formatting.strikethrough) {
      formattedText = <strike>{formattedText}</strike>;
    }

    if (formatting.subscript) {
      formattedText = <sub>{formattedText}</sub>;
    }

    if (formatting.superscript) {
      formattedText = <sup>{formattedText}</sup>;
    }

    return formattedText;
  };

  return (
    <div>
      <h1>Text Editor</h1>

      {/* Input field for the selected text */}
      <textarea onChange={handleChange} value={selectedText} onSelect={handleSelect}/>

      {/* Buttons for formatting options */}
      <div>
        <label>
          <input
            type="checkbox"
            name="italic"
            checked={formatting.italic}
            onChange={handleFormattingChange}
          />
          Italic
        </label>

        <label>
          <input
            type="checkbox"
            name="bold"
            checked={formatting.bold}
            onChange={handleFormattingChange}
          />
          Bold
        </label>

        <label>
          <input
            type="checkbox"
            name="underline"
            checked={formatting.underline}
            onChange={handleFormattingChange}
          />
          Underline
        </label>

        <label>
          <input
            type="checkbox"
            name="strikethrough"
            checked={formatting.strikethrough}
            onChange={handleFormattingChange}
          />
          Strikethrough
        </label>

        <label>
          <input
            type="checkbox"
            name="subscript"
            checked={formatting.subscript}
            onChange={handleFormattingChange}
          />
          Subscript
        </label>

        <label>
          <input
            type="checkbox"
            name="superscript"
            checked={formatting.superscript}
            onChange={handleFormattingChange}
          />
          Superscript
        </label>
      </div>
  
      {/* Input field for the font size */}
      <label>
        Font size:
        <input
          type="number"
          value={formatting.fontSize}
          onChange={handleFontSizeChange}
        />
      </label>
  
      {/* Button to submit the text and its formatting */}
      <button onClick={handleSubmit}>Submit</button>
      <div style={{ fontSize: formatting.fontSize }}>
        {applyFormattingStyles(selectedText)}</div>
    </div>
    );
  }

  export default TextEditor;
  