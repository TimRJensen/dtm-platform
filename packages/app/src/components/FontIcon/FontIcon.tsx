/**
 * Vendor imports.
 */
import { MouseEvent, ReactNode } from "react";

/**
 * Custom imports.
 */

/**
 * FontIcon functional component - Simple wrapper for material icons https://fonts.google.com/icons
 */
interface Props {
  className?: string;
  children?: ReactNode;
  onClick?: (event?: MouseEvent<HTMLSpanElement>) => void;
}

export const FontIcon = function FontIcon({
  className,
  children,
  onClick,
}: Props) {
  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();

    if (onClick) onClick(event);
  };

  return (
    <span className={`material-icons ${className}`} onClick={handleClick}>
      {children}
    </span>
  );
};
