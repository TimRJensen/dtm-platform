/**
 * Vendor imports.
 */
import { useState, useEffect, useRef, useContext } from "react";
import { ContentState, Editor, EditorState } from "draft-js";
import { AppStateContext } from "../App/app-state/context";

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

export const CommentTexteditor = function CommentTexteditor({
  show = true,
  content,
  onSubmit,
  className,
}: Props) {
  if (!show) return null;

  const [editorState, setEditorState] = useState(() => {
    if (!content) return EditorState.createEmpty();

    return EditorState.createWithContent(ContentState.createFromText(content));
  });
  const { dispatch } = useContext(AppStateContext);
  const editorRef = useRef<Editor>(null);

  className = className ? className : "text-editor";

  useEffect(() => {
    const div = document.querySelector<HTMLDivElement>(`.${className}-input`);

    if (div) {
      const divBottom = div.offsetTop + div.offsetHeight;

      if (divBottom > window.scrollY + window.innerHeight)
        window.scrollTo(0, divBottom - window.innerHeight / 2);
    }

    editorRef.current?.focus();
  }, []);

  return (
    <section className={className}>
      <div className={`${className}-body`}>
        <div
          className={`${className}-input`}
          onClick={() => editorRef.current?.focus()}
        >
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            ref={editorRef}
          />
        </div>
        <div className={`${className}-footer`}>
          <button
            className={`${className}-footer-button submit`}
            onClick={() => {
              if (onSubmit)
                onSubmit(editorState.getCurrentContent().getPlainText());
            }}
          >
            submit
          </button>
          <button
            className={`${className}-footer-button cancel`}
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
