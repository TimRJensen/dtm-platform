/**
 * Vendor imports.
 */

import { ComponentProps } from "react";

/**
 * Custom imports.
 */

/**
 * Types.
 */
interface Props extends ComponentProps<"li"> {}

/**
 * DropdownItem functional component.
 */
export default function DropdownItem({ children, ...rest }: Props) {
  return <li {...rest}>{children}</li>;
}
