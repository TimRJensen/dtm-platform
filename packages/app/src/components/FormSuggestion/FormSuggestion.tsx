/**
 * Vendor imports.
 */
import { useState, useRef, ChangeEvent } from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import ComboBox from "../ComboBox/ComboBox";

/**
 * Types.
 */
interface Props {
  label: string;
  suggestions: string[] | undefined;
  validate?: (value: string) => boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * FormSuggestion functional component.
 */
export default function FormSuggestion({
  label,
  suggestions,
  validate,
  onChange,
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
      width: "min(300px)",
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
      width: "inherit",
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
  const selected = useRef("");

  const handleValidate = () => {
    if (validate) {
      setValidated(validate(selected.current));
    }
  };

  const handleChange = (event: ChangeEvent<any>) => {
    if (onChange) {
      onChange(event);
    }

    selected.current = event.target.value;
  };

  return (
    <div
      css={css.formSuggestion}
      onFocus={() => setValidated(undefined)}
      onBlur={handleValidate}
    >
      <label css={css.label}>{label}</label>
      <ComboBox
        $css={{ ...css }}
        suggestions={suggestions ?? []}
        onChange={handleChange}
        data-validated={validated ?? ""}
      />
    </div>
  );
}
