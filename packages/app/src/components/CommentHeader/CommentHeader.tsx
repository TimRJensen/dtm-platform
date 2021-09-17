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
import { IfThen } from "../IfThen/IfThen";
import "./style.scss";

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
    <div className="comment-header">
      <div className="info">
        {`${formatDate(doc.timestamp)} by `}
        <span className="user">{doc.creator.name}</span>
      </div>
      <IfThen condition={doc.creator.email === state.currentUser?.email}>
        <a className="link" onClick={handleEdit}>
          edit
        </a>
        <a className="link disabled">edit</a>
      </IfThen>
    </div>
  );
};
