/**
 * Vendor imports.
 */
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { Theme } from "../../themes/dtm";
import { ReactNode } from "react";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const { spacing } = theme;

  return {
    artifactInfo: css({
      marginBottom: 0.5 * spacing,
    }),
    title: {},
    content: css({
      display: "flex",
      flexWrap: "wrap",
      padding: 0.5 * spacing,
    }),
  };
};

/**
 * ArtifactPanel functional component.
 */
interface Props {
  title?: string;
  children?: ReactNode;
}

export const ArtifactInfo = function ArtifactInfo({ title, children }: Props) {
  const css = _css(useTheme() as Theme);

  return (
    <div css={css.artifactInfo}>
      <div css={css.title}>{title ? title : ""}</div>
      <div css={css.content}>
        {Array.isArray(children)
          ? children.map((child) => child)
          : children
          ? children
          : ""}
      </div>
    </div>
  );
};
