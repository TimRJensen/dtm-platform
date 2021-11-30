/**
 * Vendor imports.
 */
import {
  useState,
  useRef,
  ChangeEvent,
  FocusEvent,
  ComponentProps,
} from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import ComboBox from "../ComboBox/ComboBox";

/**
 * Types.
 */
interface Props extends ComponentProps<"div"> {
  label: string;
  suggestions: string[] | undefined;
  beginIndex?: number;
  validate?: (value: string) => boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * FormSuggestion functional component.
 */
export default function FormSuggestion({
  label,
  suggestions,
  beginIndex,
  validate,
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
  const selected = useRef("");

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
        setValidated(validate(selected.current));
      }
    }
  };

  const handleChange = (event: ChangeEvent<any>) => {
    if (rest.onChange) {
      rest.onChange(event);
    }

    selected.current = event.target.value;
  };

  return (
    <div css={css.formSuggestion} onFocus={handleFocus} onBlur={handleFocus}>
      <label css={css.label}>{label}</label>
      <ComboBox
        $css={{ ...css }}
        suggestions={suggestions ?? []}
        beginIndex={beginIndex}
        onChange={handleChange}
        data-validated={validated ?? ""}
      />
    </div>
  );
}
