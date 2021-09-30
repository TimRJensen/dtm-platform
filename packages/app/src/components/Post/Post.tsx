/**
 * Vendor imports.
 */
import { useEffect, useRef } from "react";
import { useRouteMatch } from "react-router-dom";

/**
 * Custom imports.
 */
import { PostDocument } from "db";
import { useEditor } from "../../hooks/";
import { PostPanel } from "../PostPanel/PostPanel";
import { PostHeader } from "../PostHeader/PostHeader";
import { TextEditor } from "../TextEditor/TextEditor";
import { TextBox } from "../TextBox/TextBox";
import styles from "./style.module.scss";

/**
 * Post functional component.
 */
interface Props {
  doc: PostDocument;
  onComment: () => void;
}

export const Post = function Post({ doc, onComment }: Props) {
  if (!doc) return null;

  const match = useRouteMatch();
  const domElement = useRef<HTMLDivElement>(null);
  const { showEditor, handleShowEditor, handleSubmit } = useEditor(doc);

  useEffect(() => {
    if (match.url === doc._id && domElement.current) {
      const rect = domElement.current?.getBoundingClientRect();

      if (rect.top > window.scrollY)
        window.scrollTo(0, rect.bottom - window.innerHeight / 2);
    }
  }, []);

  return (
    <section className={styles.post} ref={domElement}>
      <PostHeader
        doc={doc}
        handleComment={onComment}
        handleEdit={handleShowEditor}
      />
      <div className={styles.body}>
        <PostPanel doc={doc} />
        {showEditor() ? (
          <TextEditor
            styles={styles}
            content={doc.content}
            onSubmit={handleSubmit}
            advanced
          />
        ) : (
          <TextBox>{doc.content}</TextBox>
        )}
      </div>
    </section>
  );
};
