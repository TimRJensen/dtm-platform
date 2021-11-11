/**
 * Vendor imports.
 */
import { ReactNode } from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";

/**
 * Types.
 */
interface Props {
  children?: ReactNode;
}

/**
 * InfoPanel functional component.
 */
export default function InfoPanel({ children }: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    panel: {
      gridArea: "panel",
      display: "flex",
      flexFlow: "column",
      height: "fit-content",
      borderLeft: `1px solid ${colors.primary}`,
      padding: spacing,
    },
  }));

  return <div css={css.panel}>{children}</div>;
}
