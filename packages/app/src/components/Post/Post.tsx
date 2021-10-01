/**
 * Vendor imports.
 */
import { useContext, useEffect, useRef } from "react";
import { useRouteMatch } from "react-router-dom";

/**
 * Custom imports.
 */
import { PostDocument } from "db";
import { AppStateContext } from "../App/app-state/context";
import { useEditor, useIsUpvoted } from "../../hooks/";
import { CommentHeader } from "../CommentHeader/CommentHeader";
import { TextEditor } from "../TextEditor/TextEditor";
import { TextBox } from "../TextBox/TextBox";
import { FontIcon } from "../FontIcon/FontIcon";
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

  const match = useRouteMatch();
  const domElement = useRef<HTMLDivElement>(null);
  const { state } = useContext(AppStateContext);
  const { showEditor, handleShowEditor, handleSubmit } = useEditor(doc);
  const { isUpvoted, handleUpvote } = useIsUpvoted(doc);

  useEffect(() => {
    if (match.url === doc._id && domElement.current) {
      const rect = domElement.current?.getBoundingClientRect();

      if (rect.top > window.scrollY)
        window.scrollTo(0, rect.bottom - window.innerHeight / 2);
    }
  }, []);

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
          <div className={styles.footer}>
            <FontIcon
              key="footer-comment-button"
              type="question_answer"
              active={state.currentUser !== undefined}
              //styles={styles}
              onClick={onComment}
            >
              comment
            </FontIcon>
            <FontIcon
              key="footer-vote-button"
              type="thumb_up"
              active={state.currentUser !== undefined && isUpvoted}
              //styles={styles}
              onClick={handleUpvote}
            >
              upvote
            </FontIcon>
          </div>
        </div>
      )}
    </section>
  );
};
