/**
 * Vendor imports.
 */
import { useEffect, useState } from "react";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { BlogDocument, CategoryDocument } from "db";
import { Theme } from "../../themes/dtm";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const { spacing, colors } = theme;

  return {
    categoryItem: css({
      cursor: "pointer",
      "&:hover": {
        backgroundColor: colors.secondary,
      },
    }),
    label: css({
      padding: `${spacing}px 0 ${spacing}px ${spacing}px`,
    }),
    subCategories: css({
      maxHeight: 0,
      overflow: "hidden",
      transition: "max-height 1s ease",
    }),
    subCategoriesShow: css({
      maxHeight: 1024,
      transition: "max-height 2s ease",
    }),
    subLabel: css({
      paddingLeft: spacing * 2,
      backgroundColor: colors.primaryLighter,
      "&:hover": {
        backgroundColor: colors.primaryLightest,
      },
    }),
  };
};

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
  const css = _css(useTheme() as Theme);
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
    <div css={css.categoryItem} onMouseEnter={() => setIsHovered(true)}>
      <div css={css.label} onClick={handleClick}>
        {doc.label}
      </div>
      <div
        css={
          isHovered
            ? [css.subCategories, css.subCategoriesShow]
            : css.subCategories
        }
      >
        {doc.subCategories.map((doc) => (
          <CategoryItem key={doc._id} doc={doc} onClick={onClick} />
        ))}
      </div>
    </div>
  ) : (
    <div css={[css.label, css.subLabel]} onClick={handleClick}>
      {doc.label}
    </div>
  );
};
