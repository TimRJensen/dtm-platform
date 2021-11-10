/**
 * Vendor imports.
 */
import { useState, useEffect } from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import { Dropdown } from "../Dropdown/Dropdown";

/**
 * Types.
 */
export type InputType<
  T = { [key: string]: string },
  K extends keyof T = keyof T
> = {
  key: K;
  data: Pick<T, K>[];
};

interface Props {
  label: string;
  suggestions: InputType | undefined;
  beginIndex?: number;
  validate?: (value: string) => boolean;
  onChange?: (value: string) => void;
}

/**
 * FormSuggestion functional component.
 */
export function FormSuggestion({
  label,
  suggestions,
  beginIndex = 2,
  validate,
  onChange,
}: Props) {
  const { css } = useCSS(({ spacing, borderRadius, colors }) => ({
    formCityInput: {
      display: "flex",
      alignItems: "center",
      margin: `0 0 ${spacing}px 0`,
    },
    label: {
      margin: `0 ${spacing}px 0 0`,
    },
    dropdown: {
      width: "min(304px)",
      border: "1px solid transparent",
      borderBottom: `1px solid ${colors.input.defaultBorder}`,
      cursor: "default",
      "&:focus-within": {
        border: `1px solid ${colors.input.defaultBorder}`,
        borderRadius: borderRadius / 2,
      },
      "&[data-toggled=true]": {
        borderBottom: "1px solid transparent",
        borderRadius: `${borderRadius / 2}px ${borderRadius / 2}px 0 0`,
      },
      "&[data-validated=true]": {
        backgroundColor: colors.input.success,
        border: `1px solid ${colors.input.successBorder}`,
        borderRadius: borderRadius / 2,
      },
      "&[data-validated=false]": {
        backgroundColor: colors.input.error,
        border: `1px solid ${colors.input.errorBorder}`,
        borderRadius: borderRadius / 2,
      },
    },
    input: {
      height: "1.5rem",
      width: "inherit",
      outline: "none",
      border: "none",
      backgroundColor: "transparent",
      fontSize: "1rem",
    },
    items: {
      height: "calc(6 * 1rem)",
      border: `1px solid ${colors.input.defaultBorder}`,
      borderTop: "none",
      borderRadius: `0 0 ${borderRadius / 2}px ${borderRadius / 2}px`,
      overflowY: "scroll",
      "&::-webkit-scrollbar": {
        width: "0.5rem",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: colors.primary,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: colors.secondary,
      },
    },
    item: {
      padding: `0 0 0 2px`,
      clear: "both",
      "&:hover": {
        backgroundColor: colors.secondary,
        color: colors.text.secondary,
      },
    },
  }));
  const [items, setItems] = useState<string[]>();
  const [value, setValue] = useState("");
  const [validated, setValidated] = useState<boolean>();

  useEffect(() => {
    if (!suggestions) return;

    if (onChange) {
      onChange(value);
    }

    if (value.length < beginIndex) {
      if (items) {
        setItems(undefined);
      }
      return;
    }

    const { key, data } = suggestions;
    const next = data
      .filter(
        (item) => item[key].toLowerCase().indexOf(value.toLowerCase()) > -1
      )
      .map((item) => item[key]);

    if (next[0]) {
      setItems(next);
    }
  }, [value]);

  return (
    <div
      css={css.formCityInput}
      onFocus={() => setValidated(undefined)}
      onBlur={validate ? () => setValidated(validate(value)) : undefined}
    >
      <label css={css.label}>{label}</label>
      <Dropdown
        $css={{ dropdown: css.dropdown, items: css.items }}
        label={
          <input
            css={css.input}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        }
        conditional={items !== undefined}
        data-validated={validated ?? ""}
      >
        {items
          ? items.map((item, i) => (
              <div
                key={`formCityInput-item-${item}-${i}`}
                css={css.item}
                onMouseDown={() => setValue(item)}
              >
                {item}
              </div>
            ))
          : null}
      </Dropdown>
    </div>
  );
}
