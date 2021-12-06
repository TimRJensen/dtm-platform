/**
 * Vendor imports.
 */

import { useContext } from "react";

/**
 * Custom imports.
 */
import { PostType } from "db";
import { useCSS, useLocale, useUpvoted } from "../../hooks";
import { AppStateContext } from "../App/app-state/context";
import Button from "../Button/Button";
import FontIcon from "../FontIcon/FontIcon";

/**
 * Types.
 */
interface Props {
  doc: PostType;
  onComment: () => void;
}

/**
 * PostFooter functional component.
 */
export default function PostFooter({ doc, onComment }: Props) {
  const { locale } = useLocale("dk/DK");
  const { css } = useCSS(({ spacing, colors }) => ({
    footer: {
      display: "flex",
      justifyContent: "end",
      padding: `${spacing}px ${spacing}px 0 0`,
    },
    button: {
      width: "auto",
      color: colors.secondary,
      "&:hover": {
        color: colors.secondaryDarker,
      },
      ":first-of-type": {
        margin: `0 ${spacing}px 0 0`,
      },
    },
  }));
  const { state } = useContext(AppStateContext);
  const { isUpvoted, handleUpvote } = useUpvoted(doc);

  return (
    <div css={css.footer}>
      <Button
        css={css.button}
        type="transparent"
        disabled={!state.currentUser}
        onClick={onComment}
      >
        <FontIcon key="footer-comment-button" type="question_answer">
          {locale.components.PostFooter.reply}
        </FontIcon>
      </Button>
      <Button
        css={css.button}
        type="transparent"
        disabled={!state.currentUser}
        toggled={isUpvoted}
        onClick={handleUpvote}
      >
        <FontIcon key="footer-vote-button" type="thumb_up">
          {locale.components.PostFooter.upvote}
        </FontIcon>
      </Button>
    </div>
  );
}
