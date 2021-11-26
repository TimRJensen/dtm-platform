/**
 * Vendor imports.
 */
import { HTMLAttributes, ReactNode } from "react";

/**
 * Custom imports.
 */
import { useCSS, PropertyValueType } from "../../hooks";

/**
 * Types.
 */
interface Props extends HTMLAttributes<HTMLSpanElement> {
  $css?: Partial<{
    [key in "fontIcon" | "icon" | "text"]: PropertyValueType;
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
  ...rest
}: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    fontIcon: [
      {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      $css.fontIcon,
    ],
    icon: [
      {
        fontSize: size,
        zIndex: 0,
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
    <span css={css.fontIcon} {...rest}>
      <span className="material-icons" css={css.icon}>
        {type}
      </span>
      {children ? <span css={css.text}>{children}</span> : null}
    </span>
  );
}
