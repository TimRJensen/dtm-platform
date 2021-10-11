/**
 * Vendor imports.
 */
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { Theme } from "../../themes/dtm";
import { ArtifactDocument } from "db";
import { ArtifactPanel } from "../ArtifactPanel/ArtifactPanel";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const {
    spacing,
    borderRadius,
    colors,
    sizes: { blog },
  } = theme;

  return {
    artifact: css({
      width: `${blog.width * 0.7}vw`,
      margin: "auto",
      marginBottom: 2 * spacing,
      padding: spacing,
    }),
    title: css({
      margin: "auto",
      fontSize: "3rem",
      textAlign: "center",
    }),
    body: css({ display: "flex" }),
    image: css({
      minWidth: `${blog.width * 0.2}vw`,
      height: "100%",
      marginRight: spacing,
      borderRadius,
    }),
    content: css({
      padding: spacing,
      marginRight: 2 * spacing,
      fontSize: "1.25rem",
    }),
  };
};

/**
 * Artifact functional component.
 */
interface Props {
  doc: ArtifactDocument;
  onComment: () => void;
}

export const Artifact = function Artifact({ doc, onComment }: Props) {
  const css = _css(useTheme() as Theme);

  return (
    <section css={css.artifact}>
      <div css={css.title}>{doc.title}</div>
      <div css={css.body}>
        <img css={css.image} src={doc.image} />
        <div css={css.content}>{doc.content}</div>
        <ArtifactPanel doc={doc} onComment={onComment} />
      </div>
    </section>
  );
};
