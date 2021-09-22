/**
 * Vendor imports.
 */
import { useState } from "react";

/**
 * Custom imports.
 */
import { CommentDocument, PostDocument } from "db";
import { useQuery } from "../App/hooks/main";
import { SearchResult } from "../SearchResult/SearchResult";
import styles from "./styles.module.scss";

/**
 * QueryView functional component.
 */

export const SearchView = function SearchView() {
  const { results, test } = useQuery();
  const [currentPage, setCurrentPage] = useState(0);

  if (!results) return null;

  const pages: (number | string)[] = [];
  const resultsPerPage = 25;
  const maxPages = Math.floor(results.length / resultsPerPage);

  if (currentPage < 4) {
    let i = -1;

    while (++i < maxPages && i < 5) pages.push(i + 1);

    if (maxPages > 5) pages.push("...", maxPages);
  } else if (currentPage + 4 < maxPages) {
    let i = currentPage - 3;

    while (++i < maxPages && i < currentPage + 3) pages.push(i + 1);

    pages.unshift(1, "...");
    pages.push("...", Math.floor(results.length / 25));
  } else {
    let i = maxPages - 6;

    while (++i < maxPages) pages.push(i + 1);
    pages.unshift(1, "...");
  }

  return (
    <section className={styles.searchView}>
      {/* <div className="header">
        <h2 className="title">Results:</h2>
        <span className="controls"></span>
      </div> */}
      {pages.map((value, i) =>
        typeof value === "number" ? (
          <button
            key={`search-pagination-${value}`}
            className={
              value - 1 === currentPage
                ? `${styles.button} ${styles.active}`
                : styles.button
            }
            onClick={() => setCurrentPage(value - 1)}
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
      {results
        .slice(
          currentPage * resultsPerPage,
          resultsPerPage + currentPage * resultsPerPage
        )
        .map((doc: PostDocument | CommentDocument) => (
          <SearchResult
            key={`search-result-${doc._id}`}
            test={test}
            result={doc}
          />
        ))}
    </section>
  );
};
