/**
 * Vendor imports.
 */
import { useState, useRef } from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import Dropdown from "../Dropdown/Dropdown";
import FontIcon from "../FontIcon/FontIcon";

/**
 * Types.
 */
interface Props {
  items: string[];
  label: string;
  validate?: (value: string) => boolean;
}

/**
 * FormSelect functional component.
 */
export default function FormSelect({ items, label, validate }: Props) {
  const { css } = useCSS(({ spacing, borderRadius, colors }) => ({
    formSelect: {
      display: "flex",
      alignItems: "center",
      margin: `0 0 ${spacing}px 0`,
      fontSize: "1rem",
    },
    label: {
      margin: `0 ${spacing}px 0 0`,
    },
    dropdown: {
      width: "min(300px)",
    },
    selected: {
      display: "flex",
      alignItems: "center",
      height: "1.5rem",
      width: "inherit",
      outline: "none",
      padding: "1px 2px",
      border: "1px solid transparent",
      borderBottom: `1px solid ${colors.input.defaultBorder}`,
      borderRadius: 0,
      color: colors.text.primary,
      cursor: "default",
      "&[data-toggled=true]": {
        border: `1px solid ${colors.input.defaultBorder}`,
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
    fontIcon: {
      margin: "0 0 0 auto",
      color: colors.secondary,
    },
    items: {
      height: "calc(6 * 1rem)",
      border: `1px solid ${colors.input.defaultBorder}`,
      borderTop: "none",
      borderRadius: `0 0 ${borderRadius / 2}px ${borderRadius / 2}px`,
      padding: `0 0 ${spacing}px 0`,
      overflowX: "hidden",
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
    /*item: {
      display: "block",
      width: "inherit",
      outline: "none",
      padding: "1px 2px",
      textAlign: "left",
      "&:focus": {
        backgroundColor: colors.secondary,
        color: colors.text.secondary,
      },
    },*/
    item: ({ index }) => ({
      display: "block",
      width: "inherit",
      outline: "none",
      padding: "1px 2px",
      textAlign: "left",
      [`&:nth-of-type(${index + 1})`]: {
        backgroundColor: colors.secondary,
        color: colors.text.secondary,
      },
    }),
  }));
  const [value, setValue] = useState("");
  const [validated, setValidated] = useState<boolean>();
  const selected = useRef("");

  const handleBlur = () => {
    if (validate) {
      setValidated(validate(selected.current));
    }

    setValue(selected.current);
  };

  return (
    <div
      css={css.formSelect}
      onFocus={() => setValidated(undefined)}
      onBlur={handleBlur}
    >
      <div css={css.label}>{label}</div>
      <Dropdown
        $css={{ ...css }}
        label={
          <button css={css.selected} data-validated={validated ?? ""}>
            {value}
            <FontIcon $css={{ ...css }} type="expand_more" />
          </button>
        }
      >
        {items.map((item, i) => (
          <button
            key={`formSelect-option-${item}-${i}`}
            css={css.item}
            tabIndex={undefined}
            onClick={() => {
              selected.current = item;
            }}
          >
            {item}
          </button>
        ))}
      </Dropdown>
    </div>
  );
}
