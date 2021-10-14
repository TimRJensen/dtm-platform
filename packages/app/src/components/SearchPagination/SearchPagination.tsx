/**
 * Vendor imports.
 */
import { useEffect, useState } from "react";
import { Link, useParams, generatePath } from "react-router-dom";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import { FontIcon } from "../FontIcon/FontIcon";

/**
 * Types.
 */
const path = "/search/:query/:pageId";

type Params = { query: string; pageId: string };

interface Props {
  currentPage: number;
  resultsPerPage?: number;
  total: number;
}

/**
 * SearchPagination functional component.
 */
export function SearchPagination({
  currentPage,
  resultsPerPage = 10,
  total,
}: Props) {
  if (!total) return null;

  const { css } = useCSS(
    ({ spacing, borderRadius, colors, mixins: { button } }) => ({
      searchPagination: {
        display: "flex",
        alignItems: "center",
        margin: "auto",
        padding: spacing,
      },
      button: [
        button,
        {
          height: "auto",
          width: "auto",
          marginRight: spacing * 0.5,
          borderRadius: borderRadius * 0.5,
          "&:hover, &[data-active=true]": {
            backgroundColor: colors.secondary,
          },
        },
      ],
      divider: {
        marginRight: spacing * 0.5,
      },
      arrow: {
        color: colors.primary,

        "&:hover": {
          color: colors.secondary,
        },
      },
    })
  );
  const { query } = useParams<Params>();
  const [pages, setPages] = useState<(string | number)[]>();
  const maxPages = Math.ceil(total / resultsPerPage);

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

  return pages ? (
    <div css={css.searchPagination}>
      {currentPage !== 0 ? (
        <Link
          to={generatePath(path, {
            query,
            pageId: currentPage - 1,
          })}
        >
          <FontIcon
            type="keyboard_double_arrow_left"
            $css={{ icon: css.arrow }}
          />
        </Link>
      ) : null}
      {pages.map((value, i) =>
        typeof value === "number" ? (
          <Link
            key={`search-pagination-${value}`}
            to={generatePath(path, {
              query,
              pageId: value - 1,
            })}
          >
            <button css={css.button} data-active={value - 1 === currentPage}>
              {value}
            </button>
          </Link>
        ) : (
          <span key={`search-pagination-${value}-${i}`} css={css.divider}>
            {value}
          </span>
        )
      )}
      {currentPage + 1 !== maxPages ? (
        <Link
          to={generatePath(path, {
            query,
            pageId: currentPage + 1,
          })}
        >
          <FontIcon
            type="keyboard_double_arrow_right"
            $css={{ icon: css.arrow }}
          />
        </Link>
      ) : null}
    </div>
  ) : null;
}
