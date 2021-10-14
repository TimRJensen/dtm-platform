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
  $css?: {
    button: ReturnType<typeof useCSS>["css"][string];
  };
  type?: "default" | "accept";
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

/**
 * Button functional component.
 */
export function Button({
  $css,
  type = "default",
  disabled = false,
  onClick,
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
        backgroundColor: colors.button.disabled,
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

  return (
    <button
      css={[css.button, $css?.button]}
      onClick={!disabled ? handleClick : undefined}
      data-disabled={disabled}
    >
      {children}
    </button>
  );
}
