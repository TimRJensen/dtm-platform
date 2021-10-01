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
  handleEdit: () => void;
}

export const PostHeader = function PostHeader({ doc, handleEdit }: Props) {
  const { state } = useContext(AppStateContext);

  return (
    <div className={styles.postHeader}>
      <div className={styles.info}>
        {`${formatDate(doc.timestamp)} by `}
        <span>{doc.user.name}</span>
      </div>
      {state.currentUser && state.currentUser.email === doc.user.email ? (
        <a className={styles.link} onClick={handleEdit}>
          edit
        </a>
      ) : (
        <a className={`${styles.link} ${styles.disabled}`}>edit</a>
      )}
    </div>
  );
};
