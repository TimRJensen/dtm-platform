/**
 * Vendor imports.
 */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * Custom imports.
 */
import { CommentDocument, PostDocument } from "db";
import { useQuery } from "../App/hooks/main";
import { SearchPagination } from "../SearchPagination/SearchPagination";
import { SearchResult } from "../SearchResult/SearchResult";
import styles from "./styles.module.scss";

/**
 * QueryView functional component.
 */

export const SearchView = function SearchView() {
  const { pageId } = useParams<{ pageId?: string }>();
  const { results, query } = useQuery();
  const [currentPage, setCurrentPage] = useState(
    pageId ? Number.parseInt(pageId.replace("page=", "")) : 0
  );

  useEffect(() => {
    if (pageId) {
      setCurrentPage(Number.parseInt(pageId.replace("page=", "")));
      window.scrollTo(0, 0);
    }
  }, [pageId]);

  if (!results) return null;

  const resultsPerPage = 25;

  return (
    <section className={styles.searchView}>
      {/* <div className="header">
        <h2 className="title">Results:</h2>
        <span className="controls"></span>
      </div> */}
      {results
        .slice(
          currentPage * resultsPerPage,
          resultsPerPage + currentPage * resultsPerPage
        )
        .map((doc: PostDocument | CommentDocument) => (
          <SearchResult
            key={`search-result-${doc._id}`}
            query={query}
            result={doc}
          />
        ))}
      <SearchPagination currentPage={currentPage} maxResults={results.length} />
    </section>
  );
};
