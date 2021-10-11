/**
 * Vendor imports.
 */
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Fuse from "fuse.js";

/**
 * Custom imports.
 */
import { PouchDBContext, ArtifactDocument } from "db";

/**
 * useQuery hook.
 */
interface Params {
  fields: string[];
  resultsPerPage?: number;
}

export const useQuery = function useQuery({
  fields,
  resultsPerPage = 10,
}: Params) {
  const db = useContext(PouchDBContext);
  const { query, pageId } = useParams<{ query: string; pageId?: string }>();
  const [results, setResults] = useState([] as ArtifactDocument[]);
  const [currentPage, setCurrentPage] = useState(
    pageId ? Number.parseInt(pageId.replace("page=", "")) : 0
  );
  const queries = query.toLowerCase().split("+");

  const fetch = async () => {
    const response = await db.find(["type", "_id"], {
      selector: {
        type: "blog",
      },
    });

    if (!response) return;

    setResults(
      response.docs.reduce((result, doc) => {
        if (doc.type === "blog") {
          const fuse = new Fuse([doc.artifact], {
            threshold: 0.3,
            isCaseSensitive: false,
            useExtendedSearch: true,
            keys: fields,
          });

          for (const searchResult of fuse.search(queries.join("|")))
            result.push(searchResult.item);
        }

        return result;
      }, [] as ArtifactDocument[])
    );
  };

  useEffect(() => {
    fetch();
  }, [query]);

  useEffect(() => {
    if (!pageId) return;

    setCurrentPage(Number.parseInt(pageId.replace("page=", "")));
    window.scrollTo(0, 0);
  }, [pageId]);

  console.log(results);
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
};
