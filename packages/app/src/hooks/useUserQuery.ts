/**
 * Vendor imports.
 */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Fuse from "fuse.js";

/**
 * Custom imports.
 */

/**
 * useQuery hook.
 */
interface Params<T> {
  docs: T[];
  fields: (keyof T)[];
  resultsPerPage?: number;
}

export function useUserQuery<T>({
  docs,
  fields,
  resultsPerPage = 10,
}: Params<T>) {
  const { query, pageId } = useParams<{ query: string; pageId?: string }>();
  const [results, setResults] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(
    pageId ? Number.parseInt(pageId.replace("page=", "")) : 0
  );
  const queries = query.toLowerCase().split("+");

  useEffect(() => {
    setResults(
      docs.reduce((result, doc) => {
        const fuse = new Fuse([doc], {
          threshold: 0.3,
          isCaseSensitive: false,
          useExtendedSearch: true,
          keys: fields as string[],
        });

        for (const searchResult of fuse.search(queries.join("|")))
          result.push(searchResult.item);

        return result;
      }, [] as T[])
    );
  }, [docs, query]);

  useEffect(() => {
    if (pageId === undefined) return;

    setCurrentPage(Number.parseInt(pageId.replace("page=", "")));
    window.scrollTo(0, 0);
  }, [pageId]);

  return {
    queries,
    results: results.slice(
      currentPage * resultsPerPage,
      resultsPerPage + currentPage * resultsPerPage
    ),
    total: results.length,
    currentPage: (page?: number) => {
      if (page !== undefined) setCurrentPage(page);

      return currentPage;
    },
  };
}
