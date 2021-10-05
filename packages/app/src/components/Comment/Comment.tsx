/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { CommentDocument } from "db";
import { useEditor, useScrollElement } from "../../hooks/";
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

  const { domElement } = useScrollElement(doc);
  const { showEditor, handleShowEditor, handleSubmit } = useEditor(doc);

  return (
    <section className={styles.comment} ref={domElement}>
      <CommentHeader doc={doc} handleEdit={handleShowEditor} />
      {showEditor() ? (
        <TextEditor content={doc.content} onSubmit={handleSubmit} />
      ) : (
        <TextBox>{doc.content}</TextBox>
      )}
    </section>
  );
};
