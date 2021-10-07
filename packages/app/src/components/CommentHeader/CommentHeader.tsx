/**
 * Vendor imports.
 */
import { useContext } from "react";

/**
 * Custom imports.
 */
import { CommentDocument, PostDocument } from "db";
import { formatDate } from "../../util/main";
import { AppStateContext } from "../App/app-state/context";
import styles from "./styles.module.scss";

/**
 * CommentHeader functional component.
 */
interface Props {
  doc: CommentDocument | PostDocument;
  handleEdit: () => void;
  styles?: { [key: string]: string };
}

export const CommentHeader = function CommentHeader({
  doc,
  handleEdit,
  styles: _styles = styles,
}: Props) {
  const { state } = useContext(AppStateContext);

  return (
    <div className={_styles.commentHeader}>
      <div className={_styles.info}>
        {`${formatDate(doc.timestamp)} by `}
        <span>{doc.user.displayName}</span>
      </div>
      {doc.user._id === state.currentUser?._id ? (
        <span className={_styles.link} onClick={handleEdit}>
          edit
        </span>
      ) : (
        <span className={`${_styles.link} ${_styles.disabled}`}>edit</span>
      )}
    </div>
  );
};
