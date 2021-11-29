/**
 * Vendor imports.
 */

import {
  useState,
  useRef,
  ComponentProps,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import Fuse from "fuse.js";

/**
 * Custom imports.
 */
import { useCSS, PropertyValueType } from "../../hooks";
import Dropdown from "../Dropdown/Dropdown";

/**
 * Types.
 */
type FuseResult = Fuse.FuseResult<string>[];

interface Props extends ComponentProps<"div"> {
  $css?: Partial<{
    [key in "combobox" | "input" | "box" | "item"]: PropertyValueType;
  }>;
  suggestions: string[];
  beginIndex?: number;
  disabled?: boolean;
}

/**
 * ComboBox functional component.
 */
export default function ComboBox({
  $css = {},
  suggestions,
  beginIndex = 2,
  disabled,
  ...rest
}: Props) {
  const { css } = useCSS(({}) => ({
    combobox: [{ cursor: "default" }, $css.combobox ?? {}],
    input: [
      {
        height: "inherit",
        width: "inherit",
        backgroundColor: "transparent",
      },
      $css.input ?? {},
    ],
    items: [$css.box ?? {}],
    item: [$css.item ?? {}],
  }));
  const [value, setValue] = useState("");
  const [items, setItems] = useState<FuseResult>();
  const fuse = useRef(new Fuse(suggestions, { threshold: 0.1 }));
  const cache = useRef(new Map<string, FuseResult>());

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    toggle: Dispatch<SetStateAction<boolean | undefined>> = () => ({})
  ) => {
    const next = event.currentTarget.value;

    if (next.length >= beginIndex) {
      let suggestions;

      if (cache.current.has(next)) {
        suggestions = cache.current.get(next);
      } else {
        if (cache.current.has("last")) {
          fuse.current.setCollection(
            cache.current.get("last")!.map((item) => item.item)
          );
        }

        suggestions = fuse.current.search(next);
      }

      if (suggestions && suggestions.length) {
        if (next.length > value.length) {
          cache.current.set("last", suggestions);
        }
        cache.current.set(next, suggestions);

        setItems(suggestions);
        toggle(true);
      }
    } else {
      if (next.length < value.length) {
        toggle(undefined);

        cache.current.delete("last");
        fuse.current.setCollection(suggestions);
        setItems(undefined);
      }
    }

    setValue(next);
  };

  const handleItemClick = (value: string) => {
    setValue(value);
  };

  return (
    <Dropdown<"input">
      {...rest}
      $css={{ dropdown: css.combobox, box: css.items }}
      label={
        <input
          css={css.input}
          value={value}
          type="text"
          onChange={handleInputChange}
        />
      }
    >
      {items?.map((item, i) => (
        <Dropdown.Item
          key={`formSuggestion-option-${item.item}-${i}`}
          css={css.item}
          onClick={handleItemClick.bind(null, item.item)}
        >
          {item.item}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}
