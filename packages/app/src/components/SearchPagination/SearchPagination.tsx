/**
 * Vendor imports.
 */
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

/**
 * Custom imports.
 */
import styles from "./styles.module.scss";

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
      pages.push("...", Math.floor(maxResults / 25));
    } else {
      let i = maxPages - 6;

      while (++i < maxPages) pages.push(i + 1);
      pages.unshift(1, "...");
    }

    setPages(pages);
  }, [currentPage]);

  return (
    <div className={styles.searchPagination}>
      {pages.map((value, i) =>
        typeof value === "number" ? (
          <button
            key={`search-pagination-${value}`}
            className={
              value - 1 === currentPage
                ? `${styles.button} ${styles.active}`
                : styles.button
            }
            onClick={() =>
              history.push(
                history.location.pathname.replace(/=\d*/, `=${value - 1}`)
              )
            }
          >
            {value}
          </button>
        ) : (
          <span
            key={`search-pagination-${value}-${i}`}
            className={styles.divider}
          >
            {value}
          </span>
        )
      )}
    </div>
  );
};
