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
  className?: string;
}

export const PostPanel = function PostPanel({ doc, className }: Props) {
  const { state } = useContext(AppStateContext);
  const { isUpvoted, handleUpvote } = useIsUpvoted(doc);

  className = className || "panel";

  return (
    <div className={className}>
      <IfThen condition={!state.user}>
        <Fragment>
          <FontIcon className="font-icon disabled">expand_less</FontIcon>
          <FontIcon className="font-icon disabled">expand_more</FontIcon>
        </Fragment>
        <Fragment>
          <FontIcon
            className={`font-icon ${isUpvoted ? "active" : ""}`}
            onClick={state.user ? handleUpvote : () => null}
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
