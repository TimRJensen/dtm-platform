/**
 * Vendor imports.
 */
import { useState, useRef } from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import Dropdown from "../Dropdown/Dropdown";
import Button from "../Button/Button";
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
      margin: `0 0 ${spacing}px 0`,
      lineHeight: "1.5rem",
    },
    label: {
      margin: `0 ${spacing}px 0 0`,
    },
    dropdown: {
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
    selected: {
      display: "flex",
      alignItems: "center",
      width: "inherit",
      outline: "none",
      padding: "1px 2px",
      borderRadius: 0,
      color: colors.text.primary,
      cursor: "default",
    },
    fontIcon: {
      margin: "0 0 0 auto",
      color: colors.secondary,
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
  const [value, setValue] = useState("");
  const [validated, setValidated] = useState<boolean>();
  const input = useRef<HTMLButtonElement>(null);

  const handleBlur = () => {
    if (validate) {
      setValidated(validate(value));
    }
  };

  const handleChildClick = (item: string) => {
    setValue(item);
    setTimeout(() => input.current?.blur());
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
          <Button css={css.selected} type="transparent" ref={input}>
            {value}
            <FontIcon $css={{ ...css }} type="expand_more" />
          </Button>
        }
        data-validated={validated ?? ""}
      >
        {items.map((item, i) => (
          <Dropdown.Item
            key={`formSelect-option-${item}-${i}`}
            css={css.item}
            onClick={handleChildClick.bind(null, item)}
          >
            {item}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
}
