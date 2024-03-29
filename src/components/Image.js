import "./Image.css";

import React, { useCallback, useState } from "react";

import { Editor, Transforms } from "slate";
import { useFocused, useSelected, useSlateStatic } from "slate-react";

import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";

import classNames from "classnames";
import isHotkey from "is-hotkey";


export default function Image({ attributes, children, element }) {
  const [isEditingCaption, setEditingCaption] = useState(false);
  const [caption, setCaption] = useState(element.caption);
  const editor = useSlateStatic();

  const selected = useSelected();
  const focused = useFocused();

  const applyCaptionChange = useCallback(
    (captionInput) => {
      const imageNodeEntry = Editor.above(editor, {
        match: (n) => n.type === "image",
      });
      if (imageNodeEntry == null) {
        return;
      }

      if (captionInput != null) {
        setCaption(captionInput);
      }

      Transforms.setNodes(
        editor,
        { caption: captionInput },
        { at: imageNodeEntry[1] }
      );
    },
    [editor, setCaption]
  );

  const onCaptionChange = useCallback(
    (event) => {
      setCaption(event.target.value);
    },
    [setCaption]
  );

  const onKeyDown = useCallback(
    (event) => {
      if (!isHotkey("enter", event)) {
        return;
      }
      event.preventDefault();

      applyCaptionChange(event.target.value);
      setEditingCaption(false);
    },
    [applyCaptionChange, setEditingCaption]
  );

  const onToggleCaptionEditMode = useCallback(
    (event) => {
      const wasEditing = isEditingCaption;
      setEditingCaption(!isEditingCaption);
      wasEditing && applyCaptionChange(caption);
    },
    [isEditingCaption, applyCaptionChange, caption]
  );

  return (
    <div contentEditable={false} {...attributes}>
      <div
        className={classNames({
          "image-container": true,
          "is-selected": selected && focused,
        })}
      >
        {!element.isUploading && element.url != null ? (
          <img src={String(element.url)} alt={caption} className={"image"} />
        ) : (
          <div className={"image-upload-placeholder"}>
            <Spinner animation="border" variant="dark" />
          </div>
        )}
        {isEditingCaption ? (
          <Form.Control
            autoFocus={true}
            className={"image-caption-input"}
            size="sm"
            type="text"
            defaultValue={caption}
            onKeyDown={onKeyDown}
            onChange={onCaptionChange}
            onBlur={onToggleCaptionEditMode}
          />
        ) : (
          <div
            className={"image-caption-read-mode"}
            onClick={onToggleCaptionEditMode}
          >
            {element.caption}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
