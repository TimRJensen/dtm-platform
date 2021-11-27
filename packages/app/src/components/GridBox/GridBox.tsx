/**
 * Vendor imports.
 */
import { useState, useEffect, useRef } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

/**
 * Custom imports.
 */
import { GridItemType } from "db";
import { useCSS } from "../../hooks";
import GridItem from "../GridItem/GridItem";

/**
 * Types.
 */
interface Props {
  docs: GridItemType[] | undefined;
  columns?: number;
  onLoad?: () => void;
}

/**
 * GridBox functional component.
 */
export default function GridBox({ docs, columns = 3, onLoad }: Props) {
  if (!docs) {
    return null;
  }

  const { css, theme } = useCSS(({ spacing }) => ({
    grid: {
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, 300px)`,
      gridAutoRows: 50,
      gridAutoFlow: "dense",
      justifyItems: "center",
      //justifyContent: "center",
      columnGap: spacing,
      rowGap: spacing,
      width: `clamp(300px, 80vw, ${columns} * 300px + ${
        columns - 1
      } * ${spacing}px)`,
      margin: `${2 * spacing}px auto 100px auto`,
    },
    loader: {
      display: "flex",
      justifyContent: "center",
      alignSelf: "center",
      gridColumn: "1 / -1",
      zIndex: -1,
    },
  }));
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const loaded = useRef(0);

  useEffect(() => {
    if (docs[0]) {
      setGridItems([...gridItems, ...docs]);
    }

    return () => setLoading(true);
  }, [docs]);

  const handleLoad = () => {
    loaded.current++;

    if (loaded.current === docs.length) {
      if (onLoad) {
        onLoad();
      }

      setLoading(false);
      loaded.current = 0;
    }
  };

  return (
    <section css={css.grid} onLoad={handleLoad}>
      {gridItems.map((doc, i) =>
        i < gridItems.length - docs.length ? (
          <GridItem key={`grid-item-${doc.id}`} doc={doc} />
        ) : (
          <GridItem key={`grid-item-${doc.id}`} doc={doc} toggled={!loading} />
        )
      )}
      {loading ? (
        <div css={css.loader}>
          <PacmanLoader color={theme.colors.secondary} />
        </div>
      ) : null}
    </section>
  );
}
