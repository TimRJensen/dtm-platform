/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { PostDocument } from "db";
import { useEditor, useScrollElement } from "../../hooks/";
import { CommentHeader } from "../CommentHeader/CommentHeader";
import { TextEditor } from "../TextEditor/TextEditor";
import { PostFooter } from "../PostFooter/PostFooter";
import { TextBox } from "../TextBox/TextBox";
import styles from "./styles.module.scss";

/**
 * Post functional component.
 */
interface Props {
  doc: PostDocument;
  onComment: () => void;
}

export const Post = function Post({ doc, onComment }: Props) {
  if (!doc) return null;

  const { domElement } = useScrollElement(doc);
  const { showEditor, handleShowEditor, handleSubmit } = useEditor(doc);

  return (
    <section className={styles.post} ref={domElement}>
      <CommentHeader styles={styles} doc={doc} handleEdit={handleShowEditor} />
      {showEditor() ? (
        <div className={styles.body}>
          <TextEditor content={doc.content} onSubmit={handleSubmit} advanced />
        </div>
      ) : (
        <div className={styles.body}>
          <TextBox>{doc.content}</TextBox>
          <PostFooter doc={doc} onComment={onComment} />
        </div>
      )}
    </section>
  );
};
