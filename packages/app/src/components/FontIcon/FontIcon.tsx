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
  active?: boolean;
  disabled?: boolean;
  $css?: Partial<{
    [key in "fontIcon" | "disabled" | "active" | "icon" | "label"]: StyleType;
  }>;
  children?: ReactNode;
  onClick?: (event?: MouseEvent<HTMLSpanElement>) => void;
  onToggle?: (event?: MouseEvent<HTMLSpanElement>) => void;
}

/**
 * FontIcon functional component - Simple wrapper for material icons https://fonts.google.com/icons
 */
export function FontIcon({
  type,
  disabled = false,
  active = true,
  $css,
  children,
  onClick,
  onToggle,
}: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    fontIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      //marginRight: spacing,
      color: colors.fontIcon.default,
      cursor: "default",
      "&[data-disabled=false][data-toggled=true]": {
        color: colors.fontIcon.defaultActive,
        cursor: "pointer",
        "&:hover": {
          color: colors.fontIcon.defaultHover,
        },
      },
      "&[data-disabled=false][data-toggled=false]": {
        cursor: "pointer",
      },
    },
    icon: {
      fontSize: 24,
    },
    label: {
      color: colors.text.primary,
      marginLeft: spacing * 0.25,
    },
  }));

  return (
    <span
      css={[[css.fontIcon, $css?.fontIcon]]}
      data-disabled={disabled}
      data-toggled={active}
      onClick={
        !disabled
          ? (event: MouseEvent) => {
              //event.preventDefault();
              if (onClick) onClick();
            }
          : undefined
      }
      onMouseDown={
        !disabled
          ? (event: MouseEvent) => {
              event.preventDefault();
              if (onToggle) onToggle();
            }
          : undefined
      }
    >
      <span className="material-icons" css={[css.icon, $css?.icon]}>
        {type}
      </span>
      {children ? <span css={[css.label, $css?.label]}>{children}</span> : null}
    </span>
  );
}
