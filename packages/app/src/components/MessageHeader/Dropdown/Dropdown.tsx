/**
 * Vendor imports.
 */
import { useState } from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../../hooks";
import { FontIcon } from "../../FontIcon/FontIcon";

/**
 * Types.
 */
interface Props {
  onEdit: () => void;
}

/**
 * Dropdown functional component.
 */
export function Dropdown({ onEdit }: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    dropdown: {
      display: "flex",
    },
    fontIcon: {
      margin: 0,
      padding: `0 ${spacing / 2}px 0 ${spacing / 2}px`,
      backgroundColor: colors.secondary,
      "&[data-disabled=false][data-toggled=true]": {
        color: colors.text.secondary,
        "&:hover": {
          color: colors.text.secondary,
          backgroundColor: colors.secondaryDarker,
        },
      },
    },
    label: {
      color: colors.text.secondary,
    },
    controls: {
      display: "none",
      position: "relative",
      backgroundColor: colors.secondary,
      zIndex: 0,
      " &[data-show=true]": {
        display: "flex",
      },
    },
  }));
  const [show, setShow] = useState(false);

  return (
    <div
      css={css.dropdown}
      data-disabled={false}
      onClick={() => setShow(!show)}
    >
      <div css={css.controls} data-show={show}>
        <FontIcon
          $css={{ fontIcon: css.fontIcon, label: css.label }}
          type="edit"
          onClick={onEdit}
        >
          edit
        </FontIcon>
        <FontIcon
          $css={{ fontIcon: css.fontIcon, label: css.label }}
          type="delete"
        >
          delete
        </FontIcon>
        <FontIcon
          $css={{ fontIcon: css.fontIcon, label: css.label }}
          type="not_interested"
        >
          ban
        </FontIcon>
      </div>
      <FontIcon
        $css={{ fontIcon: css.fontIcon }}
        type="more_horiz"
        disabled={false}
      ></FontIcon>
    </div>
  );
}
