/**
 * Vendor imports.
 */
import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { ArtifactType } from "db";
import { useCSS, useLocale } from "../../hooks";
import InfoPanel from "../InfoPanel/InfoPanel";
import InfoPanelItem from "../InfoPanelItem/InfoPanelItem";
/*import { useDecorateNode } from "../../hooks/";
import { TextBox } from "../TextBox/TextBox";*/

/**
 * Types.
 */
interface Props {
  query: string;
  result: ArtifactType;
  style?: any;
}

/**
 * SearchResult functional component.
 */
export default function SearchResult({ /*queries,*/ result, style }: Props) {
  const { locale } = useLocale("dk/DK");
  const { css } = useCSS(({ spacing, borderRadius, colors }) => ({
    searchResult: {
      display: "grid",
      gridTemplateAreas: `
        "image info panel" 
        "image content panel"`,
      gridTemplateColumns: `300px minmax(400px, 3fr) minmax(100px, 1fr)`,
      gridTemplateRows: "1.5rem auto",
      columnGap: spacing * 2,
      width: `clamp(768px, 80vw, 100%)`,
      margin: `0 auto ${spacing * 3}px auto`,
    },
    image: {
      gridArea: "image",
      width: "100%",
      borderRadius,
    },
    info: {
      gridArea: "info",
      display: "flex",
      alignItems: "center",
      borderBottom: `1px solid ${colors.primary}`,
    },
    title: {
      gridArea: "title",
      fontSize: "1.333rem",
    },
    link: {
      gridArea: "link",
      margin: "0 0 0 auto",
      color: colors.text.link,
    },
    content: {
      gridArea: "content",
    },
  }));
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
      <div css={css.info}>
        <span css={css.title}>{result.label}</span>
        <Link css={css.link} to={`/blogs/${result.blog.id}`}>
          link
        </Link>
      </div>
      <div css={css.content}>{result.content}</div>
      <InfoPanel>
        <InfoPanelItem title={locale.components.SearchResultPanel.mainCategory}>
          {result.mainCategory.label}
        </InfoPanelItem>
        <InfoPanelItem title={locale.components.SearchResultPanel.subCategory}>
          {result.subCategory.label}
        </InfoPanelItem>
        <InfoPanelItem title={locale.components.SearchResultPanel.period}>
          {result.period.join(" - ")}
        </InfoPanelItem>
      </InfoPanel>
    </div>
  );
}
