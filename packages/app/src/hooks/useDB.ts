/**
 * Vendor imports.
 */
import { useContext } from "react";

/**
 * Custom imports.
 */
import { DBContext } from "db";

/**
 * Types.
 */
const queries = {
  artifact: `
    id, 
    blog:blogId(id), 
    image,
    label, 
    content,
    period,
    mainCategory:mainCategoryId(label), 
    subCategory:subCategoryId(label)
  `,
  blog: `
    id,
    stats, 
    artifact:artifactId(
      label, 
      image, 
      content, 
      period, 
      tags, 
      mainCategory:mainCategoryId(label), 
      subCategory:subCategoryId(label)
    ),
    posts(
      id,
      createdAt,
      content,
      upvotes,
      user:accountId(id, displayName),
      stats,
      comments(
        id,
        createdAt,
        content, 
        user:accountId(id, displayName),
        stats
      )
    )
  `,
  category: `
    id, 
    label,
    subCategories:sub_categories!mainCategoryId(
      id, 
      label,
      mainCategory:mainCategoryId(id)
    )
  `,
  gridItem: `
    id,
    createdAt,
    stats,
    artifact:artifactId(
      label,
      image, 
      period, 
      mainCategory:mainCategoryId(id, label), 
      subCategory:subCategoryId(id, label)
    )
  `,
  gridItemFromCategory: `
    id,
    label,
    gridItems:blogs(
      id,
      createdAt,
      stats,
      artifact:artifactId(
        label,
        image, 
        period, 
        mainCategory:mainCategoryId(id, label), 
        subCategory:subCategoryId(id, label)
      )
    )
  `,
};
/**
 * useDB hook.
 */
export function useDB() {
  const db = useContext(DBContext);

  return {
    db,
    queries,
  };
}
