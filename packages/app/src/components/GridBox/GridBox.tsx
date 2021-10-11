/**
 * Vendor imports.
 */
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { BlogDocument } from "db";
import { Theme } from "../../themes/dtm";
import { GridItem } from "../GridItem/GridItem";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const {
    spacing,
    sizes: { artifactCard },
  } = theme;

  return {
    grid: css({
      display: "flex",
      margin: `${2 * spacing}px auto 0 auto`,
    }),
    column: css({
      display: "flex",
      flexFlow: "column",
      width: artifactCard.width,
      height: "auto",
      marginRight: spacing,
    }),
  };
};

/**
 * GridBox functional component.
 */
interface Props {
  docs: BlogDocument[];
  columns?: number;
  style?: { display: string };
}

export const GridBox = function GridBox({ docs, columns = 3, style }: Props) {
  if (docs.length === 0) return null;

  const theme = useTheme() as Theme;
  const css = _css(theme);
  let column = 0;

  return (
    <section css={css.grid}>
      {docs
        .reduce((result, doc) => {
          if (!result[column]) result[column] = [];

          result[column].push(doc);

          if (++column === columns) column = 0;

          return result;
        }, [] as BlogDocument[][])
        .map((column, i) => (
          <div key={`grid-column-${i}`} style={style} css={css.column}>
            {column.map((doc) => (
              <GridItem key={`artifact-card-${doc._id}`} doc={doc} />
            ))}
          </div>
        ))}
    </section>
  );
};
