/**
 * Vendor imports.
 */
import { MouseEvent, ReactNode } from "react";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { Theme } from "../../themes/dtm";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const { spacing, colors } = theme;

  return {
    fontIcon: css({
      display: "flex",
      alignItems: "center",
      marginRight: spacing,
      color: colors.fontIcon.default,
      cursor: "pointer",
    }),
    active: css({
      color: colors.fontIcon.defaultActive,
      "&:hover": {
        color: colors.fontIcon.defaultHover,
      },
    }),
    disabled: css({
      cursor: "default",
    }),
    icon: css({
      fontSize: 24,
    }),
    label: css({
      color: colors.text.primary,
      marginLeft: spacing * 0.25,
    }),
  };
};

/**
 * FontIcon functional component - Simple wrapper for material icons https://fonts.google.com/icons
 */
interface Props {
  type: string;
  active?: boolean;
  disabled?: boolean;
  $css?: Partial<ReturnType<typeof _css>>;
  children?: ReactNode;
  onClick?: (event?: MouseEvent<HTMLSpanElement>) => void;
  onToggle?: (event?: MouseEvent<HTMLSpanElement>) => void;
}

export const FontIcon = function FontIcon({
  type,
  active = true,
  disabled = false,
  $css,
  children,
  onClick,
  onToggle,
}: Props) {
  const css = _css(useTheme() as Theme);

  return (
    <span
      css={[
        [css.fontIcon, $css?.fontIcon],
        disabled
          ? [css.disabled, $css?.disabled]
          : active
          ? [css.active, $css?.active]
          : {},
      ]}
      onClick={(event: MouseEvent) => {
        event.preventDefault();
        if (onClick) onClick();
      }}
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault();
        if (onToggle) onToggle();
      }}
    >
      <span className="material-icons" css={[css.icon, $css?.icon]}>
        {type}
      </span>
      {children ? <span css={[css.label, $css?.label]}>{children}</span> : null}
    </span>
  );
};
