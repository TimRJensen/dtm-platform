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
import { IfThen } from "../IfThen/IfThen";
import "./style.scss";

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

  return (
    <div className="post-header">
      <div className="info">
        {`${formatDate(doc.timestamp)} by `}
        <span className="user">{doc.creator.name}</span>
      </div>
      <IfThen condition={!state.currentUser}>
        <Fragment>
          <a className="link disabled">comment</a>
          <span className="divider"> - </span>
          <a className="link disabled">edit</a>
        </Fragment>
        <Fragment>
          <a className="link" onClick={handleComment}>
            comment
          </a>
          <span className="divider"> - </span>
          <IfThen condition={state.currentUser?.email === doc.creator.email}>
            <a className="link" onClick={handleEdit}>
              edit
            </a>
            <a className="link disabled">edit</a>
          </IfThen>
        </Fragment>
      </IfThen>
    </div>
  );
};
