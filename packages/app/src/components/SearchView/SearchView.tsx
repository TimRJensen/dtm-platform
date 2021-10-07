/**
 * Vendor imports.
 */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * Custom imports.
 */
import { CommentDocument, PostDocument } from "db";
import { useQuery } from "../../hooks/";
import { SearchPagination } from "../SearchPagination/SearchPagination";
import { SearchResult } from "../SearchResult/SearchResult";
import styles from "./styles.module.scss";

/**
 * QueryView functional component.
 */

export const SearchView = function SearchView() {
  const { pageId } = useParams<{ pageId?: string }>();
  const { results, queries } = useQuery(["content", "user.displayName"]);
  const [currentPage, setCurrentPage] = useState(
    pageId ? Number.parseInt(pageId.replace("page=", "")) : 0
  );

  useEffect(() => {
    if (pageId) {
      setCurrentPage(Number.parseInt(pageId.replace("page=", "")));
      window.scrollTo(0, 0);
    }
  });

  if (results.length === 0) return null;

  const resultsPerPage = 10;

  return (
    <section className={styles.searchView}>
      {results
        .slice(
          currentPage * resultsPerPage,
          resultsPerPage + currentPage * resultsPerPage
        )
        .map((doc: PostDocument | CommentDocument) => (
          <SearchResult
            key={`search-result-${doc._id}`}
            queries={queries}
            result={doc}
          />
        ))}
      <SearchPagination
        currentPage={currentPage}
        maxResults={results.length}
        resultsPerPage={resultsPerPage}
      />
    </section>
  );
};
