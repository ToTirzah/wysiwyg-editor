import "./App.css";

import React, { useState } from "react";

import Navbar from "react-bootstrap/Navbar";

import ExampleDocument from "./utils/ExampleDocument";

import Editor from "./components/Editor";



function App() {
  const [document, updateDocument] = useState(ExampleDocument);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#">
          <img
            alt=""
            src="/app-icon.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          WYSIWYG Editor
        </Navbar.Brand>
      </Navbar>
      <div className="App">
        <Editor document={document} onChange={updateDocument} />
      </div>
    </>
  );
}

export default App;
