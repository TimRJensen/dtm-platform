/**
 * Vendor imports.
 */
import { useState, HTMLInputTypeAttribute } from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";

/**
 * Types.
 */
interface Props {
  type: HTMLInputTypeAttribute;
  label: string;
  validate?: (value: string) => boolean;
  initial?: string;
  onBlur?: (value: string) => void;
}

/**
 * FormInput functional component.
 */
export default function FormInput({
  type,
  label,
  initial,
  validate,
  onBlur,
}: Props) {
  const { css } = useCSS(({ spacing, borderRadius, colors }) => ({
    formInput: {
      display: "flex",
      alignItems: "center",
      margin: `0 0 ${spacing}px 0`,
    },
    label: {
      margin: `0 ${spacing}px 0 0`,
    },
    input: {
      height: "1.5rem",
      width: "min(300px)",
      outline: "none",
      border: "1px solid transparent",
      borderBottom: `1px solid ${colors.input.defaultBorder}`,
      fontSize: "1rem",
      "&:focus": {
        border: `1px solid ${colors.input.defaultBorder}`,
        borderRadius: borderRadius / 2,
      },
      "&[data-validated=true]": {
        border: `1px solid ${colors.input.successBorder}`,
        borderRadius: borderRadius / 2,
        backgroundColor: colors.input.success,
      },
      "&[data-validated=false]": {
        border: `1px solid ${colors.input.errorBorder}`,
        borderRadius: borderRadius / 2,
        backgroundColor: colors.input.error,
      },
    },
  }));
  const [value, setValue] = useState(initial ?? "");
  const [validated, setValidated] = useState<boolean>();

  const handleFocus = () => {
    if (validate) setValidated(validate(value));
    if (onBlur) onBlur(value);
  };

  return (
    <div
      css={css.formInput}
      onFocus={() => setValidated(undefined)}
      onBlur={validate || onBlur ? handleFocus : undefined}
    >
      <label css={css.label}>{label}</label>
      <input
        css={css.input}
        type={type}
        value={value}
        data-validated={validated ?? ""}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}
