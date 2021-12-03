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
  label: Test<T>;
  direction?: "down" | "left" | "right";
  //persists?: boolean;
  disabled?: boolean;
  children: ReactElement | ReactElement[] | null | undefined;
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

  const toggleElement = useRef<HTMLElement>();
  const boxElement = useRef<HTMLUListElement>(null);
  const focusType = useRef<"tab" | "click" | "none">("none");
  //const selected = useRef(new Map<HTMLLIElement | "selected", unknown>());
  const _selected = useRef<HTMLLIElement>();

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

    if (_selected.current) {
      box.scrollTop = _selected.current.offsetTop;
    }
  }, [toggled]);

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!children) {
      return;
    }

    switch (event.key) {
      case "ArrowUp": {
        if (label.props.onChange && !toggled) {
          return;
        }

        event.preventDefault();

        const box = boxElement.current!;
        const items = Array.from(box.children);
        const nextItem = (_selected.current?.previousElementSibling ??
          box.lastElementChild) as HTMLLIElement;

        const child = Children.toArray(children)[
          items.indexOf(nextItem!)
        ] as ReactElement;

        if (child.props.onKeyDown) {
          child.props.onKeyDown(event);
        }

        if (_selected.current) {
          _selected.current.dataset.selected = "false";
        }

        _selected.current = nextItem;
        nextItem.dataset.selected = "true";

        break;
      }

      case "ArrowDown": {
        if (label.props.onChange && !toggled) {
          return;
        }

        event.preventDefault();

        const box = boxElement.current!;
        const items = Array.from(box.children);
        const nextItem = (_selected.current?.nextElementSibling ??
          box.firstElementChild) as HTMLLIElement;

        const child = Children.toArray(children)[
          items.indexOf(nextItem!)
        ] as ReactElement;

        if (child.props.onKeyDown) {
          child.props.onKeyDown(event);
        }

        if (_selected.current) {
          _selected.current.dataset.selected = "false";
        }

        _selected.current = nextItem;
        nextItem.dataset.selected = "true";

        break;
      }

      case "Enter": {
        if (_selected.current && toggled) {
          event.preventDefault();
          _selected.current.click();
        }

        break;
      }

      case "Escape": {
        toggleOff();
      }
    }
  };

  const handleToggle = (event: MouseEvent | FocusEvent) => {
    if (focusType.current !== "none") {
      event.preventDefault();
      return;
    }

    focusType.current = event.type === "mousedown" ? "click" : "tab";
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

  const handleChange = (event: ChangeEvent) => {
    if (label.props.onChange) {
      label.props.onChange(event, setToggled);
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
        onChange: handleChange,
      })}
      {children ? (
        <DropdownBox
          css={css.box}
          ref={boxElement}
          toggled={toggled}
          select={_selected}
        >
          {children}
        </DropdownBox>
      ) : null}
    </div>
  );
}

Dropdown.Item = DropdownItem;
export default Dropdown;
