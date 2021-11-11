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
  validate: (value: string) => boolean;
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
      width: "min(304px)",
      outline: "none",
      border: "1px solid transparent",
      borderBottom: `1px solid ${colors.input.defaultBorder}`,
      cursor: "default",
      "&:focus": {
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
    selected: {
      display: "flex",
      alignItems: "center",
      height: "1.5rem",
      padding: "1px 2px",
    },
    fontIcon: {
      margin: "0 0 0 auto",
      color: colors.secondary,
    },
    items: {
      border: `1px solid ${colors.input.defaultBorder}`,
      borderTop: "none",
      borderRadius: `0 0 ${borderRadius / 2}px ${borderRadius / 2}px`,
    },
    item: {
      padding: `0 0 0 2px`,
      clear: "both",
      "&:hover, &[data-toggled=true]": {
        backgroundColor: colors.secondary,
        color: colors.text.secondary,
      },
    },
  }));
  const [validated, setValidated] = useState<boolean>();
  const value = useRef<string>("Region Hovedstaden");

  return (
    <div
      css={css.formSelect}
      onFocus={() => setValidated(undefined)}
      onBlur={() => setValidated(validate(value.current ?? ""))}
    >
      <div css={css.label}>{label}</div>
      <Dropdown
        $css={{ dropdown: css.dropdown, items: css.items }}
        label={
          <div css={css.selected} data-validated={validated ?? ""}>
            {value.current}
            <FontIcon $css={{ fontIcon: css.fontIcon }} type="expand_more" />
          </div>
        }
        focusable
        data-validated={validated}
      >
        {items.map((item) => (
          <div
            key={`formSelect-option-${item}`}
            css={css.item}
            data-toggled={value.current === item}
            onMouseDown={() => {
              value.current = item;
            }}
          >
            {item}
          </div>
        ))}
      </Dropdown>
    </div>
  );
}
