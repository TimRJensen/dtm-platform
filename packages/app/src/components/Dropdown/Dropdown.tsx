/**
 * Vendor imports.
 */
import {
  useState,
  useRef,
  ReactNode,
  ReactElement,
  useLayoutEffect,
} from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";

/**
 * Types.
 */
interface Props {
  $css?: {
    dropdown?: ReturnType<typeof useCSS>["css"][string];
    label?: ReturnType<typeof useCSS>["css"][string];
    items?: ReturnType<typeof useCSS>["css"][string];
  };
  label: ReactElement | string;
  direction?: "down" | "left" | "right";
  focusable?: boolean;
  conditional?: boolean;
  children?: ReactNode;
  props?: any;
}

/**
 * Dropdown functional component.
 */
export default function Dropdown({
  $css,
  label,
  direction = "down",
  conditional = true,
  focusable = false,
  children,
  ...props
}: Props) {
  const { css } = useCSS(({ spacing }) => ({
    dropdown: {},
    items: {
      display: "none",
      visibility: "hidden",
      width: "inherit",
      position: "absolute",
      padding: `0 0 ${spacing}px 0`,
      backgroundColor: "#FFF",
      "&[data-toggled=true]": {
        display: "block",
        visibility: "visible",
      },
    },
  }));
  const [toggled, setToggled] = useState(false);
  const dropdownElement = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!toggled) return;

    const element = dropdownElement.current!;
    const items = element.children[1] as HTMLDivElement;

    switch (direction) {
      case "left": {
        const top = window.scrollY + element.getBoundingClientRect().top;
        const right =
          element.getBoundingClientRect().left -
          items.getBoundingClientRect().width;

        items.style.top = top + "px";
        items.style.left = right + "px";
        break;
      }
      case "right": {
        const top = window.scrollY + element.getBoundingClientRect().top;
        const left = element.getBoundingClientRect().right;

        items.style.top = top + "px";
        items.style.left = left + "px";
        break;
      }
      default: {
        items.style.left = element.getBoundingClientRect().left + "px";
      }
    }
  }, [toggled]);

  const handleToggle = () => {
    if (!toggled) {
      setToggled(true);
    } else {
      dropdownElement.current?.blur();
      setToggled(false);
    }
  };

  return (
    <div
      css={[css.dropdown, $css?.dropdown]}
      tabIndex={focusable ? 0 : -1}
      ref={dropdownElement}
      onMouseDown={(event) => {
        if (document.activeElement === dropdownElement.current) {
          event.preventDefault();
        }
        handleToggle();
      }}
      onFocus={() => {
        if (!toggled) {
          handleToggle();
        }
      }}
      onBlur={() => setToggled(false)}
      data-toggled={conditional && toggled}
      {...props}
    >
      {typeof label === "string" ? <div css={$css?.label}>{label}</div> : label}
      <div css={[css.items, $css?.items]} data-toggled={conditional && toggled}>
        {children}
      </div>
    </div>
  );
}
