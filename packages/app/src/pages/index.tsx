/**
 * Vendor imports.
 */
import { useState, useEffect } from "react";
import { Route } from "react-router-dom";

/**
 * Custom imports.
 */
import { CategoryType } from "db";
import { useCSS, useDB } from "../hooks";
import LoadBox from "../components/LoadBox/LoadBox";
import AppPanel from "../components/AppPanel/AppPanel";
import Categories from "./categories";

/**
 * Types.
 */

/**
 * index functional component.
 */
export default function index() {
  const { css } = useCSS(({ sizes: { appHeader, banner } }) => ({
    index: {
      display: "grid",
      gridTemplateColumns: "min-content 1fr",
      minHeight: `min(100vh - ${appHeader.height}px - ${banner.height}px)`,
    },
  }));
  const { db, queries } = useDB();
  const [categories, setCategories] = useState<CategoryType[]>();

  const fetch = async () => {
    const response = await db.select<CategoryType>(
      "main_categories",
      queries.category,
      {}
    );

    if ("error" in response) {
      return;
    }

    setCategories(response);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <LoadBox data={categories}>
      <section css={css.index}>
        <AppPanel categories={categories} />
        <Route
          path="/categories/:categoryId/:subCategoryIds?"
          component={Categories}
        />
      </section>
    </LoadBox>
  );
}
