/**
 * Vendor imports.
 */
import { useContext } from "react";

/**
 * Custom imports.
 */
import { CommentDocument } from "db";
import { formatDate } from "../../util/main";
import { AppStateContext } from "../App/app-state/context";
import styles from "./styles.module.scss";

/**
 * CommentHeader functional component.
 */
interface Props {
  doc: CommentDocument;
  handleEdit: () => void;
}

export const CommentHeader = function CommentHeader({
  doc,
  handleEdit,
}: Props) {
  const { state } = useContext(AppStateContext);

  return (
    <div className={styles.commentHeader}>
      <div className={styles.info}>
        {`${formatDate(doc.timestamp)} by `}
        <span>{doc.user.name}</span>
      </div>
      {doc.user.email === state.currentUser?.email ? (
        <a className={styles.link} onClick={handleEdit}>
          edit
        </a>
      ) : (
        <a className={`${styles.link} ${styles.disabled}`}>edit</a>
      )}
    </div>
  );
};
