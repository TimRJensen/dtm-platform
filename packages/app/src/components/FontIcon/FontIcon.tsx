/**
 * Vendor imports.
 */
import { MouseEvent, ReactNode } from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";

/**
 * Types.
 */
type StyleType = ReturnType<typeof useCSS>["css"][string];

interface Props {
  type: string;
  size?: number;
  $css?: Partial<{
    [key in "fontIcon" | "icon" | "text"]: StyleType;
  }>;
  children?: ReactNode;
}

/**
 * FontIcon functional component - Simple wrapper for material icons https://fonts.google.com/icons
 */
export function FontIcon({ type, size = 24, $css, children }: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    fontIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "&[data-disabled]": {
        cursor: "pointer",
      },
    },
    icon: {
      fontSize: size,
    },
    text: {
      color: colors.text.primary,
      marginLeft: spacing * 0.25,
    },
  }));

  return (
    <span css={[[css.fontIcon, $css?.fontIcon]]}>
      <span className="material-icons" css={[css.icon, $css?.icon]}>
        {type}
      </span>
      {children ? <span css={[css.text, $css?.text]}>{children}</span> : null}
    </span>
  );
}
