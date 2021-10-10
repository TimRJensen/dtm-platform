/**
 * Vendor imports.
 */
import { Link } from "react-router-dom";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { Theme } from "../../themes/dtm";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const { spacing, colors, borderRadius } = theme;

  return {
    artifactTag: css({
      display: "inline-block",
      margin: `0 ${0.5 * spacing}px ${0.5 * spacing}px 0`,
      padding: `0 ${spacing}px`,
      backgroundColor: colors.tag.default,
      borderRadius,
      color: colors.text.secondary,
      textAlign: "center",
      textDecoration: "none",
      "&:hover": {
        backgroundColor: colors.tag.defaultHover,
      },
    }),
  };
};

/**
 * ArtifactTag funtioncal component.
 */
interface Props {
  children: string;
}

export const ArtifactTag = function ArtifactTag({ children }: Props) {
  const css = _css(useTheme() as Theme);

  return (
    <Link
      css={css.artifactTag}
      to={`/search/${children.split(" ").join("+")}/page=0`}
    >
      {children}
    </Link>
  );
};
