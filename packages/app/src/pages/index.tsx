/**
 * Vendor imports.
 */
import { useContext, useEffect, useState } from "react";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { BlogDocument, PouchDBContext } from "db";
import { Theme } from "../themes/dtm";
import { AppHeader } from "../components/AppHeader/AppHeader";
import { CategoryList } from "../components/CategoryList/CategoryList";
import { GridBox } from "../components/GridBox/GridBox";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const { spacing, colors } = theme;

  return {
    banner: css({
      height: "20vh",
      backgroundColor: "#000",
    }),
    body: css({
      display: "flex",
    }),
  };
};

/**
 * index functional component.
 */
export default function index() {
  const [blogs, setBlogs] = useState<BlogDocument[]>();
  const db = useContext(PouchDBContext);
  const css = _css(useTheme() as Theme);

  const fetch = async () => {
    const response = await db.find(["type"], {
      selector: {
        type: "blog",
      },
    });

    if (response) setBlogs(response.docs.slice(0, 12) as BlogDocument[]);
  };

  useEffect(() => {
    if (!blogs) fetch();
  }, []);

  return (
    <section>
      <div css={css.banner}></div>
      <AppHeader />
      <div css={css.body}>
        <CategoryList onClick={setBlogs} />
        {blogs ? <GridBox docs={blogs} /> : null}
      </div>
    </section>
  );
}
