/**
 * Vendor imports.
 */
import { ReactNode } from "react";
import { SerializedStyles } from "@emotion/react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";

/**
 * Types.
 */
interface Props {
  $css?: Partial<{
    [key in "fontIcon" | "icon" | "text"]: SerializedStyles | {};
  }>;
  type: string;
  size?: number;
  children?: ReactNode;
}

/**
 * FontIcon functional component - Simple wrapper for material icons https://fonts.google.com/icons
 */
export default function FontIcon({
  $css: $css = {},
  type,
  size = 24,
  children,
}: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    fontIcon: [
      {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&[data-disabled]": {
          cursor: "pointer",
        },
      },
      $css.fontIcon,
    ],
    icon: [
      {
        fontSize: size,
      },
      $css.icon,
    ],
    text: [
      {
        color: colors.text.primary,
        marginLeft: spacing * 0.25,
      },
      $css.text,
    ],
  }));

  return (
    <span css={css.fontIcon}>
      <span className="material-icons" css={css.icon}>
        {type}
      </span>
      {children ? <span css={css.text}>{children}</span> : null}
    </span>
  );
}
