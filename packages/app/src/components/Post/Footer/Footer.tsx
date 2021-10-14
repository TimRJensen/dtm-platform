/**
 * Vendor imports.
 */

import { useContext } from "react";

/**
 * Custom imports.
 */
import { PostType } from "db";
import { useCSS, useIsUpvoted } from "../../../hooks";
import { AppStateContext } from "../../App/app-state/context";
import { FontIcon } from "../../FontIcon/FontIcon";

/**
 * Types.
 */
interface Props {
  doc: PostType;
  onComment: () => void;
}

/**
 * Footer functional component.
 */
export function Footer({ doc, onComment }: Props) {
  const { css } = useCSS(({ spacing }) => ({
    footer: {
      display: "flex",
      justifyContent: "end",
      padding: `${spacing}px ${spacing}px 0 0`,
    },
  }));
  const { state } = useContext(AppStateContext);
  const { isUpvoted, handleUpvote } = useIsUpvoted(doc);

  return (
    <div css={css.footer}>
      <FontIcon
        key="footer-comment-button"
        type="question_answer"
        disabled={!state.currentUser}
        onClick={onComment}
      >
        reply
      </FontIcon>
      <FontIcon
        key="footer-vote-button"
        type="thumb_up"
        active={isUpvoted}
        disabled={!state.currentUser}
        onClick={handleUpvote}
      >
        upvote
      </FontIcon>
    </div>
  );
}
