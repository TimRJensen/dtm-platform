/**
 * Vendor imports.
 */
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * Custom imports.
 */
import { ArtifactType } from "db";
import { useDB, useCSS } from "../../hooks";
import { AppStateContext } from "../../components/App/app-state/main";
import { LoadBox } from "../../components/LoadBox/LoadBox";
import { SearchPagination } from "../../components/SearchPagination/SearchPagination";
import { SearchResult } from "../../components/SearchResult/SearchResult";

/**
 * Types.
 */
const resultsPerPage = 10;

type Params = { query: string; pageId: string };
type ResponseType = {
  count: number | null;
  results: ArtifactType[] | null;
};

/**
 * search functional component.
 */
export default function search() {
  const { css } = useCSS(({ spacing }) => ({
    body: {
      display: "flex",
      flexFlow: "column",
      margin: `${spacing * 3}px 0`,
    },
  }));

  const { dispatch } = useContext(AppStateContext);

  const { db, queries } = useDB();
  const { query, pageId } = useParams<Params>();
  const [results, setResults] = useState<ArtifactType[]>();
  const cache = useRef(new Map<string, ResponseType>());

  const [total, setTotal] = useState<number>(0);

  const fetch = async () => {
    const currentRange = Number.parseInt(pageId) * resultsPerPage;
    const response =
      cache.current.get(query + pageId) ??
      (await db.selectFuzzy<ArtifactType>("artifacts", queries.artifact, {
        range: { from: currentRange, to: currentRange + resultsPerPage },
        count: "exact",
        filter: {
          column: "label",
          values: query.split("+"),
        },
      }));

    if (!response.results) return;

    cache.current.set(query + pageId, response);
    setResults(response.results);
    setTotal(response.count!);
    dispatch({
      type: "CURRENT_PATH",
      value: { section: "search", label: query.split("+").join(" & ") },
    });
  };

  useEffect(() => {
    fetch();
    return () => {
      setResults(undefined);
      setTotal(0);
    };
  }, [query, pageId]);

  useEffect(() => {
    window.scroll(0, 0);
  }, [results]);

  return (
    <LoadBox loadables={results} once={false}>
      <section css={css.body}>
        {results?.map((result) => (
          <SearchResult
            key={`search-result-${result.id}`}
            query={query}
            result={result}
          />
        ))}
        <SearchPagination currentPage={Number.parseInt(pageId)} total={total} />
      </section>
    </LoadBox>
  );
}
