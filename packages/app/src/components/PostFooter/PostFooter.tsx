/**
 * Vendor imports.
 */

import { useContext } from "react";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { PostDocument } from "db";
import { Theme } from "../../themes/dtm";
import { useIsUpvoted } from "../../hooks";
import { AppStateContext } from "../App/app-state/context";
import { FontIcon } from "../FontIcon/FontIcon";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const { spacing } = theme;

  return {
    footer: css({
      display: "flex",
      justifyContent: "end",
      padding: `${spacing}px ${spacing}px 0 0`,
    }),
  };
};

/**
 * PostFooter functional component.
 */
interface Props {
  doc: PostDocument;
  onComment: () => void;
}

export const PostFooter = function PostFooter({ doc, onComment }: Props) {
  const css = _css(useTheme() as Theme);
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
};
