/**
 * Vendor imports.
 */
import { useState } from "react";

/**
 * Custom imports.
 */
import { CategoryType } from "db";
import { useCSS } from "../../hooks";
import Button from "../Button/Button";
import FontIcon from "../FontIcon/FontIcon";
import ListItem from "../CategoryFoldout/CategoryFoldout";

/**
 * Types.
 */
interface Props {
  categories: CategoryType[] | undefined;
}

/**
 * ListItem functional component.
 */
export default function CategoryList({ categories }: Props) {
  if (!categories) {
    return null;
  }

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
      "&[data-toggle=false]": {
        width: 50,
        "& header > div:first-of-type, & > :not(header)": {
          display: "none",
        },
        "& header button > span": {
          margin: `0 auto 0 auto`,
          transform: "rotate(0)",
        },
      },
    },
    header: {
      display: "flex",
      alignItems: "center",
    },
    label: {
      padding: spacing,
      color: colors.text.secondary,
    },
    button: {
      height: 24,
      width: 24,
      margin: `0 ${spacing}px 0 auto`,
      color: colors.secondary,
    },
    fontIcon: {
      transform: "rotate(180deg)",
      transition: "transform 1s ease",
    },
  }));
  const [toggle, setToggle] = useState(true);

  return (
    <section css={css.categoryList} data-toggle={toggle}>
      <header css={css.header}>
        <div css={css.label} data-type="title">
          CATEGORIES
        </div>
        <Button
          $css={{ ...css }}
          type="transparent"
          onClick={() => setToggle(!toggle)}
        >
          <FontIcon $css={{ ...css }} type="double_arrow" />
        </Button>
      </header>
      <ListItem doc={{ id: "popular", label: "popular", subCategories: [] }} />
      {categories.map((doc) => (
        <ListItem key={doc.id} doc={doc} />
      ))}
    </section>
  );
}
