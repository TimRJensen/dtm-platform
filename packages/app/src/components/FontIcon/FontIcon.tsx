/**
 * Vendor imports.
 */
import { MouseEvent, ReactNode } from "react";

/**
 * Custom imports.
 */
import styles from "./styles.module.scss";

/**
 * FontIcon functional component - Simple wrapper for material icons https://fonts.google.com/icons
 */
interface Props {
  type: string;
  active?: boolean;
  disabled?: boolean;
  styles?: { [key: string]: string };
  children?: ReactNode;
  onClick?: (event?: MouseEvent<HTMLSpanElement>) => void;
  onToggle?: (event?: MouseEvent<HTMLSpanElement>) => void;
}

export const FontIcon = function FontIcon({
  type,
  active = true,
  disabled = false,
  styles: _styles = styles,
  children,
  onClick,
  onToggle,
}: Props) {
  return (
    <span
      className={`${_styles.fontIcon} ${
        disabled ? _styles.disabled : active ? _styles.active : ""
      }`}
      onClick={(event: MouseEvent) => {
        event.preventDefault();
        if (onClick) onClick();
      }}
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault();
        if (onToggle) onToggle();
      }}
    >
      <span className="material-icons">{type}</span>
      {children ? <span className={_styles.label}>{children}</span> : null}
    </span>
  );
};
