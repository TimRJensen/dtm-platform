/**
 * Vendor imports.
 */
import { useState, useRef, ReactNode, ReactElement } from "react";

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
      left: 0,
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

  const handleToggle = () => {
    if (!toggled) {
      const element = dropdownElement.current;
      const items = element?.children[1] as HTMLDivElement;

      if (items) {
        items.style.left = `${element?.getBoundingClientRect()?.left}px`;
      }

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
