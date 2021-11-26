/**
 * Vendor imports.
 */
import { useState, useRef } from "react";

/**
 * Custom imports.
 */
import { CategoryType } from "db";
import { useCSS } from "../../hooks";
import Button from "../Button/Button";
import FontIcon from "../FontIcon/FontIcon";
import CategoryList from "../CategoryList/CategoryList";

/**
 * Types.
 */
interface Props {
  categories: CategoryType[] | undefined;
}

/**
 * AppPanel functional component.
 */
export default function AppPanel({ categories }: Props) {
  if (!categories) {
    return null;
  }

  const { css } = useCSS(({ spacing, colors }) => ({
    categoryList: {
      display: "flex",
      flexFlow: "column",
      minHeight: "inherit",
      width: "clamp(200px, 10vw, 300px)",
      margin: `0 ${spacing}px 0 0`,
      padding: `${spacing}px 0 0 0`,
      backgroundColor: colors.primary,
      color: colors.text.secondary,
      transition: "all 0.2s ease",
      "&[data-toggle=false]": {
        width: 48,
        "& > header": {
          "& > div:first-of-type, & ~ *": {
            width: 0,
            padding: 0,
            opacity: 0,
            overflow: "hidden",
          },
          "& > button > span": {
            transform: ["rotate(0)", "translateX(-10%)"],
          },
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
      overflow: "hidden",
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
  const [panelToggle, setPanelToggle] = useState(true);
  const [categoryToggle, setCategoryToggle] = useState("");
  const meh = useRef((categoryId?: string) => {
    if (categoryId !== undefined) {
      setCategoryToggle(categoryId);
    }

    return categoryId ?? "";
  });

  return (
    <section css={css.categoryList} data-toggle={panelToggle}>
      <header css={css.header}>
        <div css={css.label} data-type="title">
          CATEGORIES
        </div>
        <Button
          css={css.button}
          type="transparent"
          onClick={() => setPanelToggle(!panelToggle)}
        >
          <FontIcon css={css.fontIcon} type="double_arrow" />
        </Button>
      </header>
      <CategoryList
        doc={{ id: "popular", label: "popular", subCategories: [] }}
        toggled={"popular" === categoryToggle}
        toggle={meh.current}
      />
      {categories.map((doc) => (
        <CategoryList
          key={doc.id}
          doc={doc}
          toggled={doc.id === categoryToggle}
          toggle={meh.current}
        />
      ))}
    </section>
  );
}
