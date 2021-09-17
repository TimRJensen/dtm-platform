/**
 * Vendor imports.
 */
import { Fragment, useContext } from "react";

/**
 * Custom imports.
 */
import { PostDocument } from "db";
import { AppStateContext } from "../App/app-state/context";
import { useIsUpvoted } from "../App/hooks/main";
import { IfThen } from "../IfThen/IfThen";
import { FontIcon } from "../FontIcon/FontIcon";
import "./style.scss";

/**
 * PostPanel component.
 */
interface Props {
  doc: PostDocument;
}

export const PostPanel = function PostPanel({ doc }: Props) {
  const { state } = useContext(AppStateContext);
  const { isUpvoted, handleUpvote } = useIsUpvoted(doc);

  return (
    <div className="post-panel">
      <IfThen condition={!state.currentUser}>
        <Fragment>
          <FontIcon className="font-icon-disabled">expand_less</FontIcon>
          <FontIcon className="font-icon-disabled">expand_more</FontIcon>
        </Fragment>
        <Fragment>
          <FontIcon
            className={`font-icon ${isUpvoted ? "active" : ""}`}
            onClick={state.currentUser ? handleUpvote : () => null}
          >
            expand_less
          </FontIcon>
          {/*<FontIcon className="font-icon" onClick={handleDownvote}>
            expand_more
  </FontIcon>*/}
        </Fragment>
      </IfThen>
    </div>
  );
};
