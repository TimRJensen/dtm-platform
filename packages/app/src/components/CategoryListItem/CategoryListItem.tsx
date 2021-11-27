/**
 * Vendor imports.
 */
import { useState, useRef, memo } from "react";
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
export default memo(function CategoryListItem({ doc }: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    categoryListItem: {
      height: `calc(1rem + 2 * ${spacing}px)`,
    },
    label: {
      display: "flex",
      gap: spacing / 2,
      width: "inherit",
      padding: `${spacing}px 0 ${spacing}px ${spacing}px`,
      backgroundColor: colors.primaryLighter,
      color: colors.text.secondary,
      cursor: "default",
      "&[data-toggled=true]": {
        backgroundColor: colors.primaryLightest,
        "&::before": {
          content: `"+"`,
        },
      },
      "&:hover": {
        backgroundColor: colors.primaryLightest,
      },
    },
  }));
  const [toggled, setToggled] = useState<boolean>(false);
  const nextPath = useRef(
    generatePath(path, {
      categoryId: doc.mainCategory.id,
      subCategoryIds: doc.id,
    })
  );

  const handleClick = () => {
    const subCategoryIds = window.location.pathname.split("/").slice(1)[2];

    nextPath.current = generatePath(path, {
      categoryId: doc.mainCategory.id,
      subCategoryIds: !toggled
        ? subCategoryIds
          ? `${subCategoryIds}+${doc.id}`
          : doc.id
        : subCategoryIds.indexOf("+") > -1
        ? subCategoryIds
            .split("+")
            .filter((segment) => segment !== doc.id)
            .map((segment) => (segment !== "" ? segment : undefined))
            .join("+")
        : undefined,
    });

    setTimeout(() => setToggled(!toggled));
  };

  return (
    <li css={css.categoryListItem}>
      <Link
        css={css.label}
        to={nextPath.current}
        tabIndex={-1}
        data-toggled={toggled}
        onMouseDown={handleClick}
      >
        {doc.label}
      </Link>
    </li>
  );
});
