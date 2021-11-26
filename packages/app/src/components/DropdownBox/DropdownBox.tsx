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
} from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";

/**
 * Types.
 */
interface Props {
  toggled: boolean | undefined;
  selected: number;
  onKeyDown: Dispatch<SetStateAction<number>>;
  children: ReactElement | ReactElement[];
}

/**
 * DropdownBox functional component.
 */
export default forwardRef<HTMLUListElement, Props>(function DropdownBox(
  { toggled, selected, children, onKeyDown, ...rest }: Props,
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

    onKeyDown(
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
