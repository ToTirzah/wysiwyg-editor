import { Editable, Slate, withReact } from "slate-react";

import { createEditor } from "slate";
import { useMemo } from "react";
import useEditorConfig from '../hooks/useEditorConfig';
import useSelection from '../hooks/useSelection';
import { useCallback } from "react";
import Toolbar from "./Toolbar";

export default function Editor({ document, onChange }) {
  const editor = useMemo(() => withReact(createEditor()), []);
  const { renderElement, renderLeaf, onKeyDown } = useEditorConfig(editor);
  const [selection, setSelection] = useSelection(editor);
  const onChangeHandler = useCallback(
    (document) => {
      onChange(document);
      setSelection(editor.selection);
    },
    [editor.selection, onChange, setSelection]
  );

  return (
    <Slate editor={editor} value={document} onChange={onChangeHandler}>
      <Toolbar selection={selection} />
      <Editable renderElement={renderElement} renderLeaf={renderLeaf} onKeyDown={onKeyDown}/>
    </Slate>
  );
}
