/**
 * Vendor imports.
 */
import { useContext } from "react";

/**
 * Custom imports.
 */
import { PostDocument } from "db";
import { AppStateContext } from "../App/app-state/context";
import { useIsUpvoted } from "../App/hooks/main";
import { FontIcon } from "../FontIcon/FontIcon";
import styles from "./styles.module.scss";

/**
 * PostPanel component.
 */
interface Props {
  doc: PostDocument;
}

export const PostPanel = function PostPanel({ doc }: Props) {
  const { state } = useContext(AppStateContext);
  const { isUpvoted, handleUpvote } = useIsUpvoted(doc);

  if (!state.currentUser)
    return (
      <div className={styles.postPanel}>
        <FontIcon className={`${styles.fontIcon} ${styles.disabled}`}>
          expand_less
        </FontIcon>
        {/* <FontIcon className={`${styles.fontIcon} ${styles.disabled}`}>
          expand_more
        </FontIcon> */}
      </div>
    );

  return (
    <div className={styles.postPanel}>
      <FontIcon
        className={`${styles.fontIcon} ${isUpvoted ? styles.active : ""}`}
        onClick={handleUpvote}
      >
        expand_less
      </FontIcon>
      {/*<FontIcon className="font-icon" onClick={handleDownvote}>
        expand_more
      </FontIcon>*/}
    </div>
  );
};
