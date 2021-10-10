/**
 * Vendor imports.
 */

import { useContext, useEffect, useState } from "react";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { BlogDocument, CategoryDocument, PouchDBContext } from "db";
import { Theme } from "../../themes/dtm";
import { CategoryItem } from "../CategoryItem/CategoryItem";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const {
    colors,
    sizes: { categoryList },
  } = theme;

  return {
    categoryList: css({
      display: "flex",
      flexFlow: "column",
      height: categoryList.height,
      width: categoryList.width,
      backgroundColor: colors.primary,
      color: colors.text.secondary,
    }),
  };
};

/**
 * IndexPanel functional component.
 */
interface Props {
  onClick: (blogs: BlogDocument[]) => void;
}

export const CategoryList = function CategoryList({ onClick }: Props) {
  const db = useContext(PouchDBContext);
  const css = _css(useTheme() as Theme);
  const [categories, setCategories] = useState<CategoryDocument[]>([]);
  const [collapse, setCollapse] = useState(false);

  const fetch = async () => {
    const response = await db.find(["type"], {
      selector: {
        type: "category",
      },
    });

    if (response) setCategories(response.docs as CategoryDocument[]);
  };

  useEffect(() => {
    if (categories.length === 0) fetch();
  }, []);

  return (
    <section
      css={css.categoryList}
      onMouseLeave={() => setCollapse(true)}
      onMouseEnter={() => setCollapse(false)}
    >
      {categories.map((category) => (
        <CategoryItem
          key={category._id}
          doc={category}
          onClick={onClick}
          collapse={collapse}
        />
      ))}
    </section>
  );
};
