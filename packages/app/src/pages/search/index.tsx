/**
 * Vendor imports.
 */
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * Custom imports.
 */
import { ArtifactType } from "db";
import { useDB, useCSS, useLocale } from "../../hooks";
import { AppStateContext } from "../../components/App/app-state/main";
import LoadBox from "../../components/LoadBox/LoadBox";
import SearchPagination from "../../components/SearchPagination/SearchPagination";
import SearchResult from "../../components/SearchResult/SearchResult";

/**
 * Types.
 */
const resultsPerPage = 10;

type Params = { query: string; pageId: string };
type ResponseType = {
  count: number;
  data: ArtifactType[];
};

/**
 * search functional component.
 */
export default function search() {
  const { locale } = useLocale("dk/DK");
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
  const [result, setResult] = useState<ResponseType>();
  const cache = useRef(new Map<string, ResponseType>());

  const fetch = async () => {
    const currentRange = Number.parseInt(pageId) * resultsPerPage;

    if (cache.current.has(query + pageId)) {
      setResult(cache.current.get(query + pageId));
    } else {
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

      if ("error" in response) {
        return; // 404
      }

      cache.current.set(query + pageId, response);
      setResult(response);
    }

    dispatch({
      type: "CURRENT_PATH",
      value: {
        section: locale.pages.search.section,
        label: query.split("+").join(" & "),
      },
    });
  };

  useEffect(() => {
    fetch();
    return () => {
      setResult(undefined);
    };
  }, [query, pageId]);

  useEffect(() => {
    window.scroll(0, 0);
  }, [result]);

  return (
    <LoadBox data={result?.data} loadable>
      <section css={css.body}>
        {result?.data.map((result) => (
          <SearchResult
            key={`search-result-${result.id}`}
            query={query}
            result={result}
          />
        ))}
        <SearchPagination
          currentPage={Number.parseInt(pageId)}
          total={result?.count ?? 0}
        />
      </section>
    </LoadBox>
  );
}
