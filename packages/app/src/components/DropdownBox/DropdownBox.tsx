/**
 * Vendor imports.
 */
import {
  forwardRef,
  cloneElement,
  Children,
  MutableRefObject,
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
  select: MutableRefObject<Map<string | Element, unknown>>;
  children: ReactElement | ReactElement[];
}

/**
 * DropdownBox functional component.
 */
export default forwardRef<HTMLUListElement, Props>(function DropdownBox(
  { toggled, children, select, ...rest }: Props,
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

  return (
    <ul {...rest} css={css.box} ref={ref} data-toggled={toggled}>
      {Children.map(children, (item) => cloneElement(item, { select }))}
    </ul>
  );
});
