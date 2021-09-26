/**
 * Vendor imports.
 */

import { MouseEvent, ReactNode } from "react";

/**
 * Custom imports.
 */
import styles from "./styles.module.scss";

/**
 * TextEditorControlButton functional component.
 */
interface Props {
  onToggle: () => void;
  active?: boolean;
  children?: ReactNode;
}

export const TextEditorControlButton = function TextEditorControlButton({
  onToggle,
  active = false,
  children,
}: Props) {
  const handleMouseDown = (event: MouseEvent) => {
    event.preventDefault();

    if (onToggle) onToggle();
  };

  return (
    <span
      className={`material-icons ${styles.textEditorControlButton} ${
        active ? styles.active : ""
      }`}
      onMouseDown={handleMouseDown}
    >
      {children ? children : ""}
    </span>
  );
};
