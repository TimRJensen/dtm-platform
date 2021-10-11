/**
 * Vendor imports.
 */
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { ArtifactDocument } from "db";

import { Link } from "react-router-dom";
import { Theme } from "../../themes/dtm";
/*import { useDecorateNode } from "../../hooks/";
import { SearchResultHeader } from "../SearchResultHeader/SearchResultHeader";
import { TextBox } from "../TextBox/TextBox";*/
import { ArtifactPanel } from "../ArtifactPanel/ArtifactPanel";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const {
    spacing,
    borderRadius,
    colors,
    sizes: { search },
  } = theme;

  return {
    searchResult: css({
      display: "flex",
      width: `${search.width * 0.7}vw`,
      minHeight: "20vh",
      margin: `0 auto ${spacing * 3}px auto`,
    }),
    image: css({
      height: "100%",
      width: `${search.width * 0.2}vw`,
      margin: `auto ${spacing}px auto 0`,
      borderRadius,
    }),
    content: css({
      display: "flex",
      flexFlow: "column",
      width: `${search.width * 0.4}vw`,
      marginRight: spacing,
    }),
    info: css({
      display: "flex",
      alignItems: "center",
      borderBottom: `1px solid ${colors.primary}`,
    }),
    title: css({
      marginRight: "auto",
      fontSize: "1.333rem",
    }),
    link: css({
      marginRight: spacing,
      color: colors.text.link,
      textAlign: "right",
      textDecoration: "none",
    }),
    /*highlight: css({
      backgroundColor: `rgba(255, 128, 0, 0.66)`,
    }),*/
  };
};

/**
 * SearchResult functional component.
 */
interface Props {
  queries: string[];
  result: ArtifactDocument;
  style?: any;
}

export const SearchResult = function SearchResult({
  /*queries,*/ result,
  style,
}: Props) {
  const css = _css(useTheme() as Theme);
  /*const { nodes } = useDecorateNode({
    htmlString: result.title,
    tests: queries,
    decorator: {
      tag: "span",
      css: css.highlight,
    },
  });*/

  return (
    <div style={style} css={css.searchResult}>
      <img css={css.image} src={result.image} />
      <div css={css.content}>
        <div css={css.info}>
          <span css={css.title}>{result.title}</span>
          <Link css={css.link} to={result._id}>
            link
          </Link>
        </div>
        <div>{result.content}</div>
      </div>
      <ArtifactPanel doc={result} advanced={false} />
    </div>
  );
};
