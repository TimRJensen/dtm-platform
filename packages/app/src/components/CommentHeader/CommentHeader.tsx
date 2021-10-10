/**
 * Vendor imports.
 */
import { useContext } from "react";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { CommentDocument, PostDocument } from "db";
import { Theme } from "../../themes/dtm";
import { formatDate } from "../../util/main";
import { AppStateContext } from "../App/app-state/context";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const { spacing, borderRadius, colors } = theme;

  return {
    commentHeader: css({
      display: "flex",
      padding: spacing,
      backgroundColor: colors.primary,
      borderRadius: `${spacing}px ${spacing}px 0 0`,
      color: colors.text.secondary,
    }),
    link: css({
      cursor: "pointer",
    }),
    linkDisabled: css({
      cursor: "default",
      color: colors.text.disabled,
    }),
    info: css({ marginRight: "auto" }),
  };
};

/**
 * CommentHeader functional component.
 */
interface Props {
  doc: CommentDocument | PostDocument;
  onEdit: () => void;
  $css?: Pick<ReturnType<typeof _css>, "commentHeader">;
}

export const CommentHeader = function CommentHeader({
  doc,
  onEdit,
  $css,
}: Props) {
  const css = _css(useTheme() as Theme);
  const { state } = useContext(AppStateContext);

  return (
    <div css={[css.commentHeader, $css?.commentHeader]}>
      <div css={css.info}>
        {`${formatDate(doc.timestamp)} by `}
        <span>{doc.user.displayName}</span>
      </div>
      {
        /* doc.user._id === state.currentUser?._id */ true ? (
          <span css={css.link} onClick={onEdit}>
            edit
          </span>
        ) : (
          <span css={[css.link, css.linkDisabled]}>edit</span>
        )
      }
    </div>
  );
};
