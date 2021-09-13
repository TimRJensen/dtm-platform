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
    else
      return EditorState.createWithContent(
        ContentState.createFromText(content)
      );
  });
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    //editorRef.current?.focus();

    const div = document.querySelector<HTMLDivElement>(".text-editor input");

    if (
      div &&
      div.offsetTop + div.offsetHeight > window.scrollY + window.innerHeight
    ) {
      window.scrollTo(
        0,
        div.offsetTop + div.offsetHeight - window.innerHeight / 2
      );
    }
  }, []);

  return (
    <section id="comment-texteditor" className="text-editor container">
      <div className="body">
        <div
          className="text-editor input"
          onClick={() => editorRef.current?.focus()}
        >
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            ref={editorRef}
          />
        </div>
        <div className="text-editor footer">
          <button
            className="text-editor button submit"
            onClick={() => {
              if (onSubmit)
                onSubmit(editorState.getCurrentContent().getPlainText());
            }}
          >
            submit
          </button>
          <button
            className="text-editor button cancel"
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
