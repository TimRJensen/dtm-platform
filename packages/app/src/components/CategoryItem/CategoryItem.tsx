/**
 * Vendor imports.
 */
import { useEffect, useState } from "react";
import { Link, useRouteMatch, generatePath } from "react-router-dom";

/**
 * Custom imports.
 */
import { CategoryType } from "db";
import { useCSS } from "../../hooks";
import CategoryItemMinor from "../CategoryItemMinor/CategoryItemMinor";

/**
 * Types.
 */
const path = "/categories/:categoryId/:subCategoryIds?";

type Params = {
  categoryId: string;
  subCategoryIds?: string;
};

interface Props {
  doc: CategoryType;
}

/**
 * CategoryItem functional component.u
 */
export default function CategoryItem({ doc }: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    label: {
      display: "block",
      padding: `${spacing}px 0 ${spacing}px ${spacing}px`,
      color: colors.text.secondary,
      "&:hover, &[data-active=true]": {
        backgroundColor: colors.secondary,
      },
    },
    subCategories: {
      maxHeight: 0,
      overflow: "hidden",
      transition: "max-height 0.3s ease", //collapse
      " &[data-show=true]": {
        maxHeight: 1024,
        transition: "max-height 1s ease", //show
      },
    },
  }));
  const routeMatch = useRouteMatch<Params>(path);
  const { categoryId, subCategoryIds } = routeMatch?.params ?? {};
  const [lastMatch, setLastMatch] = useState<string>();

  useEffect(() => {
    if (categoryId === doc.id) {
      setLastMatch(subCategoryIds);
    }
  }, [subCategoryIds]);

  return (
    <div>
      <Link
        css={css.label}
        to={generatePath(path, {
          categoryId: doc.id,
          subCategoryIds: lastMatch,
        })}
        data-active={categoryId === doc.id}
      >
        {doc.label}
      </Link>
      <div css={css.subCategories} data-show={categoryId === doc.id}>
        {doc.subCategories.map((subCategory) => (
          <CategoryItemMinor key={subCategory.id} doc={subCategory} />
        ))}
      </div>
    </div>
  );
}
