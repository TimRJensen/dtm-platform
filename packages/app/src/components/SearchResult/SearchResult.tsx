/**
 * Vendor imports.
 */
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { CommentDocument, PostDocument } from "db";
import { Theme } from "../../themes/dtm";
import { useDecorateNode } from "../../hooks/";
import { SearchResultHeader } from "../SearchResultHeader/SearchResultHeader";
import { TextBox } from "../TextBox/TextBox";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const { colors } = theme;

  return {
    searchResult: css({
      width: "inherit",
    }),
    highligt: css({
      backgroundColor: `rgba(${colors.secondary}, 0.66)`,
    }),
  };
};

/**
 * SearchResult functional component.
 */
interface Props {
  queries: string[];
  result: PostDocument | CommentDocument;
}

export const SearchResult = function SearchResult({ queries, result }: Props) {
  const css = _css(useTheme() as Theme);
  const { nodes } = useDecorateNode({
    htmlString: result.content,
    tests: queries,
    decorator: {
      tag: "span",
      styles: `background-color: rgba(${"#FF8000"}, 0.66)`,
    },
  });

  return (
    <div css={css.searchResult}>
      <SearchResultHeader doc={result} />
      <TextBox>{nodes.length > 0 ? nodes : result.content}</TextBox>
    </div>
  );
};
