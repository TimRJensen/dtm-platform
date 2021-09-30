/**
 * Vendor imports.
 */
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

/**
 * Custom imports.
 */
import { PostDocument, CommentDocument, PouchDBContext } from "db";
import { docIncludes } from "../util/main";

/**
 * useQuery hook.
 */
export const useQuery = function useQuery() {
  const db = useContext(PouchDBContext);
  const { query } = useParams<{ query: string }>();
  const [results, setResults] = useState(
    undefined as (PostDocument | CommentDocument)[] | undefined
  );

  const fetch = async () => {
    const response = await db.find(["type"], {
      selector: {
        type: "blog",
      },
    });

    if (!response) return;

    const queries = query.toLowerCase().split("+");
    const includeKeys = [
      "content",
      "comments",
      "creator",
      "user",
      "name",
      "timestamp",
    ];

    setResults(
      response.docs.reduce((result, doc) => {
        if (doc.type === "blog") {
          doc.threads.forEach((thread) => {
            if (docIncludes(thread.post, includeKeys, queries))
              result.push(thread.post);

            thread.comments.forEach((comment) => {
              if (docIncludes(comment, includeKeys, queries))
                result.push(comment);
            });
          });
        }

        return result;
      }, [] as (CommentDocument | PostDocument)[])
    );
  };

  useEffect(() => {
    fetch();

    return () => setResults(undefined);
  }, [query]);

  return {
    results,
    query,
  };
};
