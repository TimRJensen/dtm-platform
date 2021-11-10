/**
 * Vendor imports.
 */
import { ReactNode, MouseEvent } from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";

/**
 * Types.
 */
interface Props {
  $css?: {
    button: ReturnType<typeof useCSS>["css"][string];
  };
  type?: "default" | "accept" | "transparent";
  toggled?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onToggle?: () => void;
  children?: ReactNode;
}

/**
 * Button functional component.
 */
export function Button({
  $css,
  type = "default",
  disabled = false,
  toggled,
  onClick,
  onToggle,
  children,
  ...rest
}: Props) {
  const { css } = useCSS(({ borderRadius, colors }) => ({
    button: {
      height: 25,
      width: 90,
      outline: "none",
      border: "none",
      padding: 0,
      backgroundColor: colors.button[type],
      borderRadius: borderRadius / 2,
      color: colors.text.secondary,
      "&[data-disabled=false]:hover": {
        backgroundColor: colors.button[`${type}Hover`],
        cursor: "pointer",
      },
      "&[data-disabled=true]": {
        backgroundColor: colors.button[`${type}Disabled`],
        color: colors.text.disabled,
      },
      "&[data-toggled=false]": {
        backgroundColor: colors.button[`${type}Disabled`],
        color: colors.text.disabled,
      },
    },
  }));

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    const { navigate, href } = rest as {
      navigate: (href: string) => void;
      href: string;
    };

    if (navigate) {
      navigate(href ?? "/");
    }
  };

  const handleToggle = (event: MouseEvent) => {
    event.preventDefault();

    if (onToggle) {
      onToggle();
    }
  };

  return (
    <button
      css={[css.button, $css?.button]}
      onClick={!disabled ? handleClick : undefined}
      onMouseDown={!disabled ? handleToggle : undefined}
      data-disabled={disabled}
      data-toggled={toggled}
    >
      {children}
    </button>
  );
}
