/**
 * Vendor imports.
 */
import { useState, FocusEvent, ComponentProps } from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import ComboBox from "../ComboBox/ComboBox";

/**
 * Types.
 */
interface Props extends Omit<ComponentProps<"div">, "onChange" | "onSelect"> {
  label: string;
  value: string;
  suggestions: string[] | undefined;
  beginIndex?: number;
  reset?: boolean;
  validate?: (value: string) => boolean;
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
}

/**
 * FormSuggestion functional component.
 */
export default function FormSuggestion({
  label,
  value,
  suggestions,
  defaultValue,
  beginIndex,
  validate,
  onChange,
  onSelect,
  reset,
  ...rest
}: Props) {
  const { css } = useCSS(({ spacing, borderRadius, colors }) => ({
    formSuggestion: {
      display: "flex",
      margin: `0 0 ${spacing}px 0`,
      lineHeight: "1.5rem",
    },
    label: {
      margin: `0 ${spacing}px 0 0`,
    },
    combobox: {
      width: 300,
      border: "1px solid transparent",
      borderBottom: `1px solid ${colors.input.defaultBorder}`,
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
      width: "inherit",
    },
    box: {
      height: "calc(5 * 1.5rem)",
      border: `1px solid ${colors.input.defaultBorder}`,
      borderTop: "none",
      borderRadius: `0 0 ${borderRadius / 2}px ${borderRadius / 2}px`,
      overflowY: "scroll",
    },
    item: {
      height: "1.5rem",
      padding: "1px 2px",
      color: colors.text.primary,
      fontSize: "0.8rem",
      "&[data-selected=true]": {
        backgroundColor: colors.secondary,
        color: colors.text.secondary,
      },
    },
  }));
  const [validated, setValidated] = useState<boolean>();

  const handleFocus = (event: FocusEvent<any>) => {
    if (event.type === "focus") {
      if (rest.onFocus) {
        rest.onFocus(event);
      }

      setValidated(undefined);
    } else {
      if (rest.onBlur) {
        rest.onBlur(event);
      }

      if (validate) {
        setValidated(validate(value));
      }
    }
  };

  const handleChange = (value: string) => {
    if (onChange) {
      onChange(value);
    }
  };

  const handleSelect = (value: string) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div css={css.formSuggestion} onFocus={handleFocus} onBlur={handleFocus}>
      <label css={css.label}>{label}</label>
      <ComboBox
        $css={{ ...css }}
        value={value}
        suggestions={suggestions ?? []}
        beginIndex={beginIndex}
        reset={reset}
        data-validated={validated ?? ""}
        onChange={handleChange}
        onSelect={handleSelect}
      />
    </div>
  );
}
