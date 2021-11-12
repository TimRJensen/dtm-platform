/**
 * Vendor imports.
 */
import {
  useState,
  useLayoutEffect,
  useRef,
  cloneElement,
  ReactNode,
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
  $css?: {
    dropdown?: ReturnType<typeof useCSS>["css"][string];
    label?: ReturnType<typeof useCSS>["css"][string];
    items?: ReturnType<typeof useCSS>["css"][string];
  };
  label: ReactElement | string;
  direction?: "down" | "left" | "right";
  focusable?: boolean;
  disabled?: boolean;
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
  disabled = false,
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
      cursor: "default",
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

    if (!items) {
      return;
    }

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
      tabIndex={focusable ? 0 : undefined}
      ref={dropdownElement}
      onClick={!disabled ? handleToggle : undefined}
      onBlur={() => setToggled(false)}
      data-toggled={children && toggled}
      {...props}
    >
      {typeof label === "string" ? (
        <div css={$css?.label}>{label}</div>
      ) : (
        cloneElement(label, { ...label.props, disabled })
      )}

      <div css={[css.items, $css?.items]} data-toggled={children && toggled}>
        {children}
      </div>
    </div>
  );
}
