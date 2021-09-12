/**
 * Vendor imports.
 */
import { FormEvent, useState, forwardRef, Ref } from "react";
import { Editor, EditorState } from "draft-js";

/**
 * Custom imports.
 */

/**
 * CommentEditor functional component - wrapper for https://draftjs.org/
 */
interface Props {
  onSubmit?: (event?: FormEvent<any>, content?: string) => void;
  ref?: Ref<any>;
}

export const CommentEditor = forwardRef(function CommentEditor(
  { onSubmit }: Props,
  ref: Ref<any>
) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onSubmit)
      onSubmit(event, editorState.getCurrentContent().getPlainText());
  };

  return (
    <form onSubmit={handleSubmit} ref={ref}>
      <Editor editorState={editorState} onChange={setEditorState} />
      <input type="submit" value="ok" />
    </form>
  );
});
