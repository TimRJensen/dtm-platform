/**
 * Vendor imports.
 */
import {
  useState,
  useEffect,
  HTMLInputTypeAttribute,
  ComponentProps,
  FocusEvent,
  ChangeEvent,
} from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";

/**
 * Types.
 */
interface Props extends Omit<ComponentProps<"div">, "onChange"> {
  type: HTMLInputTypeAttribute;
  label: string;
  value: string;
  dependencies?: any[];
  validate?: (value: string) => boolean;
  onChange?: (value: string) => void;
}

/**
 * FormInput functional component.
 */
export default function FormInput({
  type,
  label,
  value,
  defaultValue = "",
  dependencies,
  validate,
  onChange,
  ...rest
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
  const [validated, setValidated] = useState<boolean>();

  useEffect(() => {
    if (validated === undefined) {
      return;
    }

    if (validate) {
      setValidated(validate(value));
    }
  }, [dependencies]);

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div
      {...rest}
      css={css.formInput}
      onFocus={handleFocus}
      onBlur={handleFocus}
    >
      <label css={css.label}>{label}</label>
      <input
        css={css.input}
        type={type}
        value={value}
        data-validated={validated ?? ""}
        onChange={handleChange}
      />
    </div>
  );
}
