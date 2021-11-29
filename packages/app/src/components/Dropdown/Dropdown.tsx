/**
 * Vendor imports.
 */
import {
  useState,
  useLayoutEffect,
  useRef,
  cloneElement,
  Children,
  ComponentProps,
  ReactElement,
  KeyboardEvent,
  MouseEvent,
  FocusEvent,
  ChangeEvent,
  ElementType,
  MutableRefObject,
} from "react";

/**
 * Custom imports.
 */
import { useCSS, PropertyValueType } from "../../hooks";
import DropdownBox from "../DropdownBox/DropdownBox";
import DropdownItem from "../DropdownItem/DropdownItem";

/**
 * Types.
 */
type Test<T extends ElementType> = ReactElement<ComponentProps<T>, T> & {
  ref?: MutableRefObject<HTMLElement>;
};

interface Props<T extends ElementType> extends ComponentProps<"div"> {
  $css?: Partial<{
    [key in "dropdown" | "label" | "box"]: PropertyValueType;
  }>;
  //label: jsx.JSX.Element;
  label: Test<T>;
  direction?: "down" | "left" | "right";
  disabled?: boolean;
  children: ReactElement | ReactElement[] | null | undefined;
  //persists?: boolean;
}

/**
 * Dropdown functional component.
 */
function Dropdown<T extends ElementType>({
  $css = {},
  label,
  direction = "down",
  //persists,
  disabled,
  children,
  ...rest
}: Props<T>) {
  const { css } = useCSS(({}) => ({
    dropdown: [
      { cursor: "default", position: "relative" },
      $css.dropdown ?? {},
    ],
    label: [$css.label ?? {}],
    box: [$css.box ?? {}],
  }));
  const [toggled, setToggled] = useState<boolean>();
  const [selected, setSelected] = useState(-1);

  const toggleElement = useRef<HTMLElement>();
  const boxElement = useRef<HTMLUListElement>(null);
  const focusType = useRef<"tab" | "click" | "none">("none");

  useLayoutEffect(() => {
    if (!children) {
      return;
    }

    const dropdown = toggleElement.current!.parentElement!;
    const box = boxElement.current!;

    switch (direction) {
      case "left": {
        box.style.top = "0px";
        box.style.left = `-${box.offsetWidth}px`;
        break;
      }

      case "right": {
        box.style.top = "0px";
        box.style.left = `${dropdown.offsetWidth}px`;
        break;
      }

      default: {
        box.style.left = `${-box.clientLeft}px`;
      }
    }
  }, [toggled]);

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!toggled) {
      return;
    }

    switch (event.key) {
      case "ArrowUp": {
        event.preventDefault();

        const i = selected > 0 ? selected - 1 : Children.count(children) - 1;
        const element = boxElement.current!;
        const item = element.children[i] as HTMLElement;

        if (i === Children.count(children) - 1) {
          element.scrollTop = element.scrollHeight;
        } else if (item.offsetTop < element.scrollTop) {
          element.scrollTop =
            item.offsetTop + item.offsetHeight - element.offsetHeight;
        }

        setSelected(i);

        break;
      }

      case "ArrowDown": {
        event.preventDefault();

        const i = selected < Children.count(children) - 1 ? selected + 1 : 0;
        const element = boxElement.current!;
        const item = element.children[i] as HTMLElement;

        if (i === 0) {
          element.scrollTop = 0;
        } else if (
          item.offsetTop + item.offsetHeight >
          element.offsetHeight + element.scrollTop
        ) {
          element.scrollTop = item.offsetTop;
        }

        setSelected(i);

        break;
      }

      case "Enter": {
        event.preventDefault();

        if (selected > -1) {
          const item = boxElement.current?.children.item(
            selected
          ) as HTMLElement;

          item.click();
        }

        break;
      }

      case "Escape": {
        toggleOff();
      }
    }
  };

  const handleToggle = (event: MouseEvent | FocusEvent) => {
    event.preventDefault();

    if (focusType.current !== "none") {
      return;
    }

    focusType.current = event.type === "mousedown" ? "click" : "tab";
    toggleElement.current?.focus();
  };

  const handleClick = (event: MouseEvent<any>) => {
    if (rest.onClick) {
      rest.onClick(event);
    }

    if (!toggled) {
      setToggled(!!children);
    } else {
      toggleOff();
    }
  };

  const handleFocus = () => {
    if (focusType.current === "tab") {
      setToggled(!!children);
    }
  };

  const handleChange = (
    callBack: (...args: any) => void = () => ({}),
    event: ChangeEvent
  ) => {
    if (callBack) {
      callBack(event, setToggled);
    }
  };

  const toggleOff = (persists = false) => {
    if (persists) {
      return;
    }

    focusType.current = "none";
    setToggled(undefined);
  };

  return (
    <div
      {...rest}
      css={css.dropdown}
      data-toggled={toggled ?? ""}
      {...(!disabled && {
        onMouseDown: handleToggle,
        onFocusCapture: handleToggle,
        onClick: handleClick,
        onFocus: handleFocus,
        onKeyDown: handleKeyPress,
        onBlur: toggleOff.bind(null, undefined),
      })}
    >
      {cloneElement<any>(label, {
        css: [css.label, label.props.css],
        ref: (element: HTMLElement) => {
          if (label.ref) {
            label.ref.current = element;
          }

          toggleElement.current = element;
        },
        "data-disabled": disabled,
        "data-toggled": toggled,
        onChange: handleChange.bind(null, label.props.onChange),
      })}
      {children ? (
        <DropdownBox
          css={css.box}
          ref={boxElement}
          toggled={toggled}
          selected={selected}
          select={setSelected}
        >
          {children}
        </DropdownBox>
      ) : null}
    </div>
  );
}

Dropdown.Item = DropdownItem;
export default Dropdown;
