/**
 * Vendor imports.
 */
import { useState, useEffect, useRef } from "react";
import { ContentState, Editor, EditorState } from "draft-js";
import "./CommentTexteditor.scss";

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
}

export const CommentTexteditor = function CommentTexteditor({
  show = true,
  content,
  onSubmit,
}: Props) {
  if (!show) return null;

  const [editorState, setEditorState] = useState(() => {
    if (!content) return EditorState.createEmpty();

    return EditorState.createWithContent(ContentState.createFromText(content));
  });
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    const div = document.querySelector<HTMLDivElement>(".text-editor .input");

    if (div) {
      const divBottom = div.offsetTop + div.offsetHeight;

      if (divBottom > window.scrollY)
        window.scrollTo(0, divBottom - window.innerHeight / 2);
    }
  }, []);

  return (
    <section className="text-editor container">
      <div className="body">
        <div className="input" onClick={() => editorRef.current?.focus()}>
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            ref={editorRef}
          />
        </div>
        <div className="footer">
          <button
            className="button submit"
            onClick={() => {
              if (onSubmit)
                onSubmit(editorState.getCurrentContent().getPlainText());
            }}
          >
            submit
          </button>
          <button
            className="button cancel"
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
