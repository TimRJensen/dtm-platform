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
} from "draft-js";

/**
 * Custom imports.
 */

/**
 * CommentTextbox functional component - https://draftjs.org/
 */
interface Props {
  show?: boolean;
  content?: string;
  onSubmit?: (content?: string) => void;
  styles?: { [key: string]: string };
}

export const TextEditor = function TextEditor({
  styles = {},
  show = true,
  content,
  onSubmit,
}: Props) {
  if (!show) return null;

  const editorRef = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() => {
    if (!content) return EditorState.createEmpty();

    return EditorState.createWithContent(ContentState.createFromText(content));
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
            console.log(convertToRaw(editorState.getCurrentContent()));
            if (onSubmit)
              onSubmit(editorState.getCurrentContent().getPlainText());
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
