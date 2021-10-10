/**
 * Vendor imports.
 */
import { useEffect, useState } from "react";

/**
 * Custom imports.
 */
import { BlogDocument, CategoryDocument } from "db";
import styles from "./styles.module.scss";

/**
 * CategoryItem functional component.
 */
interface Props {
  doc: CategoryDocument;
  onClick?: (docs: BlogDocument[]) => void;
  collapse?: boolean;
}

export const CategoryItem = function CategoryItem({
  doc,
  onClick,
  collapse = false,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (collapse) {
      setIsHovered(false);
    }
  }, [collapse]);

  const handleClick = () => {
    if (onClick) onClick(doc.blogs);
  };

  return doc.subCategories ? (
    <div
      className={styles.categoryItem}
      onMouseEnter={() => setIsHovered(true)}
    >
      <div className={styles.label} onClick={handleClick}>
        {doc.label}
      </div>
      <div
        className={`${styles.subCategories} ${isHovered ? styles.show : ""}`}
      >
        {doc.subCategories.map((doc) => (
          <CategoryItem key={doc._id} doc={doc} onClick={onClick} />
        ))}
      </div>
    </div>
  ) : (
    <div className={styles.label} onClick={handleClick}>
      {doc.label}
    </div>
  );
};
