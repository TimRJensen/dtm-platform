/**
 * Vendor imports.
 */
import { useState, useEffect, lazy, useContext } from "react";
import { Route } from "react-router-dom";

/**
 * Custom imports.
 */
import { CategoryType } from "db";
import { useCSS, useDB } from "../hooks";
import { AppStateContext } from "../components/App/app-state/main";
import LoadBox from "../components/LoadBox/LoadBox";
import AppPanel from "../components/AppPanel/AppPanel";

const Categories = lazy(() => import("./categories"));
const Error = lazy(() => import("./error"));

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
  const { state } = useContext(AppStateContext);
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
          exact
          path="/categories/:categoryId/:subCategoryIds?"
          render={() => <Categories />}
        />
        <Route
          exact
          path="/error"
          render={() => <Error error={state.error} />}
        />
        <Route exact path="/" component={Categories} />
      </section>
    </LoadBox>
  );
}
