/**
 * Vendor imports.
 */
import {
  ReactNode,
  MouseEvent,
  RefObject,
  forwardRef,
  HTMLAttributes,
} from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";

/**
 * Types.
 */
interface Props extends HTMLAttributes<HTMLButtonElement> {
  type?: "default" | "accept" | "transparent";
  disabled?: boolean;
  toggled?: boolean;
  element?: RefObject<HTMLButtonElement>;
  onToggle?: (event: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}

/**
 * Button functional component.
 */
export default forwardRef<HTMLButtonElement, Props>(function Button(
  {
    type = "default",
    disabled,
    toggled,
    onClick,
    onToggle,
    children,
    ...rest
  }: Props,
  ref
) {
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
      cursor: "pointer",
      "&:hover": {
        backgroundColor: colors.button[`${type}Hover`],
      },
      "&[data-disabled=true]": {
        backgroundColor: colors.button[`${type}Disabled`],
        color: colors.text.disabled,
        cursor: "default",
        "&:hover, &:focus": {
          backgroundColor: colors.button[`${type}Disabled`],
          color: colors.text.disabled,
        },
      },
      "&[data-toggled=false]": {
        backgroundColor: colors.button[`${type}Disabled`],
        color: colors.text.disabled,
      },
    },
  }));

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (onToggle) {
      onToggle(event);
    }
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      {...rest}
      css={css.button}
      data-disabled={disabled}
      data-toggled={toggled ?? ""}
      ref={ref}
      onClick={!disabled ? handleClick : undefined}
      onMouseDown={!disabled ? handleToggle : undefined}
    >
      {children}
    </button>
  );
});
