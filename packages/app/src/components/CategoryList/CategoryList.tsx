/**
 * Vendor imports.
 */
import { useState, useEffect } from "react";

/**
 * Custom imports.
 */
import { CategoryType } from "db";
import { useDB, useCSS } from "../../hooks";
import { FontIcon } from "../FontIcon/FontIcon";
import { ListItem } from "./ListItem/ListItem";

/**
 * Types.
 */

/**
 * ListItem functional component.
 */
export function CategoryList() {
  const { css } = useCSS(({ spacing, colors }) => ({
    categoryList: {
      display: "flex",
      flexFlow: "column",
      minHeight: "inherit",
      width: "clamp(200px, 300px, 15vw)",
      margin: `0 ${spacing}px 0 0`,
      padding: `${spacing}px 0 0 0`,
      backgroundColor: colors.primary,
      color: colors.text.secondary,
      "&[data-show=false]": {
        width: 50,
        "& > :not(header), header [data-type=title]": {
          display: "none",
        },
        "header :not([data-type=title])": {
          margin: `0 auto 0 auto`,
          transform: "rotate(0)",
        },
      },
    },
    header: {
      display: "flex",
      alignItems: "center",
    },
    fontIcon: {
      height: 24,
      width: 24,
      left: 240,
      margin: `0 ${spacing}px 0 auto`,
      transform: "rotate(180deg)",
      transition: "transform 1s ease",
    },
    label: {
      padding: spacing,
      color: colors.text.secondary,
      ":not(div):hover, &[data-active=true]": {
        cursor: "pointer",
        backgroundColor: colors.secondary,
      },
      "&[data-show=false]": {
        display: "none",
      },
    },
  }));
  const { db, queries } = useDB();
  const [categories, setCategories] = useState<CategoryType[]>();
  const [show, setShow] = useState(true);

  const fetch = async () => {
    const response = await db.select<CategoryType>(
      "main_categories",
      queries.category,
      {}
    );

    if (!response) return;

    setCategories(response);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <section css={css.categoryList} data-show={show}>
      <header css={css.header}>
        <div css={css.label} data-type="title">
          CATEGORIES
        </div>
        <FontIcon
          $css={{ fontIcon: css.fontIcon }}
          type="double_arrow"
          onClick={() => setShow(!show)}
        />
      </header>
      <ListItem doc={{ id: "popular", label: "popular", subCategories: [] }} />
      {categories
        ? categories.map((doc) => <ListItem key={doc.id} doc={doc} />)
        : null}
    </section>
  );
}
