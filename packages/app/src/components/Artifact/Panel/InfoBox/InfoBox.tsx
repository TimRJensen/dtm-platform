/**
 * Vendor imports.
 */
import { ReactNode, Children } from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../../../hooks";

/**
 * Types.
 */
interface Props {
  title?: string;
  children?: ReactNode;
}

/**
 * InfoBox functional component.
 */
export function InfoBox({ title, children }: Props) {
  const { css } = useCSS(({ spacing }) => ({
    artifactInfo: {
      marginBottom: 0.5 * spacing,
    },
    title: {},
    content: {
      display: "flex",
      flexWrap: "wrap",
      padding: 0.5 * spacing,
    },
  }));

  return (
    <div css={css.artifactInfo}>
      <div css={css.title}>{title ? title : ""}</div>
      <div css={css.content}>{Children.map(children, (child) => child)}</div>
    </div>
  );
}
