/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { ReactNode } from "react";
import styles from "./styles.module.scss";

/**
 * ArtifactPanel functional component.
 */
interface Props {
  title?: string;
  children?: ReactNode;
}

export const ArtifactInfo = function ArtifactInfo({ title, children }: Props) {
  return (
    <div className={styles.artifactInfo}>
      <div className={styles.title}>{title ? title : ""}</div>
      <div className={styles.content}>
        {Array.isArray(children)
          ? children.map((child) => child)
          : children
          ? children
          : ""}
      </div>
    </div>
  );
};
