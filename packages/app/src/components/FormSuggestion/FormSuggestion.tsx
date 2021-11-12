/**
 * Vendor imports.
 */
import { useState, useEffect, KeyboardEvent } from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import Dropdown from "../Dropdown/Dropdown";

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
export default function FormSuggestion({
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
      "&[data-toggled=true] input:first-of-type": {
        borderBottom: "1px solid transparent",
        borderRadius: `${borderRadius / 2}px ${borderRadius / 2}px 0 0`,
      },
    },
    input: {
      height: "1.5rem",
      width: "min(300px)",
      outline: "none",
      border: "1px solid transparent",
      borderBottom: `1px solid ${colors.input.defaultBorder}`,
      backgroundColor: "transparent",
      fontSize: "1rem",
      "&:focus": {
        border: `1px solid ${colors.input.defaultBorder}`,
        borderRadius: borderRadius / 2,
      },
      "&[data-toggled=true]:focus": {},
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
      "&[data-toggled=true]": {
        backgroundColor: colors.secondary,
        color: colors.text.secondary,
      },
    },
  }));
  const [items, setItems] = useState<string[]>();
  const [value, setValue] = useState("");
  const [suggestion, setSuggestion] = useState<number>(0);
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

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!items) {
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();

      if (event.key === "ArrowUp") {
        const i = suggestion - 1;

        setSuggestion(i > -1 ? i : items.length - 1);
      } else {
        const i = suggestion + 1;

        setSuggestion(i < items.length ? i : 0);
      }

      return;
    }

    if (event.key === "Enter" || event.key === "Escape") {
      (event.target as HTMLDivElement).blur();

      if (event.key === "Enter") {
        setValue(items[suggestion]);
      }

      return;
    }
  };

  const handleBlur = () => {
    if (validate) {
      setValidated(validate(value));
    }
    setItems(undefined);
    setSuggestion(0);
  };

  return (
    <div
      css={css.formCityInput}
      onFocus={() => setValidated(undefined)}
      onBlur={handleBlur}
      onKeyDown={handleKeyPress}
    >
      <label css={css.label}>{label}</label>
      <Dropdown
        $css={{ dropdown: css.dropdown, items: css.items }}
        label={
          <input
            css={css.input}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            data-validated={validated ?? ""}
          />
        }
      >
        {items
          ? items.map((item, i) => (
              <div
                key={`formCityInput-item-${item}-${i}`}
                css={css.item}
                data-toggled={suggestion === i}
                onMouseOver={() => setSuggestion(i)}
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
