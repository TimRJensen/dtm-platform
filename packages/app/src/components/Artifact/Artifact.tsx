/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { ArtifactDocument } from "db";
import { ArtifactInfo } from "../ArtifactInfo/ArtifactInfo";
import { ArtifactTag } from "../ArtifactTag/ArtifactTag";
import { FontIcon } from "../FontIcon/FontIcon";
import styles from "./styles.module.scss";

/**
 * Artifact functional component.
 */
interface Props {
  doc: ArtifactDocument;
  onComment: () => void;
}

export const Artifact = function Artifact({ doc, onComment }: Props) {
  return (
    <section className={styles.artifact}>
      <div className={styles.title}>{doc.title}</div>
      <div className={styles.body}>
        <img className={styles.image} src={doc.image} width="300px" />
        <div className={styles.content}>{doc.content}</div>
        <div className={styles.panel}>
          <ArtifactInfo title="Period:">{doc.period}</ArtifactInfo>
          <ArtifactInfo title="Tags:">
            {doc.tags.map((tag) => (
              <ArtifactTag key={`artifact-tag-${tag}`}>{tag}</ArtifactTag>
            ))}
          </ArtifactInfo>
          <FontIcon styles={styles} type="chat_bubble" onClick={onComment}>
            comment
          </FontIcon>
        </div>
      </div>
    </section>
  );
};
