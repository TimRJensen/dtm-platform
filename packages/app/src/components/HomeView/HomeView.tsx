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
  const [blogs, setBlogs] = useState([] as GetDocument<AllDocuments>[]);

  const fetch = async () => {
    const response = await db.find(["type"], { selector: { type: "blog" } });

    if (response) setBlogs(response.docs);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleClick = async () => {
    await db.db.createIndex({
      index: { fields: ["_id"] },
    });
    const response = await db.db.find({
      selector: {
        _id: "/blog:0/thread:0",
      },
    });

    console.log(response);
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
