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
import ListItem from "../CategoryItem/CategoryItem";

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
  const [show, setShow] = useState(true);

  return (
    <section css={css.categoryList} data-show={show}>
      <header css={css.header}>
        <div css={css.label} data-type="title">
          CATEGORIES
        </div>
        <Button
          $css={{ button: css.button }}
          type="transparent"
          onClick={() => setShow(!show)}
        >
          <FontIcon $css={{ fontIcon: css.fontIcon }} type="double_arrow" />
        </Button>
      </header>
      <ListItem doc={{ id: "popular", label: "popular", subCategories: [] }} />
      {categories.map((doc) => (
        <ListItem key={doc.id} doc={doc} />
      ))}
    </section>
  );
}
