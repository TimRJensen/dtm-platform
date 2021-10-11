/**
 * Vendor imports.
 */
import { Link } from "react-router-dom";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { Theme } from "../../themes/dtm";
import { BlogDocument } from "db";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const {
    spacing,
    colors,
    sizes: { artifactCard },
  } = theme;

  return {
    artifactCard: css({
      display: "inline-flex",
      flexFlow: "column",
      marginBottom: spacing,
      height: artifactCard.height,
      width: artifactCard.width,
      textDecoration: "none",
      "&:hover :last-child": {
        backgroundColor: colors.secondary,
      },
    }),
    image: css({
      borderRadius: `${spacing}px ${spacing}px 0 0`,
    }),
    info: css({
      padding: spacing,
      borderRadius: `0 0 ${spacing}px ${spacing}px`,
      backgroundColor: colors.primary,
      color: colors.text.secondary,
      "& :first-of-type": {
        fontSize: "1.4rem",
      },
    }),
  };
};

/**
 * ArtifactCard functional component.
 */
interface Props {
  doc: BlogDocument;
}

export const GridItem = function GridItem({ doc }: Props) {
  if (!doc) return null;

  const css = _css(useTheme() as Theme);

  return (
    <Link to={doc._id} css={css.artifactCard}>
      <img css={css.image} src={doc.artifact.image} />
      <div css={css.info}>
        <div>{doc.artifact.title}</div>
        <div>{doc.artifact.period}</div>
        <div>{`${doc.artifact.category.base.label} - ${doc.artifact.category.sub.label}`}</div>
      </div>
    </Link>
  );
};
