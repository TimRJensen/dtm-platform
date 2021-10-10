/**
 * Vendor imports.
 */
import { useState } from "react";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { BlogDocument } from "db";
import { Theme } from "../../themes/dtm";
import { ArtifactCard } from "../ArtifactCard/ArtifactCard";

/**
 * useOnLoad
 */
function useOnLoad(docs: BlogDocument[]) {
  const [isLoading, setIsLoading] = useState(true);
  let loaded = 0;

  return {
    isLoading: (flag?: boolean) => {
      if (flag === undefined) return isLoading;

      setIsLoading(flag);
    },
    onLoad: () => {
      if (++loaded === docs.length) setIsLoading(false);
    },
  };
}

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
}

export const GridBox = function GridBox({ docs }: Props) {
  const css = _css(useTheme() as Theme);
  const { isLoading, onLoad } = useOnLoad(docs);
  const numberOfColumns = 3;
  let column = 0;

  return (
    <section css={css.grid}>
      {docs
        .reduce((result, doc) => {
          if (!result[column]) result[column] = [];

          result[column].push(doc);

          if (++column === numberOfColumns) column = 0;

          return result;
        }, [] as BlogDocument[][])
        .map((column, i) => (
          <div
            key={`grid-column-${i}`}
            css={css.column}
            style={{ display: isLoading() ? "none" : "flex" }}
            onLoad={onLoad}
          >
            {column.map((doc) => (
              <ArtifactCard key={`artifact-card-${doc._id}`} doc={doc} />
            ))}
          </div>
        ))}
    </section>
  );
};
