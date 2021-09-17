/**
 * Vendor imports.
 */

import { ReactElement } from "react";

/**
 * Custom imports.
 */

/**
 * IfThen functional component.
 */
interface Props {
  condition: boolean | boolean[];
  children: [ReactElement, ReactElement];
}

export const IfThen = function IfThen({ condition, children }: Props) {
  if (
    (Array.isArray(condition) && condition.every((flag) => flag === true)) ||
    condition
  ) {
    return children[0];
  }

  return children[1];
};
