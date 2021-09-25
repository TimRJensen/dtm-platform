/**
 * Vendor imports.
 */

import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import styles from "./styles.module.scss";

/**
 * ArtifactTag funtioncal component.
 */
interface Props {
  children: string;
}

export const ArtifactTag = function ArtifactTag({ children }: Props) {
  return (
    <Link
      className={styles.artifactTag}
      to={`/search/${children.split(" ").join("+")}/page=0`}
    >
      {children}
    </Link>
  );
};
