/**
 * Vendor imports.
 */
import { useState, useEffect, useRef, useContext } from "react";
import { ContentState, Editor, EditorState } from "draft-js";
import { AppStateContext } from "../App/app-state/context";
import "./style.scss";

/**
 * Custom imports.
 */

/**
 * CommentTextbox functional component - wrapper for https://draftjs.org/
 */
interface Props {
  show?: boolean;
  content?: string;
  onSubmit?: (content?: string) => void;
  className?: string;
}

export const TextEditor = function TextEditor({
  show = true,
  content,
  onSubmit,
  className,
}: Props) {
  if (!show) return null;

  const editorRef = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() => {
    if (!content) return EditorState.createEmpty();

    return EditorState.createWithContent(ContentState.createFromText(content));
  });

  useEffect(() => {
    editorRef.current?.focus();
  }, []);

  className = className || "text-editor";

  return (
    <section className={className}>
      <div className={`${className}-body`}>
        <div className="input" onClick={() => editorRef.current?.focus()}>
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            ref={editorRef}
          />
        </div>
        <div className="footer">
          <button
            className={"button submit"}
            onClick={() => {
              if (onSubmit)
                onSubmit(editorState.getCurrentContent().getPlainText());
            }}
          >
            submit
          </button>
          <button
            className={"button cancel"}
            onClick={() => {
              if (onSubmit) onSubmit(undefined);
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </section>
  );
};
