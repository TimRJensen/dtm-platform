/**
 * Vendor imports.
 */
import { useState } from "react";
import { Link, useRouteMatch, generatePath } from "react-router-dom";

/**
 * Custom imports.
 */
import { SubCategoryType } from "db";
import { useCSS } from "../../hooks";

/**
 * Types.
 */
const path = "/categories/:categoryId/:subCategoryIds?";

type Params = {
  categoryId: string;
  subCategoryIds?: string;
};

interface Props {
  doc: SubCategoryType;
}

/**
 * ListItemMinor functional component.
 */
export default function ListItemMinor({ doc }: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    label: {
      display: "flex",
      padding: `${spacing}px 0 ${spacing}px ${2 * spacing}px`,
      backgroundColor: colors.primaryLighter,
      color: colors.text.secondary,
      "&:hover": {
        backgroundColor: colors.primaryLightest,
      },
      "&[data-active=true]": {
        backgroundColor: colors.primaryLightest,
        "&::before": {
          paddingRight: spacing,
          content: `"+"`,
        },
      },
    },
  }));
  const routeMatch = useRouteMatch<Params>(path);
  const { subCategoryIds } = routeMatch?.params ?? {};
  const [isActive, setIsactive] = useState(false);

  return (
    <Link
      css={css.label}
      data-active={isActive}
      to={generatePath(path, {
        categoryId: doc.mainCategory.id,
        subCategoryIds: isActive
          ? subCategoryIds && subCategoryIds.indexOf("+") > -1
            ? subCategoryIds
                .split("+")
                .filter((subCategoryId) => subCategoryId !== doc.id)
                .join("+")
            : undefined
          : subCategoryIds
          ? `${subCategoryIds}+${doc.id}`
          : doc.id,
      })}
      onClick={() => setIsactive(!isActive)}
    >
      {doc.label}
    </Link>
  );
}
