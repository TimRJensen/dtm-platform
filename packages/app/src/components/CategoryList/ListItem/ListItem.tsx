/**
 * Vendor imports.
 */
import { useEffect, useState, useContext } from "react";
import { Link, useRouteMatch, generatePath } from "react-router-dom";

/**
 * Custom imports.
 */
import { CategoryType } from "db";
import { useCSS } from "../../../hooks";
import { AppStateContext } from "../../App/app-state/main";
import { ListItemMinor } from "./ListItemMinor/ListItemMinor";

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
 * ListItem functional component.u
 */
export function ListItem({ doc }: Props) {
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
  const { dispatch } = useContext(AppStateContext);
  const routeMatch = useRouteMatch<Params>(path);
  const { categoryId, subCategoryIds } = routeMatch?.params ?? {};
  const [lastMatch, setLastMatch] = useState<string>();

  useEffect(() => {
    if (categoryId === doc.id) {
      setLastMatch(subCategoryIds);
    }
  }, [subCategoryIds]);

  useEffect(() => {
    if (categoryId === doc.id) {
      dispatch({
        type: "CURRENT_PATH",
        value: { section: "category", label: doc.label },
      });
    }
  }, [categoryId]);

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
          <ListItemMinor key={subCategory.id} doc={subCategory} />
        ))}
      </div>
    </div>
  );
}
