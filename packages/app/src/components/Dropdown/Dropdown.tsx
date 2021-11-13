/**
 * Vendor imports.
 */
import {
  useState,
  useLayoutEffect,
  useRef,
  cloneElement,
  Children,
  ReactElement,
  KeyboardEvent,
  MouseEvent,
  FocusEvent,
  HTMLAttributes,
} from "react";

/**
 * Custom imports.
 */
import { useCSS, PropertyValueType } from "../../hooks";
import Button from "../Button/Button";

/**
 * Types.
 */
interface Props extends HTMLAttributes<HTMLDivElement> {
  $css?: Partial<{
    [key in "dropdown" | "label" | "items"]: PropertyValueType;
  }>;
  label: ReactElement<any, "button"> | string;
  direction?: "down" | "left" | "right";
  disabled?: boolean;
  persists?: boolean;
  children?: ReactElement<any, "button" | typeof Button>[];
}

/**
 * Dropdown functional component.
 */
export default function Dropdown({
  $css = {},
  label,
  direction = "down",
  disabled = false,
  persists = false,
  children,
  ...rest
}: Props) {
  const { css } = useCSS(({}) => ({
    dropdown: [{ cursor: "default" }, $css.dropdown],
    items: [
      {
        display: "none",
        visibility: "hidden",
        width: "inherit",
        overflow: "hidden",
        position: "absolute",
        order: -1,
        backgroundColor: "#FFF",
        "&[data-toggled=true]": {
          display: "block",
          visibility: "visible",
        },
      },
      $css.items ?? {},
    ],
    label: [{}, $css.label],
  }));
  const [toggled, setToggled] = useState<boolean>();
  const [focus, setFocus] = useState(-1);
  const toggleElement = useRef<HTMLButtonElement>(null);
  const itemsElement = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!toggled) {
      toggleElement.current?.blur();
      return;
    }

    const element = toggleElement.current?.parentElement!;
    const items = itemsElement.current!;

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

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!children) {
      return;
    }

    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "Tab"
    ) {
      event.preventDefault();

      setFocus((suggestion) => {
        if (
          event.key === "ArrowUp" ||
          (event.key === "Tab" && event.shiftKey)
        ) {
          suggestion = suggestion > 0 ? --suggestion : children.length - 1;
        } else {
          suggestion = suggestion < children.length - 1 ? ++suggestion : 0;
        }

        return suggestion;
      });

      return;
    }

    if (event.key === "Enter" || event.key === "Escape") {
      if (event.key === "Enter" && focus > -1) {
        if (children[focus].props.onClick) {
          children[focus].props.onClick();
        }
      }

      if (!persists) {
        toggleElement.current?.blur();
      }

      return;
    }
  };

  const handleToggle = (event: MouseEvent<any>) => {
    event.preventDefault();

    if (!toggled) {
      toggleElement.current?.focus();
    } else {
      toggleElement.current?.blur();
    }

    if (typeof label === "object" && label.props.onMouseDown) {
      label.props.onMouseDown(event);
    }
  };

  const handleFocus = (event: FocusEvent<any>) => {
    if (event.type === "focus") {
      setToggled(true);

      if (typeof label === "object" && label.props.onFocus) {
        label.props.onFocus(event);
      }
    } else {
      setToggled(undefined);
    }
  };

  const handleChildToggle = (child: ReactElement) => {
    return (event: MouseEvent<any>) => {
      event.preventDefault();

      event.currentTarget.click();

      if (!persists) {
        toggleElement.current?.blur();
      }

      if (child.props.onMouseDown) {
        child.props.onMouseDown(event);
      }
    };
  };

  const handleChildHover = (child: ReactElement, index: number) => {
    return (event: MouseEvent<any>) => {
      setFocus(index);

      if (child.props.onMouseOver) {
        child.props.onMouseOver(event);
      }
    };
  };

  return (
    <div css={css.dropdown} onKeyDownCapture={handleKeyPress} {...rest}>
      {cloneElement(
        typeof label === "object" ? label : <button>{label}</button>,
        {
          ...(typeof label === "object" ? label.props : null),
          onFocus: !disabled ? handleFocus : undefined,
          onBlur: handleFocus,
          onMouseDown: !disabled ? handleToggle : undefined,
          ref: toggleElement,
          "data-disabled": disabled,
          "data-toggled": toggled,
        }
      )}
      <div css={css.items} ref={itemsElement} data-toggled={toggled}>
        {Children.map(
          children,
          (child, i) =>
            child &&
            cloneElement(child, {
              ...child.props,
              css:
                typeof child.props.css === "function"
                  ? child.props.css({ index: focus })
                  : child.props.css,
              "data-toggled": focus === i ? true : undefined,
              onMouseDown: handleChildToggle(child),
              onMouseOver: handleChildHover(child, i),
            })
        )}
      </div>
    </div>
  );
}
