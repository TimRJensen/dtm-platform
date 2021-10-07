/**
 * Vendor imports.
 */
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Fuse from "fuse.js";

/**
 * Custom imports.
 */
import { PostDocument, CommentDocument, PouchDBContext } from "db";

/**
 * useQuery hook.
 */
export const useQuery = function useQuery(fields: string[]) {
  const db = useContext(PouchDBContext);
  const { query } = useParams<{ query: string }>();
  const [results, setResults] = useState(
    [] as (PostDocument | CommentDocument)[]
  );

  const queries = query.toLowerCase().split("+");

  const fetch = async () => {
    const response = await db.find(["type"], {
      selector: {
        type: "blog",
      },
    });

    if (!response) return;

    setResults(
      response.docs.reduce((result, doc) => {
        if (doc.type === "blog") {
          for (const thread of doc.threads) {
            const fuse = new Fuse([thread.post, ...thread.comments], {
              threshold: 0.2,
              isCaseSensitive: false,
              useExtendedSearch: true,
              keys: fields,
            });

            for (const searchResult of fuse.search(queries.join("|")))
              result.push(searchResult.item);
          }
        }

        return result;
      }, [] as (CommentDocument | PostDocument)[])
    );
  };

  useEffect(() => {
    fetch();
  }, [query]);

  return {
    results,
    queries,
  };
};
