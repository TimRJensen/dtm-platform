/**
 * Vendor imports.
 */
import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { CommentDocument, PostDocument } from "db";
import { formatDate } from "../../util/main";
import styles from "./styles.module.scss";

/**
 * SearchResultHeader functional component.
 */
interface Props {
  doc: PostDocument | CommentDocument;
}

export const SearchResultHeader = function SearchResultHeader({ doc }: Props) {
  return (
    <div className={styles.searchResultHeader}>
      <div className={styles.info}>
        {`${formatDate(doc.timestamp)} by `}
        <span>{doc.user.displayName}</span>
      </div>
      <Link className={styles.link} to={doc._id}>
        {doc._id}
      </Link>
    </div>
  );
};
