/**
 * Vendor imports.
 */

import { useContext, useEffect, useState } from "react";

/**
 * Custom imports.
 */
import { BlogDocument, CategoryDocument, PouchDBContext } from "db";
import { CategoryItem } from "../CategoryItem/CategoryItem";
import styles from "./styles.module.scss";

/**
 * IndexPanel functional component.
 */
interface Props {
  onClick: (blogs: BlogDocument[]) => void;
}

export const CategoryList = function CategoryList({ onClick }: Props) {
  const db = useContext(PouchDBContext);
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
      className={styles.categoryList}
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
