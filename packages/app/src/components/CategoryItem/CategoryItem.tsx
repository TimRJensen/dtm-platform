/**
 * Vendor imports.
 */
import { MouseEvent, useState } from "react";
import { generatePath, Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { SubCategoryType } from "db";
import { useCSS } from "../../hooks";

/**
 * Types.
 */
const path = "/categories/:categoryId/:subCategoryIds?";

interface Props {
  doc: SubCategoryType;
}

/**
 * ListItemMinor functional component.
 */
export default function ListItemMinor({ doc }: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    button: {
      display: "block",
      height: "auto",
      width: "inherit",
      padding: `${spacing}px 0 ${spacing}px ${spacing}px`,
      borderRadius: 0,
      fontSize: "1rem",
      textAlign: "left",
      cursor: "default",
      "&[data-toggled]": {
        backgroundColor: colors.primaryLighter,
        color: colors.text.secondary,
      },
      "&[data-toggled=true]": {
        backgroundColor: colors.primaryLightest,
        "&::before": {
          paddingRight: spacing,
          content: `"+"`,
        },
      },
      "&:hover": {
        backgroundColor: colors.primaryLightest,
      },
    },
  }));
  const [toggled, setToggled] = useState(false);
  const subcategoryIds =
    window.location.pathname.split("/")[3]?.split("+") ?? [];

  const handleToggle = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setToggled(!toggled);
  };

  return (
    <Link
      css={css.button}
      to={generatePath(path, {
        categoryId: doc.mainCategory.id,
        subCategoryIds: toggled
          ? subcategoryIds.concat(doc.id).join("+")
          : subcategoryIds.length > 1
          ? subcategoryIds.filter((element) => element !== doc.id).join("+")
          : undefined,
      })}
      data-toggled={toggled}
      onMouseDown={handleToggle}
    >
      {doc.label}
    </Link>
  );
}
