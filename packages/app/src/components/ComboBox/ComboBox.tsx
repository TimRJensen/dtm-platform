/**
 * Vendor imports.
 */

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  KeyboardEvent,
  MouseEvent,
  FocusEvent,
  HTMLAttributes,
  ChangeEvent,
} from "react";
import Fuse from "fuse.js";

/**
 * Custom imports.
 */
import { useCSS, PropertyValueType } from "../../hooks";

/**
 * Types.
 */
type FuseResult = Fuse.FuseResult<string>[];

interface Props extends HTMLAttributes<HTMLDivElement> {
  $css?: Partial<{
    [key in "combobox" | "input" | "items" | "item"]: PropertyValueType;
  }>;
  suggestions: string[];
  beginIndex?: number;
  validated?: boolean;
}

/**
 * ComboBox functional component.
 */
export default function ComboBox({
  $css = {},
  suggestions,
  beginIndex = 2,
  validated,
  onChange,
  ...rest
}: Props) {
  const { css } = useCSS(({}) => ({
    combobox: [{ cursor: "default" }, $css.combobox],
    input: [
      {
        height: "inherit",
        width: "inherit",
        backgroundColor: "transparent",
      },
      $css.input,
    ],
    items: [
      {
        display: "none",
        visibility: "hidden",
        height: "calc(6 * 1rem)",
        width: "inherit",
        position: "absolute",
        backgroundColor: "#FFF",
        overflowX: "hidden",
        overflowY: "scroll",
        "&[data-toggled=true]": {
          display: "block",
          visibility: "visible",
        },
      },
      $css.items,
    ],
    item: (index: number) => ({
      ...(typeof $css.item === "function" ? $css.item(index) : $css.item),
    }),
  }));
  const [value, setValue] = useState("");
  const [items, setItems] = useState<FuseResult>([]);
  const [toggled, setToggled] = useState(false);
  const [suggestion, setSuggestion] = useState(-1);
  const toggleElement = useRef<HTMLInputElement>(null);
  const itemsElement = useRef<HTMLDivElement>(null);
  const fuse = useRef(new Fuse(suggestions, { threshold: 0.1 }));
  const cache = useRef(new Map<string, FuseResult>());

  useEffect(() => {
    if (!value.length) {
      return;
    }

    if (value.length < beginIndex) {
      fuse.current.setCollection(suggestions);
      setToggled(false);
      return;
    }

    if (value === items[suggestion]?.item) {
      setSuggestion(-1);
      return;
    }

    if (items[0]) {
      fuse.current.setCollection(items.map((element) => element.item));
    }

    const next = cache.current.get(value) ?? fuse.current.search(value);

    if (next[0]) {
      cache.current.set(value, next);
      setItems(next);
      setToggled(true);
    }
  }, [value]);

  useLayoutEffect(() => {
    if (!toggled) return;

    const element = toggleElement.current?.parentElement!;
    const items = itemsElement.current!;

    items.style.left = element.getBoundingClientRect().left + "px";
  }, [toggled]);

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!items) {
      return;
    }

    if (
      toggled &&
      (event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "Tab")
    ) {
      event.preventDefault();

      setSuggestion((suggestion) => {
        if (
          event.key === "ArrowUp" ||
          (event.key === "Tab" && event.shiftKey)
        ) {
          suggestion = suggestion > 0 ? --suggestion : items.length - 1;
        } else {
          suggestion = suggestion < items.length - 1 ? ++suggestion : 0;
        }

        return suggestion;
      });
    }

    if (event.key === "Enter" || event.key === "Escape") {
      if (event.key === "Enter" && suggestion > -1) {
        setValue(items[suggestion].item);
      }

      if (toggled) {
        setToggled(false);
      } else {
        toggleElement.current?.blur();
      }

      return;
    }
  };

  const handleFocus = (event: FocusEvent) => {
    if (event.type === "focus") {
      if (!toggled && value.length > beginIndex) {
        setToggled(true);
      }
    } else {
      setToggled(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }

    setValue(event.target.value);
  };

  const handleChildClick = (event: MouseEvent) => {
    event.preventDefault();

    setValue(items[suggestion].item);
    setToggled(false);
  };

  const handleChildMouseOver = (index: number) => {
    return () => setSuggestion(index);
  };

  return (
    <div css={css.combobox} {...rest}>
      <input
        css={css.input}
        value={value}
        ref={toggleElement}
        data-toggled={toggled}
        data-validated={validated ?? ""}
        onKeyDown={handleKeyPress}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleFocus}
      />
      <div css={css.items} data-toggled={toggled} ref={itemsElement}>
        {items.map((item, i) => (
          <button
            key={`comboBox-item-${item}-${i}`}
            css={css.item(suggestion)}
            onMouseOver={handleChildMouseOver(i)}
            onMouseDown={handleChildClick}
          >
            {item.item}
          </button>
        ))}
      </div>
    </div>
  );
}
