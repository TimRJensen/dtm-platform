/**
 * Vendor imports.
 */
import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { BlogDocument } from "db";
import styles from "./styles.module.scss";

/**
 * ArtifactCard functional component.
 */
interface Props {
  doc: BlogDocument;
}

export const ArtifactCard = function ArtifactCard({ doc }: Props) {
  return (
    <Link to={doc._id} className={styles.artifactCard}>
      <img className={styles.image} src={doc.artifact.image} />
      <div className={styles.info}>
        <div>{doc.artifact.title}</div>
        <div>{doc.artifact.period}</div>
        <div>{`${doc.artifact.category.base.label} - ${doc.artifact.category.sub.label}`}</div>
      </div>
    </Link>
  );
};
