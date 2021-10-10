/**
 * Vendor imports.
 */
import { useState } from "react";

/**
 * Custom imports.
 */
import { BlogDocument } from "db";
import { ArtifactCard } from "../ArtifactCard/ArtifactCard";
import styles from "./styles.module.scss";

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
 * GridBox functional component.
 */
interface Props {
  docs: BlogDocument[];
}

export const GridBox = function GridBox({ docs }: Props) {
  const { isLoading, onLoad } = useOnLoad(docs);
  const numberOfColumns = 3;
  let column = 0;

  return (
    <section className={styles.grid}>
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
            className={styles.column}
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
