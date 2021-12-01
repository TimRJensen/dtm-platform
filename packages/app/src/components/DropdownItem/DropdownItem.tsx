/**
 * Vendor imports.
 */

import {
  useState,
  useEffect,
  useRef,
  ComponentProps,
  MutableRefObject,
} from "react";

/**
 * Custom imports.
 */

/**
 * Types.
 */
interface Props extends ComponentProps<"li"> {
  select?: MutableRefObject<Map<string | Element, unknown>>;
}

/**
 * DropdownItem functional component.
 */
export default function DropdownItem({ select, children, ...rest }: Props) {
  const [selected, setSelected] = useState(false);
  const element = useRef<HTMLLIElement>(null);

  const handleMouseOver = () => {
    if (select?.current.has("selected")) {
      (
        select.current.get(
          select.current.get("selected") as Element
        ) as Function
      )(false);
    }

    select?.current.set("selected", element.current);
    setSelected(true);
  };

  useEffect(() => {
    if (!element.current) {
      return;
    }

    element.current.setAttribute("data-selected", selected ? "true" : "false");
  }, [selected]);

  useEffect(() => {
    if (!element.current) {
      return;
    }

    console.log(select?.current);
    select?.current.set(element.current, setSelected);
  }, []);

  return (
    <li {...rest} ref={element} onMouseOver={handleMouseOver}>
      {children}
    </li>
  );
}
