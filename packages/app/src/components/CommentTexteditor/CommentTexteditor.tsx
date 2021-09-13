/**
 * Vendor imports.
 */
import { useState, forwardRef, Ref, useEffect } from "react";
import { Editor, EditorState } from "draft-js";
import "./CommentTexteditor.scss";

/**
 * Custom imports.
 */

/**
 * CommentTextbox functional component - wrapper for https://draftjs.org/
 */
interface Props {
  onSubmit?: (content?: string) => void;
  ref?: Ref<Editor>;
}

export const CommentTexteditor = forwardRef(function CommentTexteditor(
  { onSubmit }: Props,
  ref: Ref<Editor>
) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleSubmit = () => {
    if (onSubmit) onSubmit(editorState.getCurrentContent().getPlainText());
  };

  const handleCancel = () => {
    if (onSubmit) onSubmit(undefined);
  };

  const handleClick = () => {
    if (ref && "current" in ref) ref.current?.focus();
  };

  useEffect(() => {
    const a = document.querySelector(".comment-texteditor-input");
    console.log(a?.scrollIntoView({ block: "center" }));
  }, []);

  return (
    <section id="comment-texteditor" className="comment-texteditor">
      <div className="comment-texteditor-body">
        <div className="comment-texteditor-input" onClick={handleClick}>
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            ref={ref}
          />
        </div>
        <div className="comment-texteditor-footer">
          <button
            className="comment-texteditor-icon submit"
            onClick={handleSubmit}
          >
            submit
          </button>
          <button
            className="comment-texteditor-icon cancel"
            onClick={handleCancel}
          >
            cancel
          </button>
        </div>
      </div>
    </section>
  );
});
