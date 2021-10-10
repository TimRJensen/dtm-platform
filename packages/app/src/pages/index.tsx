/**
 * Vendor imports.
 */
import { useContext, useEffect, useState } from "react";

/**
 * Custom imports.
 */
import { BlogDocument, PouchDBContext } from "db";
import { AppHeader } from "../components/AppHeader/AppHeader";
import { CategoryList } from "../components/CategoryList/CategoryList";
import { GridBox } from "../components/GridBox/GridBox";
import styles from "../styles/index.module.scss";

/**
 * index functional component.
 */
export default function index() {
  const db = useContext(PouchDBContext);
  const [blogs, setBlogs] = useState<BlogDocument[]>();

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
    <section className={styles.index}>
      <div className={styles.banner}></div>
      <AppHeader />
      <div className={styles.body}>
        <CategoryList onClick={setBlogs} />
        {blogs ? <GridBox docs={blogs} /> : null}
      </div>
    </section>
  );
}
