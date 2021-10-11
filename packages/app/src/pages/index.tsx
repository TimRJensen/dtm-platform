/**
 * Vendor imports.
 */
import { useContext, useEffect, useState } from "react";
import { css, useTheme } from "@emotion/react";
import GridLoader from "react-spinners/GridLoader";

/**
 * Custom imports.
 */
import { BlogDocument, PouchDBContext } from "db";
import { useIsLoading } from "../hooks";
import { Theme } from "../themes/dtm";
import { AppHeader } from "../components/AppHeader/AppHeader";
import { CategoryList } from "../components/CategoryList/CategoryList";
import { GridBox } from "../components/GridBox/GridBox";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  return {
    banner: css({
      height: "20vh",
      backgroundColor: "#000",
    }),
    view: css({
      display: "flex",
    }),
    spinner: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 40vh)",
      width: "87vw",
    }),
  };
};

/**
 * index functional component.
 */
export default function index() {
  const db = useContext(PouchDBContext);
  const [blogs, setBlogs] = useState<BlogDocument[]>([]);
  const { isLoading, onLoad } = useIsLoading(blogs);
  const theme = useTheme() as Theme;
  const css = _css(theme);

  const fetch = async () => {
    const response = await db.find(["type"], {
      selector: {
        type: "blog",
      },
    });

    if (response) setBlogs(response.docs.slice(0, 12) as BlogDocument[]);
  };

  useEffect(() => {
    if (blogs.length === 0) fetch();
  }, []);

  return (
    <section>
      <div css={css.banner}></div>
      <AppHeader />
      <div css={css.view} onLoad={onLoad}>
        <CategoryList onClick={setBlogs} />
        {isLoading() ? (
          <div css={css.spinner}>
            <GridLoader color={theme.colors.primary} loading={isLoading()} />
          </div>
        ) : null}
        {blogs ? (
          <GridBox
            style={{ display: isLoading() ? "none" : "flex" }}
            docs={blogs}
            columns={3}
          />
        ) : null}
      </div>
    </section>
  );
}
