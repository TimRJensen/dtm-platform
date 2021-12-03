/**
 * Vendor imports.
 */

import { useRef, ComponentProps, MutableRefObject } from "react";

/**
 * Custom imports.
 */

/**
 * Types.
 */
interface Props extends ComponentProps<"li"> {
  select?: MutableRefObject<HTMLLIElement | null>;
}

/**
 * DropdownItem functional component.
 */
export default function DropdownItem({ select, children, ...rest }: Props) {
  const element = useRef<HTMLLIElement>(null);

  const handleMouseOver = () => {
    if (select) {
      if (select.current) {
        select.current.dataset.selected = "false";
      }

      select.current = element.current;
    }

    element.current!.dataset.selected = "true";
  };

  const handleMouseOut = () => {
    //element.current!.dataset.selected = "false";
  };

  return (
    <li
      {...rest}
      ref={element}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {children}
    </li>
  );
}
