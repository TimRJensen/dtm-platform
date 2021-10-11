/**
 * Vendor imports.
 */
import { css, useTheme } from "@emotion/react";
import GridLoader from "react-spinners/GridLoader";

/**
 * Custom imports.
 */
import { Theme } from "../../themes/dtm";
import { useQuery, useIsLoading } from "../../hooks";
import { SearchPagination } from "../../components/SearchPagination/SearchPagination";
import { SearchResult } from "../../components/SearchResult/SearchResult";
import { AppHeader } from "../../components/AppHeader/AppHeader";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const {
    spacing,
    sizes: { search },
  } = theme;

  return {
    banner: css({
      height: "20vh",
      backgroundColor: "#000",
    }),
    view: css({
      display: "flex",
      flexFlow: "column",
      margin: `${spacing * 3}px 0`,
    }),
    spinner: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 40vh)",
      width: "99vw",
    }),
  };
};

/**
 * search functional component.
 */
export default function search() {
  const { results, total, queries, currentPage } = useQuery({
    fields: [
      "title",
      //"content",
      //"category.base.label",
      //"category.sub.label",
    ],
  });
  const { isLoading, onLoad } = useIsLoading(results);
  const theme = useTheme() as Theme;
  const css = _css(theme);

  if (results.length === 0) return null;

  return (
    <section>
      <div css={css.banner}></div>
      <AppHeader />
      <div css={css.view} onLoad={onLoad}>
        {isLoading() ? (
          <div css={css.spinner}>
            <GridLoader color={theme.colors.primary} loading={isLoading()} />
          </div>
        ) : null}
        {results.map((doc) => (
          <SearchResult
            key={`search-result-${doc._id}`}
            style={{ display: isLoading() ? "none" : "flex" }}
            queries={queries}
            result={doc}
          />
        ))}
      </div>
      <SearchPagination currentPage={currentPage()} total={total} />
    </section>
  );
}
