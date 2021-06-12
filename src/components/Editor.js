import { Editable, Slate, withReact } from "slate-react";
import { createEditor } from "slate";
import { useCallback, useMemo, useRef } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import { isLinkNodeAtSelection } from "../utils/EditorUtils";

import useEditorConfig from '../hooks/useEditorConfig';
import useSelection from '../hooks/useSelection';

import Toolbar from "./Toolbar";
import LinkEditor from "./LinkEditor"


export default function Editor({ document, onChange }) {
  const editorRef = useRef(null)
  const editor = useMemo(() => withReact(createEditor()), []);
  const { renderElement, renderLeaf, onKeyDown } = useEditorConfig(editor);
  const [previousSelection, selection, setSelection] = useSelection(editor);
  const onChangeHandler = useCallback(
    (document) => {
      onChange(document);
      setSelection(editor.selection);
    },
    [editor.selection, onChange, setSelection]
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
            <Toolbar selection={selection} />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="editor" ref={editorRef}>
              {
                selectionForLink != null ? 
                  <LinkEditor 
                    selectionForLink={selectionForLink}
                    editorOffsets={
                      editorRef.current != null ? 
                        {
                          x: editorRef.current.getBoundingClientRect().x,
                          y: editorRef.current.getBoundingClientRect().y,
                        } :
                        null
                      }
                  /> :
                  null
              }
              <Editable renderElement={renderElement} renderLeaf={renderLeaf} onKeyDown={onKeyDown}/>
            </div>
          </Col>
        </Row>
      </Container>
    </Slate>
  );
}
