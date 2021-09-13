/**
 * Vendor imports.
 */

import { Fragment, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { PouchDBContext, AllDocuments, GetDocument } from "db";

/**
 * HomeView functional component.
 */
export const HomeView = function HomeView() {
  const db = useContext(PouchDBContext);
  const [blogs, setBlogs] = useState<
    GetDocument<AllDocuments, AllDocuments["type"]>[]
  >([]);

  const fetch = async () => {
    const response = await db.find(["type"], { selector: { type: "blog" } });

    if (response) setBlogs(response.docs);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleClick = async () => {
    const doc = await db.get("/blog:0");

    console.log(doc);
    if (doc && doc.type === "blog") {
      doc.threads["/blog:0/thread:0"].comments = {};
      await db.put("/blog:0", doc);
    }
  };

  return (
    <div>
      <div>Home</div>
      {blogs.map((blog, i) => (
        <Fragment key={`blog-${i}`}>
          <Link to={`/blogs/blog:${i}`}>{"Blog " + i}</Link>
          <br></br>
        </Fragment>
      ))}
      <button onClick={handleClick}>Test db</button>
    </div>
  );
};
