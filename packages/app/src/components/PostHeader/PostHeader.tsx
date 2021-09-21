/**
 * Vendor imports.
 */
import { useContext, Fragment } from "react";

/**
 * Custom imports.
 */
import { PostDocument } from "db";
import { formatDate } from "../../util/main";
import { AppStateContext } from "../App/app-state/context";
import styles from "./styles.module.scss";

/**
 * PostHeader functional component.
 */
interface Props {
  doc: PostDocument;
  handleComment: () => void;
  handleEdit: () => void;
}

export const PostHeader = function PostHeader({
  doc,
  handleComment,
  handleEdit,
}: Props) {
  const { state } = useContext(AppStateContext);

  if (!state.currentUser)
    return (
      <div className={styles.postHeader}>
        <div className={styles.info}>
          {`${formatDate(doc.timestamp)} by `}
          <span>{doc.user.name}</span>
        </div>
        <a className={`${styles.link} ${styles.disabled}`}>comment</a>
        <span className={styles.divider}> - </span>
        <a className={`${styles.link} ${styles.disabled}`}>edit</a>
      </div>
    );

  return (
    <div className={styles.postHeader}>
      <div className={styles.info}>
        {`${formatDate(doc.timestamp)} by `}
        <span>{doc.user.name}</span>
      </div>
      <a className={styles.link} onClick={handleComment}>
        comment
      </a>
      <span className={styles.divider}> - </span>
      {state.currentUser?.email === doc.user.email ? (
        <a className={styles.link} onClick={handleEdit}>
          edit
        </a>
      ) : (
        <a className={`${styles.link} ${styles.disabled}`}>edit</a>
      )}
    </div>
  );
};
