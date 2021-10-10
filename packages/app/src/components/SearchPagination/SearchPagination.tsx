/**
 * Vendor imports.
 */
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { Theme, button } from "../../themes/dtm";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const { spacing, borderRadius, colors } = theme;

  return {
    searchPagination: css({
      padding: spacing,
    }),
    button: css([
      button,
      {
        height: "auto",
        width: "auto",
        marginRight: spacing * 0.5,
        borderRadius: borderRadius * 0.5,
        "&:hover": {
          backgroundColor: colors.secondary,
        },
      },
    ]),
    buttonActive: css({
      backgroundColor: colors.secondary,
    }),
    divider: css({
      marginRight: spacing * 0.5,
    }),
  };
};

/**
 * SearchPagination functional component.
 */
interface Props {
  currentPage: number;
  maxResults: number;
  resultsPerPage?: number;
}

export const SearchPagination = function SearchPagination({
  currentPage,
  maxResults,
  resultsPerPage = 25,
}: Props) {
  const history = useHistory();
  const css = _css(useTheme() as Theme);
  const [pages, setPages] = useState([] as (string | number)[]);
  const maxPages = Math.floor(maxResults / resultsPerPage);

  useEffect(() => {
    const pages = [];

    if (currentPage < 4) {
      let i = -1;

      while (++i < maxPages && i < 5) pages.push(i + 1);

      if (maxPages > 5) pages.push("...", maxPages);
    } else if (currentPage + 4 < maxPages) {
      let i = currentPage - 3;

      while (++i < maxPages && i < currentPage + 3) pages.push(i + 1);

      pages.unshift(1, "...");
      pages.push("...", maxPages);
    } else {
      let i = maxPages - 6;

      while (++i < maxPages) pages.push(i + 1);
      pages.unshift(1, "...");
    }

    setPages(pages);
  }, [currentPage]);

  return (
    <div css={css.searchPagination}>
      {pages.map((value, i) =>
        typeof value === "number" ? (
          <button
            key={`search-pagination-${value}`}
            css={
              value - 1 === currentPage
                ? [css.button, css.buttonActive]
                : css.button
            }
            onClick={() =>
              history.push(
                history.location.pathname.replace(
                  /(\/page=\d*)|$/,
                  `/page=${value - 1}`
                )
              )
            }
          >
            {value}
          </button>
        ) : (
          <span key={`search-pagination-${value}-${i}`} css={css.divider}>
            {value}
          </span>
        )
      )}
    </div>
  );
};
