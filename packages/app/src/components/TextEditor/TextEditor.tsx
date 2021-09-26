/**
 * Vendor imports.
 */
import { useState, useEffect, useRef } from "react";
import {
  ContentState,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  RawDraftContentState,
  convertFromHTML,
} from "draft-js";

/**
 * Custom imports.
 */
import { TextEditorControls } from "../TextEditorControls/TextEditorControls";

/**
 * CommentTextbox functional component - https://draftjs.org/
 */
interface Props {
  show?: boolean;
  advanced?: boolean;
  content?: string;
  onSubmit?: (content?: RawDraftContentState) => void;
  styles?: { [key: string]: string };
}

export const TextEditor = function TextEditor({
  styles = {},
  show = true,
  advanced = false,
  content,
  onSubmit,
}: Props) {
  if (!show) return null;

  const editorRef = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() => {
    if (!content) return EditorState.createEmpty();

    return EditorState.createWithContent(
      ContentState.createFromBlockArray(convertFromHTML(content).contentBlocks)
    );
  });

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  useEffect(() => {
    editorRef.current?.focus();
  }, []);

  return (
    <section className={styles.textEditor}>
      <div className={styles.input} onClick={() => editorRef.current?.focus()}>
        {advanced ? (
          <TextEditorControls
            editorState={editorState}
            onToggle={setEditorState}
          />
        ) : null}
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          ref={editorRef}
        />
      </div>
      <div className={styles.footer}>
        <button
          className={styles.submit}
          onClick={() => {
            if (onSubmit)
              onSubmit(convertToRaw(editorState.getCurrentContent()));
          }}
        >
          submit
        </button>
        <button
          onClick={() => {
            if (onSubmit) onSubmit(undefined);
          }}
        >
          cancel
        </button>
      </div>
    </section>
  );
};
