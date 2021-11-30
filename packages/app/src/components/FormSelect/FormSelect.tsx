/**
 * Vendor imports.
 */
import { useState, ComponentProps, FocusEvent } from "react";

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
interface Props extends ComponentProps<"div"> {
  items: string[];
  label: string;
  validate?: (value: string) => boolean;
}

/**
 * FormSelect functional component.
 */
export default function FormSelect({ items, label, validate, ...rest }: Props) {
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

  const handleSelect = (item: string) => {
    setValue(item);
  };

  return (
    <div css={css.formSelect} onFocus={handleFocus} onBlur={handleFocus}>
      <div css={css.label}>{label}</div>
      <Dropdown
        $css={{ ...css }}
        label={
          <Button css={css.selected} type="transparent">
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
            onClick={handleSelect.bind(null, item)}
            onKeyDown={handleSelect.bind(null, item)}
          >
            {item}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
}
