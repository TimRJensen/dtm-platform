/**
 * Vendor imports.
 */
import { PostDocument } from "db";
import { useContext } from "react";

/**
 * Custom imports.
 */
import { useIsUpvoted } from "../../hooks";
import { AppStateContext } from "../App/app-state/context";
import { FontIcon } from "../FontIcon/FontIcon";
import styles from "./styles.module.scss";

/**
 * PostFooter functional component.
 */
interface Props {
  doc: PostDocument;
  onComment: () => void;
}

export const PostFooter = function PostFooter({ doc, onComment }: Props) {
  const { state } = useContext(AppStateContext);
  const { isUpvoted, handleUpvote } = useIsUpvoted(doc);

  return (
    <div className={styles.footer}>
      <FontIcon
        key="footer-comment-button"
        type="question_answer"
        disabled={!state.currentUser}
        onClick={onComment}
      >
        reply
      </FontIcon>
      <FontIcon
        key="footer-vote-button"
        type="thumb_up"
        active={isUpvoted}
        disabled={!state.currentUser}
        onClick={handleUpvote}
      >
        upvote
      </FontIcon>
    </div>
  );
};
