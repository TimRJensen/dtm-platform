/**
 * Vendor imports.
 */
import { useState, useRef, MouseEvent } from "react";
import { generatePath, Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { CategoryType } from "db";
import { useCSS } from "../../hooks";
import CategoryItem from "../CategoryItem/CategoryItem";

/**
 * Types.
 */
const path = "/categories/:categoryId/:subCategoryIds?";

interface Props {
  doc: CategoryType;
}

/**
 * CategoryFoldout functional component.u
 */
export default function CategoryFoldout({ doc }: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    categoryItem: {
      width: "inherit",
      outline: "none",
    },
    link: {
      display: "block",
      padding: `${spacing}px 0 ${spacing}px ${spacing}px`,
      borderRadius: 0,
      color: colors.text.secondary,
      fontSize: "1rem",
      textAlign: "left",
      cursor: "default",
      "&:hover, &:focus": {
        backgroundColor: colors.secondary,
      },
    },
    subCategories: {
      maxHeight: 0,
      width: "inherit",
      overflow: "hidden",
      transition: "max-height 0.3s ease", //collapse
      "&[data-toggled=true]": {
        maxHeight: 1024,
        transition: "max-height 1s ease", //show
      },
    },
  }));
  const [toggled, setToggled] = useState(false);
  const subCategoryIds = useRef<string>();
  const selectElement = useRef<HTMLAnchorElement>(null);

  const handleToggle = (event: MouseEvent) => {
    event.preventDefault();

    if (!toggled) {
      selectElement.current?.focus();
    } else {
      selectElement.current?.blur();
    }
  };

  const handleBlur = () => {
    subCategoryIds.current = window.location.pathname.split("/")[3];
    setToggled(false);
  };

  return (
    <div
      css={css.categoryItem}
      onMouseDown={handleToggle}
      onFocus={() => setToggled(true)}
      onBlur={handleBlur}
    >
      <Link
        css={css.link}
        to={generatePath(path, {
          categoryId: doc.id,
          subCategoryIds: subCategoryIds.current,
        })}
        ref={selectElement}
      >
        {doc.label}
      </Link>

      <div css={css.subCategories} data-toggled={toggled}>
        {doc.subCategories.map((subCategory) => (
          <CategoryItem key={subCategory.id} doc={subCategory} />
        ))}
      </div>
    </div>
  );
}
