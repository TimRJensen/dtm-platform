/**
 * Vendor imports.
 */
import {
  forwardRef,
  cloneElement,
  Children,
  Dispatch,
  SetStateAction,
  MouseEvent,
  ReactElement,
  ComponentProps,
} from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";

/**
 * Types.
 */
interface Props extends ComponentProps<"ul"> {
  toggled: boolean | undefined;
  selected: number;
  select: Dispatch<SetStateAction<number>>;
  children: ReactElement | ReactElement[];
}

/**
 * DropdownBox functional component.
 */
export default forwardRef<HTMLUListElement, Props>(function DropdownBox(
  { toggled, selected, children, select, ...rest }: Props,
  ref
) {
  const { css } = useCSS(({}) => ({
    box: {
      display: "none",
      visibility: "hidden",
      width: "inherit",
      position: "absolute",
      margin: 0,
      padding: 0,
      overflow: "hidden",
      overflowY: "auto",
      listStyleType: "none",
      backgroundColor: "#FFF",
      zIndex: 1,
      "&[data-toggled=true]": {
        display: "block",
        visibility: "visible",
      },
    },
  }));

  const handleMouseOver = (event: MouseEvent) => {
    if (!ref || typeof ref === "function") return;

    select(
      Array.from(ref.current?.children!).indexOf(event.target as HTMLElement)
    );
  };

  return (
    <ul
      {...rest}
      css={css.box}
      ref={ref}
      data-toggled={toggled}
      onMouseOver={handleMouseOver}
    >
      {Children.map(children, (item, i) =>
        cloneElement(item, { "data-selected": selected === i ? true : "" })
      )}
    </ul>
  );
});
