/**
 * Vendor imports.
 */

import {
  useState,
  useEffect,
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

  useEffect(() => {
    if (!value.length) {
      return;
    }

    if (value.length === beginIndex) {
      fuse.current.setCollection(suggestions);
    }

    if (value.length < beginIndex) {
      return;
    }

    if (items && items[0]) {
      fuse.current.setCollection(items.map((element) => element.item));
    }

    const next = cache.current.get(value) ?? fuse.current.search(value);

    if (next[0]) {
      cache.current.set(value, next);
      setItems(next);
    }
  }, [value]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    setToggled: Dispatch<SetStateAction<boolean | undefined>> = () => null
  ) => {
    setValue(event.currentTarget.value);

    if (event.currentTarget.value.length >= beginIndex) {
      setTimeout(() => setToggled(true));
    } else {
      setToggled(undefined);
    }
  };

  const handleItemClick = (value: string) => {
    setValue(value);
  };

  return (
    <Dropdown
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
      {items
        ? items.map((item, i) => (
            <Dropdown.Item
              key={`formSuggestion-option-${item.item}-${i}`}
              css={css.item}
              onClick={handleItemClick.bind(null, item.item)}
            >
              {item.item}
            </Dropdown.Item>
          ))
        : null}
    </Dropdown>
  );
}
