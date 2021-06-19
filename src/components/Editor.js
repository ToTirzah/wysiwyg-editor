import "./Editor.css";

import React from "react";
import { useCallback, useMemo, useRef } from "react";

import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import LinkEditor from "./LinkEditor";
import useEditorConfig from "../hooks/useEditorConfig";
import useSelection from "../hooks/useSelection";

import { identifyLinksInTextIfAny, isLinkNodeAtSelection } from "../utils/EditorUtils";

import Toolbar from "./Toolbar";


export default function Editor({ document, onChange }) {
  const editorRef = useRef(null);
  const editor = useMemo(() => withReact(createEditor()), []);
  const { renderElement, renderLeaf, KeyBindings } = useEditorConfig(editor);

  const onKeyDown = useCallback(
    (event) => KeyBindings.onKeyDown(editor, event),
    [KeyBindings, editor]
  );

  const [previousSelection, selection, setSelection] = useSelection(editor);

  // we update selection here because Slate fires an onChange even on pure selection change.
  const onChangeHandler = useCallback(
    (document) => {
      onChange(document);
      setSelection(editor.selection);
      identifyLinksInTextIfAny(editor);
    },
    [editor, onChange, setSelection]
  );

  let selectionForLink = null;
  if (isLinkNodeAtSelection(editor, selection)) {
    selectionForLink = selection;
  } else if (selection == null && isLinkNodeAtSelection(editor, previousSelection)) {
    selectionForLink = previousSelection;
  }

  return (
    <Slate editor={editor} value={document} onChange={onChangeHandler}>
      <Container className={"editor-container"}>
        <Row>
          <Col>
            <Toolbar
              selection={selection}
              previousSelection={previousSelection}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="editor" ref={editorRef}>
              {selectionForLink != null ? (
                <LinkEditor
                  editorOffsets={
                    editorRef.current != null ?
                      {
                        x: editorRef.current.getBoundingClientRect().x,
                        y: editorRef.current.getBoundingClientRect().y,
                      } : null
                  }
                  selectionForLink={selectionForLink}
                />
              ) : null}
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={onKeyDown}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </Slate>
  );
}
