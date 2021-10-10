/**
 * Vendor imports.
 */
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { Theme } from "../../themes/dtm";
import { ArtifactDocument } from "db";
import { ArtifactInfo } from "../ArtifactInfo/ArtifactInfo";
import { ArtifactTag } from "../ArtifactTag/ArtifactTag";
import { FontIcon } from "../FontIcon/FontIcon";

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
      width: `${blog.width * 0.8}vw`,
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
      maxWidth: `${blog.width * 0.5}vw`,
      padding: spacing,
      marginRight: 2 * spacing,
      fontSize: "1.25rem",
    }),
    panel: css({
      width: `${blog.width * 0.1}vw`,
      borderLeft: `1px solid ${colors.primary}`,
      padding: spacing,
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
        <div css={css.panel}>
          <ArtifactInfo title="Period:">{doc.period}</ArtifactInfo>
          <ArtifactInfo title="Tags:">
            {doc.tags.map((tag) => (
              <ArtifactTag key={`artifact-tag-${tag}`}>{tag}</ArtifactTag>
            ))}
          </ArtifactInfo>
          <FontIcon type="chat_bubble" onClick={onComment}>
            comment
          </FontIcon>
        </div>
      </div>
    </section>
  );
};
