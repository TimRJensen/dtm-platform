/**
 * Vendor imports.
 */
import { Link } from "react-router-dom";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { ArtifactDocument } from "db";
import { Theme } from "../../themes/dtm";
import { formatDate } from "../../util/main";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const { spacing, colors } = theme;

  return {
    searchResultHeader: css({
      display: "flex",
      padding: spacing,
      borderBottom: `1px solid ${colors.primary}`,
    }),
    link: css({
      color: colors.text.link,
      textDecoration: "none",
    }),
    info: css({
      marginRight: "auto",
    }),
  };
};

/**
 * SearchResultHeader functional component.
 */
interface Props {
  doc: ArtifactDocument;
}

export const SearchResultHeader = function SearchResultHeader({ doc }: Props) {
  const css = _css(useTheme() as Theme);

  return (
    <div css={css.searchResultHeader}>
      <div css={css.info}></div>
      <Link css={css.link} to={doc._id}>
        {"view"}
      </Link>
    </div>
  );
};
