/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import { ArtifactType } from "db";
import { Panel } from "./Panel/Panel";

/**
 * Types.
 */
interface Props {
  doc: ArtifactType | undefined;
  onComment: () => void;
}

/**
 * Artifact functional component.
 */
export function Artifact({ doc, onComment }: Props) {
  if (!doc) return null;

  const { css } = useCSS(({ spacing, borderRadius }) => ({
    artifact: {
      display: "grid",
      gridTemplateColumns: `minmax(200px, 1.5fr) minmax(400px, 3fr) minmax(100px, 1fr)`,
      gridTemplateAreas: `
      "title title title" 
      "image content panel"`,
      width: `clamp(768px, 80vw, 100%)`,
      margin: `${2 * spacing}px auto ${2 * spacing}px auto`,
      padding: spacing,
    },
    title: {
      gridArea: "title",
      margin: `0 auto ${2 * spacing}px auto`,
      fontSize: "3rem",
      textAlign: "center",
    },
    image: {
      gridArea: "image",
      width: "100%",
      borderRadius,
    },
    content: {
      gridArea: "content",
      padding: spacing,
      fontSize: "1.25rem",
    },
  }));

  return (
    <section css={css.artifact}>
      <div css={css.title}>{doc.label}</div>
      <img css={css.image} src={doc.image} />
      <div css={css.content}>{doc.content}</div>
      <Panel doc={doc} onComment={onComment} />
    </section>
  );
}
