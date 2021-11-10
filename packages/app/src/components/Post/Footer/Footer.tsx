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
import { Button } from "../../Button/Button";
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
  const { css } = useCSS(({ spacing, colors }) => ({
    footer: {
      display: "flex",
      justifyContent: "end",
      padding: `${spacing}px ${spacing}px 0 0`,
    },
    button: {
      width: "auto",
      color: colors.secondary,
      "&[data-disabled=false]:hover": {
        color: colors.secondaryDarker,
      },
      ":first-of-type": {
        margin: `0 ${spacing}px 0 0`,
      },
    },
  }));
  const { state } = useContext(AppStateContext);
  const { isUpvoted, handleUpvote } = useIsUpvoted(doc);

  return (
    <div css={css.footer}>
      <Button
        $css={{ button: css.button }}
        type="transparent"
        disabled={!state.currentUser}
        onClick={onComment}
      >
        <FontIcon key="footer-comment-button" type="question_answer">
          reply
        </FontIcon>
      </Button>
      <Button
        $css={{ button: css.button }}
        type="transparent"
        disabled={!state.currentUser}
        toggled={isUpvoted}
        onClick={handleUpvote}
      >
        <FontIcon key="footer-vote-button" type="thumb_up">
          upvote
        </FontIcon>
      </Button>
    </div>
  );
}
