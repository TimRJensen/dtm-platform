/**
 * Vendor imports.
 */
import { useRef, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";

/**
 * Custom imports.
 */
import { CommentDocument } from "db";
import { useEditor } from "../App/hooks/main";
import { TextEditor } from "../TextEditor/TextEditor";
import { TextBox } from "../TextBox/TextBox";
import { CommentHeader } from "../CommentHeader/CommentHeader";
import styles from "./styles.module.scss";

/**
 * Comment functional component.
 */
interface Props {
  doc: CommentDocument;
}

export const Comment = function Comment({ doc }: Props) {
  if (!doc) return null;

  const match = useRouteMatch();
  const domElement = useRef<HTMLSelectElement>(null);
  const { showEditor, handleShowEditor, handleSubmit } = useEditor(doc);

  useEffect(() => {
    if (match.url === doc._id && domElement.current) {
      const rect = domElement.current?.getBoundingClientRect();

      if (rect.top > window.scrollY)
        window.scrollTo(0, rect.bottom - window.innerHeight / 2);
    }
  }, []);

  return (
    <section className={styles.comment} ref={domElement}>
      <CommentHeader doc={doc} handleEdit={handleShowEditor} />
      {showEditor() ? (
        <TextEditor
          styles={styles}
          content={doc.content}
          onSubmit={handleSubmit}
        />
      ) : (
        <TextBox>{doc.content}</TextBox>
      )}
    </section>
  );
};
