/**
 * Vendor imports.
 */
import { useEffect } from "react";

/**
 * Custom imports.
 */
import { ThreadDocument } from "db";
import { useEditor } from "../../hooks/";
import { Post } from "../Post/Post";
import { Comment } from "../Comment/Comment";
import { TextEditor } from "../TextEditor/TextEditor";
import styles from "./styles.module.scss";

/**
 * Thread functional component.
 */
interface Props {
  doc: ThreadDocument;
}

export const Thread = function Thread({ doc }: Props) {
  if (!doc) return null;

  const { showEditor, handleShowEditor, handleSubmit } = useEditor(doc);

  useEffect(() => {});

  return (
    <section className={styles.thread}>
      <Post doc={doc.post} onComment={handleShowEditor} />
      {Array.from(doc.comments.values()).map((comment) => {
        return <Comment key={comment._id} doc={comment} />;
      })}
      <TextEditor styles={styles} onSubmit={handleSubmit} show={showEditor()} />
    </section>
  );
};
